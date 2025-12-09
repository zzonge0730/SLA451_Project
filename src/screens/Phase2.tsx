import { useEffect, useMemo, useState } from 'react'
import LogPanel from '../components/LogPanel'
import TabletCTA from '../components/TabletCTA'
import { scenarioVariants } from '../data/scenario'
import type { ScenarioLog, ScenarioMode, ScenarioTurn } from '../data/scenario'
import { requestLLM } from '../utils/llmClient'
import { buildMediatorPrompt } from '../utils/promptTemplates'
import { IS_DEMO_MODE } from '../config'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase2Props = {
  meeting: Meeting | null
  onBack: () => void
  onNext: () => void
  scenarioMode: ScenarioMode
}

export default function Phase2({ meeting, onBack, onNext, scenarioMode }: Phase2Props) {
  const activeScenario = useMemo(() => scenarioVariants[scenarioMode], [scenarioMode])
  const [logItems, setLogItems] = useState<ScenarioLog[]>(activeScenario.logs)

  // LLM controls (LLM 모드일 때만 사용)
  const [tone, setTone] = useState<'diplomatic' | 'direct'>('diplomatic')
  const [audience, setAudience] = useState<'citizen' | 'official'>('citizen')
  const [userInput, setUserInput] = useState<string>('“지역은 늘 뒷순위예요. 안전장치가 없어요.”')
  const [participantProfile, setParticipantProfile] = useState<string>('시민단체 · 지역 환류 강조 · 현 정책에 신뢰 낮음')
  const [llmOutput, setLlmOutput] = useState<string>('')
  const [parsedLlm, setParsedLlm] = useState<{
    sentiment?: string
    value_tags?: string[]
    fallacy?: string
    rewrite?: string
    consensus_stub?: string
    minority_note?: string
  } | null>(null)
  const [llmError, setLlmError] = useState<string>('')
  const [llmLoading, setLlmLoading] = useState<boolean>(false)

  const createBridgeStatus = (defaults: Array<'adopted' | 'edited' | 'dropped'>) => {
    return defaults.reduce<Record<number, 'adopted' | 'edited' | 'dropped'>>((acc, status, idx) => {
      acc[idx] = status
      return acc
    }, {})
  }

  const [bridgeStatus, setBridgeStatus] = useState<Record<number, 'adopted' | 'edited' | 'dropped'>>(
    () => createBridgeStatus(activeScenario.bridgeDefaults)
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showLogs, setShowLogs] = useState(false)
  const [activeView, setActiveView] = useState<'with' | 'without'>('with')
  const [isWide, setIsWide] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth >= 1024
  })

  useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setBridgeStatus(createBridgeStatus(activeScenario.bridgeDefaults))
    setLogItems(activeScenario.logs)
    setLlmOutput('')
    setLlmError('')
  }, [activeScenario])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleBridgeStatusChange = (idx: number, status: 'adopted' | 'edited' | 'dropped') => {
    setBridgeStatus({ ...bridgeStatus, [idx]: status })
    const statusText = status === 'adopted' ? '채택' : status === 'edited' ? '수정' : '폐기'
    showToast(`브릿지 문장 ${idx + 1}번이 "${statusText}"되었습니다. AI가 학습 중...`)
  }

  const conflictLevel = useMemo(
    () => ({
      without: activeScenario.metrics.conflictWithout,
      withAI: activeScenario.metrics.conflictWithAI
    }),
    [activeScenario]
  )

  const consensusLevel = useMemo(
    () => ({
      without: activeScenario.metrics.consensusWithout,
      withAI: activeScenario.metrics.consensusWithAI
    }),
    [activeScenario]
  )

  const systemPromptTemplate = useMemo(
    () => buildMediatorPrompt({ tone, audience, participantProfile }),
    [tone, audience, participantProfile]
  )

  const safeParseLlmJson = (raw: string) => {
    try {
      const trimmed = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
      const start = trimmed.indexOf('{')
      const end = trimmed.lastIndexOf('}')
      if (start === -1 || end === -1) return null
      const candidate = trimmed.slice(start, end + 1)
      return JSON.parse(candidate) as {
        sentiment?: string
        value_tags?: string[]
        fallacy?: string
        rewrite?: string
        consensus_stub?: string
        minority_note?: string
      }
    } catch (e) {
      return null
    }
  }

  const handleRunLLM = async () => {
    setLlmLoading(true)
    setLlmError('')
    try {
      const result = await requestLLM({
        systemPrompt: systemPromptTemplate,
        userInput
      })
      setLlmOutput(result.content)
      setParsedLlm(safeParseLlmJson(result.content))
      setLogItems([
        {
          label: 'System prompt (live)',
          content: systemPromptTemplate,
          type: 'input'
        },
        {
          label: 'User 입력 (live)',
          content: userInput,
          type: 'input'
        },
        {
          label: result.usedMock ? 'LLM 출력 (mock fallback)' : 'LLM 출력',
          content: result.content,
          type: 'output'
        }
      ])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'LLM 요청 중 알 수 없는 오류'
      setLlmError(message)
      setParsedLlm(null)
    } finally {
      setLlmLoading(false)
    }
  }

  const renderTurnCard = (turn: ScenarioTurn, side: 'with' | 'without') => {
    const isWithAI = side === 'with'
    const bg = isWithAI ? '#F1F8F6' : '#FFF5F5'
    const border = isWithAI ? '#52b788' : '#ef5350'
    const title = isWithAI ? 'AI 개입 후' : 'AI 미개입'
    const reaction = isWithAI ? turn.reactionAfter : turn.reactionBefore
    const content = isWithAI ? turn.withAI : turn.without

    return (
      <div
        key={`${turn.speaker}-${side}`}
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '10px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#263238', fontSize: '1rem' }}>{turn.speaker}</div>
            <div style={{ fontSize: '0.9rem', color: '#607D8B' }}>{title} · {turn.step}</div>
          </div>
          <span
            style={{
              display: 'inline-block',
              padding: '0.35rem 0.75rem',
              background: isWithAI ? '#C8E6C9' : '#FFCDD2',
              borderRadius: '16px',
              color: isWithAI ? '#1B5E20' : '#B71C1C',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {isWithAI ? '공감/합의' : '갈등 심화'}
          </span>
        </div>
        <div style={{ color: '#37474F', fontSize: '1rem', lineHeight: 1.5 }}>{turn.original}</div>
        <div style={{ color: '#455A64', fontSize: '0.95rem', lineHeight: 1.6 }}>{content}</div>
        <div style={{ color: '#546E7A', fontSize: '0.95rem', lineHeight: 1.5, fontWeight: 600 }}>
          반응: {reaction}
        </div>
        {isWithAI && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem 0.5rem' }}>
            {turn.aiTags.map((tag) => (
              <span
                key={tag}
                className="tag"
                style={{
                  background: '#E0F2F1',
                  borderColor: '#80CBC4',
                  color: '#00695C',
                  margin: 0
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  const selectedSides = isWide ? (['without', 'with'] as const) : ([activeView] as const)

  return (
    <div>
      <div className="page-header">
        <button
          className="btn"
          onClick={onBack}
          style={{ marginBottom: '1rem' }}
        >
          ← Phase 선택으로
        </button>
        <h1 className="page-title">Phase 2 – 논증 구조화 & 가치 번역</h1>
        <p className="phase-desc">AI 완충지대 핵심 단계: 논쟁 구조도 → 가치 번역 → 브릿지 문장</p>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>시나리오 소스</h3>
            <p className="text-muted" style={{ marginBottom: 0 }}>{activeScenario.description}</p>
          </div>
          <span className="tag" style={{ background: '#eef4ff', borderColor: '#cddcff', color: '#1f3b80' }}>
            {scenarioMode === 'llm' ? 'LLM 모드' : '하드코딩 데모'}
          </span>
        </div>
      </div>

      {scenarioMode === 'llm' && (
        <div className="card" style={{ marginBottom: '1rem', background: '#f7fbff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
            <div>
              <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>LLM 프롬프트 콘솔</h3>
              <p className="text-muted" style={{ marginBottom: 0 }}>톤·대상·입력을 바꿔 LLM 출력/로그를 즉시 확인합니다.</p>
            </div>
            <span className="tag" style={{ background: '#e3f2fd', borderColor: '#bbdefb', color: '#1a73e8', margin: 0 }}>
              Live LLM / mock fallback
            </span>
          </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#455a64' }}>톤</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className={`btn ${tone === 'diplomatic' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.45rem 0.9rem' }}
                      onClick={() => setTone('diplomatic')}
                    >
                      부드럽게
                    </button>
                    <button
                      className={`btn ${tone === 'direct' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.45rem 0.9rem' }}
                      onClick={() => setTone('direct')}
                    >
                      직설적
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#455a64' }}>대상</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className={`btn ${audience === 'citizen' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.45rem 0.9rem' }}
                      onClick={() => setAudience('citizen')}
                    >
                      시민/커뮤니티
                    </button>
                    <button
                      className={`btn ${audience === 'official' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.45rem 0.9rem' }}
                      onClick={() => setAudience('official')}
                    >
                      정부/공무원
                    </button>
                  </div>
                </div>
              </div>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#455a64' }}>입력 발언</label>
              <textarea
                className="form-control"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={3}
                placeholder="발언을 입력하면 LLM이 JSON 태깅+재작성"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#455a64' }}>참여자 프로필(맥락)</label>
              <input
                className="form-control"
                value={participantProfile}
                onChange={(e) => setParticipantProfile(e.target.value)}
                placeholder="직업/이해관계/입장"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleRunLLM} disabled={llmLoading}>
                {llmLoading ? 'LLM 호출 중...' : 'LLM 실행'}
              </button>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                API 키 없으면 모크 출력이 표시됩니다.
              </span>
            </div>
            {llmError && <div style={{ color: '#c62828', fontSize: '0.9rem' }}>LLM 오류: {llmError}</div>}
            {llmOutput && (
              <>
                {parsedLlm && (
                  <div className="card" style={{ background: '#f9fbff', border: '1px solid #cde4ff' }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>LLM 구조화 결과(JSON)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.95rem' }}>
                      <div><strong>감정:</strong> {parsedLlm.sentiment || '—'}</div>
                      <div><strong>가치 태그:</strong> {(parsedLlm.value_tags || []).join(', ') || '—'}</div>
                      <div><strong>논리 오류:</strong> {parsedLlm.fallacy || '—'}</div>
                      <div><strong>재작성:</strong> {parsedLlm.rewrite || '—'}</div>
                      <div><strong>합의 스텁:</strong> {parsedLlm.consensus_stub || '—'}</div>
                      <div><strong>소수 의견:</strong> {parsedLlm.minority_note || '—'}</div>
                    </div>
                  </div>
                )}
                <div className="card" style={{ background: '#fff', border: '1px solid #cde4ff' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>LLM 출력 (원문)</div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{llmOutput}</pre>
                </div>
              </>
            )}
            <details className="card" style={{ background: '#fff', border: '1px dashed #d0e2ff' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#1a73e8' }}>프롬프트 미리보기</summary>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, paddingTop: '0.5rem' }}>{systemPromptTemplate}</pre>
            </details>
          </div>
        </div>
      )}

      {IS_DEMO_MODE && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: 0 }}>입출력 로그 보기</h3>
            <button className="btn" style={{ minWidth: '120px' }} onClick={() => setShowLogs(!showLogs)}>
              {showLogs ? '숨기기' : '열기'}
            </button>
          </div>
          {showLogs && (
            <div style={{ marginTop: '0.75rem' }}>
              <LogPanel
                description={`${activeScenario.label} 기준 시스템/사용자 입력과 AI 출력 흐름입니다.`}
                logs={logItems}
              />
            </div>
          )}
        </div>
      )}

      {/* 상단 지표 카드 */}
      <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ background: '#fffef7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>Conflict Level</h3>
            <span className="tag" style={{ background: '#FFEBEE', borderColor: '#FFCDD2', color: '#C62828' }}>AI 미적용: {conflictLevel.without}</span>
          </div>
          <div style={{ height: '10px', background: '#ffe0e0', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div style={{ width: `${conflictLevel.without}%`, height: '100%', background: '#ef5350' }} />
          </div>
          <div style={{ height: '10px', background: '#e0f2f1', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${conflictLevel.withAI}%`, height: '100%', background: '#26a69a' }} />
          </div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#546E7A' }}>AI 개입 후 {conflictLevel.withAI}로 하락</div>
        </div>
        <div className="card" style={{ background: '#f7fffb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>Consensus Readiness</h3>
            <span className="tag" style={{ background: '#E0F2F1', borderColor: '#80CBC4', color: '#00695C' }}>AI 적용: {consensusLevel.withAI}</span>
          </div>
          <div style={{ height: '10px', background: '#e0e0e0', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div style={{ width: `${consensusLevel.without}%`, height: '100%', background: '#b0bec5' }} />
          </div>
          <div style={{ height: '10px', background: '#e0f2f1', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${consensusLevel.withAI}%`, height: '100%', background: '#43a047' }} />
          </div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#546E7A' }}>AI 개입 후 {consensusLevel.withAI}로 상승</div>
        </div>
      </div>

      {/* 비교 뷰 헤더 */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: isWide ? 'row' : 'column', gap: '0.75rem', alignItems: isWide ? 'center' : 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 className="card-title" style={{ marginBottom: '0.35rem' }}>1대1 분기 시나리오</h2>
            <p className="text-muted" style={{ marginBottom: 0 }}>같은 발언이 AI 개입 유무에 따라 어떻게 바뀌는지 즉시 비교합니다.</p>
          </div>
          {!isWide && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn ${activeView === 'without' ? 'btn-primary' : ''}`}
                style={{ padding: '0.5rem 1rem', minHeight: 'auto', fontSize: '0.95rem' }}
                onClick={() => setActiveView('without')}
              >
                AI 없음
              </button>
              <button
                className={`btn ${activeView === 'with' ? 'btn-primary' : ''}`}
                style={{ padding: '0.5rem 1rem', minHeight: 'auto', fontSize: '0.95rem' }}
                onClick={() => setActiveView('with')}
              >
                AI 있음
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 비교 영역 */}
      <div className={isWide ? 'grid grid-2' : ''} style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        {selectedSides.map((side) => (
          <div key={side} className="card" style={{ background: side === 'with' ? '#F5FBF9' : '#FFF7F7' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 className="card-title" style={{ marginBottom: '0.25rem', fontSize: '1.2rem' }}>
                  {side === 'with' ? 'AI 개입 후' : 'AI 미개입'}
                </h3>
                <p className="text-muted" style={{ marginBottom: 0 }}>
                  {side === 'with' ? '태깅 → 번역 → 재프레이밍 → 조건부 합의' : '원문 그대로 전달 → 오해/방어'}
                </p>
              </div>
              <span
                className="tag"
                style={{
                  background: side === 'with' ? '#E0F2F1' : '#FFEBEE',
                  borderColor: side === 'with' ? '#80CBC4' : '#FFCDD2',
                  color: side === 'with' ? '#00695C' : '#C62828',
                  margin: 0
                }}
              >
                {side === 'with' ? '완충지대 활성화' : '완충지대 없음'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeScenario.turns.map((turn) => renderTurnCard(turn, side))}
            </div>
          </div>
        ))}
      </div>

      {/* 브릿지 문장 선택 */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h2 className="card-title">브릿지 문장 제안 & 선택</h2>
          <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            AI가 제안한 조건부 합의 표현입니다. 채택/수정/폐기를 선택하면 지표가 업데이트됩니다.
          </p>
          <div className="grid grid-2">
            {activeScenario.bridgeSentences.map((sentence, idx) => {
              const status = bridgeStatus[idx]
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    border: status === 'adopted' ? '1px solid #4caf50' : status === 'edited' ? '1px solid #ff9800' : '1px solid #e53935',
                    background:
                      status === 'adopted'
                        ? '#f1fbf2'
                        : status === 'edited'
                        ? '#fff7ed'
                        : '#fff5f5'
                  }}
                >
                  <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                    {sentence}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={`btn ${status === 'adopted' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', minHeight: '48px' }}
                      onClick={() => handleBridgeStatusChange(idx, 'adopted')}
                    >
                      채택
                    </button>
                    <button
                      className={`btn ${status === 'edited' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', minHeight: '48px' }}
                      onClick={() => handleBridgeStatusChange(idx, 'edited')}
                    >
                      수정
                    </button>
                    <button
                      className={`btn ${status === 'dropped' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', minHeight: '48px' }}
                      onClick={() => handleBridgeStatusChange(idx, 'dropped')}
                    >
                      폐기
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="divider"></div>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
            <span className="tag" style={{ background: '#f1fbf2', borderColor: '#c8e6c9', color: '#2e7d32' }}>
              채택 {Object.values(bridgeStatus).filter((s) => s === 'adopted').length}
            </span>
            <span className="tag" style={{ background: '#fff7ed', borderColor: '#ffcc80', color: '#e65100' }}>
              수정 {Object.values(bridgeStatus).filter((s) => s === 'edited').length}
            </span>
            <span className="tag" style={{ background: '#fff5f5', borderColor: '#ffcdd2', color: '#c62828' }}>
              폐기 {Object.values(bridgeStatus).filter((s) => s === 'dropped').length}
            </span>
          </div>
        </div>
      </div>

      {/* 토스트 메시지 */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          background: '#4a90e2',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          {toastMessage}
        </div>
      )}

      <TabletCTA onPrev={onBack} onNext={onNext} nextDisabled={false} nextLabel="다음 단계 → (Phase 3)" />
    </div>
  )
}
