import { useEffect, useMemo, useState } from 'react'
import LogPanel from '../components/LogPanel'
import TabletCTA from '../components/TabletCTA'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase2Props = {
  meeting: Meeting | null
  onBack: () => void
  onNext: () => void
}

type ScenarioTurn = {
  speaker: string
  original: string
  without: string
  withAI: string
  reactionBefore: string
  reactionAfter: string
  aiTags: string[]
  step: string
}

const turns: ScenarioTurn[] = [
  {
    speaker: '정대표(정부)',
    original: '“PIM 반도체와 엑사스케일 확보가 시급합니다.”',
    without: '전문용어만 반복 → 시민: “또 어려운 말… 우리 지역은 왜 배제되죠?”',
    withAI: 'AI가 “돌봄 로봇·재난예측을 위한 기반 기술”로 번역 + ROI 대신 “안전 인프라” 프레이밍',
    reactionBefore: '반응(시민): 방어적 태도, 갈등 지수 상승',
    reactionAfter: '반응(시민): “아, 생활·안전에 직접 닿는 거네요.” 공감 형성',
    aiTags: ['전문용어', '긴급성 프레이밍', '가치: 안전'],
    step: 'Step1-2'
  },
  {
    speaker: '시민 패널',
    original: '“지역은 늘 뒷순위예요. 실질적 혜택이 없잖아요.”',
    without: '감정적 표현 그대로 전달 → 정부: “지역 나눠주기는 비효율적입니다.”',
    withAI: 'AI가 감정 태깅(불안/형평) 후 “생활·안전 R&D 비중 명시”로 재작성',
    reactionBefore: '반응(정부): 방어적, 논점 이탈',
    reactionAfter: '반응(정부): “C바스켓 최소 비율을 명시하겠습니다.” 조건부 합의',
    aiTags: ['감정: 불안', '가치: 형평', '정책 조건'],
    step: 'Step2-3'
  },
  {
    speaker: '정대표(정부)',
    original: '“전략기술에 선투자해야 세수를 확보합니다.”',
    without: '시민: “결국 성장만 보고 복지는 나중?” → 갈등 심화',
    withAI: 'AI가 “선투자 후 지역 환류” 시나리오 제시 + 평가위원회 공동 설계 제안',
    reactionBefore: '반응(시민): 합의 지점 없음',
    reactionAfter: '반응(시민): “지역 환류 로드맵을 넣으면 동의합니다.”',
    aiTags: ['재프레이밍', '조건부 합의', '프로세스 제안'],
    step: 'Step3-5'
  }
]

const bridgeSentences = [
  '예산을 3바스켓(A:전략기술 / B:응용 / C:생활·안전·기초)으로 구분하여 관리한다.',
  '전략기술(A)에 집중하되, 생활·안전·기초(C) 바스켓은 전체의 최소 N% 이상 의무 배정한다.',
  '청년 연구자·시민이 참여하는 평가위원회 시범사업을 도입한다.',
  '지역 R&D는 나눠주기가 아니라 “지역 특화형 전략산업”과 연계한다.'
]

const mockLogs = [
  {
    label: 'System prompt',
    content: '당신의 이름은 "AI Agent"이며... 감정·가치 번역과 조건부 합의를 설계합니다.',
    type: 'input' as const
  },
  {
    label: 'User(Phase2) 입력',
    content: '집단 A: 전략기술 집중 투자 / 집단 B: 지역 소외 및 단기 성과 비판',
    type: 'input' as const
  },
  {
    label: 'AI 출력 – 가치/감정 태깅',
    content: '[전문용어][긴급성][형평성][불안] 태깅 → 재프레이밍 제안',
    type: 'output' as const
  },
  {
    label: 'AI 출력 – 브릿지 문장',
    content: '예산 3바스켓, C바스켓 최소 비율, 평가위원회 시범사업...',
    type: 'output' as const
  }
]

export default function Phase2({ meeting, onBack, onNext }: Phase2Props) {
  const [bridgeStatus, setBridgeStatus] = useState<Record<number, 'adopted' | 'edited' | 'dropped'>>({
    0: 'adopted',
    1: 'edited',
    2: 'adopted',
    3: 'dropped'
  })
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
      without: 82,
      withAI: 41
    }),
    []
  )

  const consensusLevel = useMemo(
    () => ({
      without: 24,
      withAI: 68
    }),
    []
  )

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: 0 }}>입출력 로그 보기</h3>
          <button className="btn" style={{ minWidth: '120px' }} onClick={() => setShowLogs(!showLogs)}>
            {showLogs ? '숨기기' : '열기'}
          </button>
        </div>
        {showLogs && (
          <div style={{ marginTop: '0.75rem' }}>
            <LogPanel
              description="시스템/사용자 입력과 AI 출력 흐름을 함께 보여주는 로그입니다."
              logs={mockLogs}
            />
          </div>
        )}
      </div>

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
              {turns.map((turn) => renderTurnCard(turn, side))}
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
            {bridgeSentences.map((sentence, idx) => {
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
