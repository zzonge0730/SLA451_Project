import { useState, useEffect, useRef, useMemo } from 'react'
import { FaFileContract, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa'
import StepIndicator from '../components/StepIndicator'
import { requestLLM } from '../utils/llmClient'
import { IS_DEMO_MODE } from '../config'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type ParticipantConsensusScreenProps = {
  meeting: Meeting | null
  onBack: () => void
}

// TODO: 나중에 실제 합의문 데이터로 대체
const mockAgreementSummary = {
  mainPoints: [
    '예산을 3바스켓(A:전략기술 / B:응용 / C:생활·안전·기초)으로 구분',
    '생활·안전(C) 바스켓은 전체의 최소 N% 이상을 의무 배정',
    '청년 연구자와 시민 대표가 참여하는 평가위원회 시범사업 도입'
  ],
  remainingIssues: [
    '전략기술(A) 바스켓의 예산 비중 상한선 설정 여부',
    '생활·안전(C) 바스켓의 구체적인 최소 비율(%) 수치',
    '평가위원회 시범사업의 위원 구성 비율 및 권한 범위'
  ]
}

const mockReflectionQuestions = [
  '오늘 논의를 통해 내 입장이 어디까지 이동했나요?',
  '남아있는 가장 큰 우려는 무엇인가요?',
  '이 합의안이 실제로 실행될 수 있다고 생각하시나요?'
]

export default function ParticipantConsensusScreen({ meeting, onBack }: ParticipantConsensusScreenProps) {
  const [agreementStatus, setAgreementStatus] = useState<'agree' | 'conditional' | 'disagree' | null>(null)
  const [satisfaction, setSatisfaction] = useState<number>(5)
  const [fairness, setFairness] = useState<'yes' | 'no' | 'partial'>('partial')
  const [understanding, setUnderstanding] = useState<number>(3)
  const [remainingConcerns, setRemainingConcerns] = useState('')
  const [freeFeedback, setFreeFeedback] = useState('')
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [llmLoading, setLlmLoading] = useState(false)
  const [llmError, setLlmError] = useState('')
  const [llmRaw, setLlmRaw] = useState('')
  const [llmParsed, setLlmParsed] = useState<{
    sentiment?: string
    key_issue?: string
    unresolved_point?: string
    suggestion_for_next?: string
  } | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)
  
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      channelRef.current = new BroadcastChannel('demo_sync_channel')
      return () => {
        if (channelRef.current) {
          channelRef.current.close()
        }
      }
    }
  }, [])

  const systemPrompt = useMemo(
    () =>
      `You are an analyst summarizing feedback after a consensus meeting. Extract key signals from the user's free-text answer.\nReturn JSON only with: { "sentiment": "...", "key_issue": "...", "unresolved_point": "...", "suggestion_for_next": "..." }`,
    []
  )

  const safeParse = (raw: string) => {
    try {
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
      const start = cleaned.indexOf('{')
      const end = cleaned.lastIndexOf('}')
      if (start === -1 || end === -1) return null
      return JSON.parse(cleaned.slice(start, end + 1)) as {
        sentiment?: string
        key_issue?: string
        unresolved_point?: string
        suggestion_for_next?: string
      }
    } catch (e) {
      return null
    }
  }

  const handleSubmit = async () => {
    setIsSubmitted(true)
    setLlmError('')
    setLlmRaw('')
    setLlmParsed(null)
    setLlmLoading(true)

    const payload = {
      agreementStatus,
      satisfaction,
      fairness,
      understanding,
      remainingConcerns,
      freeFeedback,
      reflectionAnswers
    }

    try {
      const result = await requestLLM({
        systemPrompt,
        userInput: freeFeedback || remainingConcerns || 'feedback: none'
      })
      setLlmRaw(result.content)
      setLlmParsed(safeParse(result.content))
      // 주관자에게 피드백 전송
      if (channelRef.current) {
        channelRef.current.postMessage({ 
          type: 'PARTICIPANT_CONSENSUS_FEEDBACK', 
          participant: '지역 시민단체 활동가',
          feedbackPayload: payload,
          llmOutput: result.content
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'LLM 요청 중 오류'
      setLlmError(message)
    } finally {
      setLlmLoading(false)
    }
  }
  
  return (
    <div>
      <div className="page-header">
        <button
          className="btn"
          onClick={onBack}
          style={{ marginBottom: '1rem' }}
        >
          ← 돌아가기
        </button>
        <h1 className="page-title">합의문 피드백 & 성찰</h1>
        <p className="phase-desc">조건부 합의안 검토 및 입장 변화 성찰</p>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
        <StepIndicator
          steps={['발언 입력', '재구성 확인', '번역 비교', '합의 확인']}
          current={4}
        />
        <div className="card" style={{ background: '#ECEFF1', borderColor: '#CFD8DC', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#263238' }}>지금 하실 일</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#546E7A', lineHeight: '1.7' }}>
            <li>합의안 요약과 남은 쟁점을 확인하세요.</li>
            <li>동의/조건부/비동의를 선택하고 남은 우려를 한 줄로 남깁니다.</li>
            <li>제출하면 주관자 화면에 바로 반영됩니다.</li>
          </ul>
        </div>
        <div style={{ 
          marginTop: '0.5rem', 
          padding: '0.5rem 0.75rem', 
          background: '#fff9f0', 
          border: '1px solid #ffd4a3', 
          borderRadius: '4px',
          fontSize: '0.85rem',
          color: '#8b5a00'
        }}>
          페르소나: 지역 시민단체 활동가 (생활·안전 R&D 중시)
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '1.5rem' }}>
        {/* 좌측: 합의문 요약 & 동의 여부 */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaFileContract style={{ color: '#4a90e2', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>조건부 합의안 요약</h2>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '0.95rem', color: '#333' }}>주요 합의 사항:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.8' }}>
                {mockAgreementSummary.mainPoints.map((point, idx) => (
                  <li key={idx} style={{ fontSize: '0.9rem' }}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '0.95rem', color: '#333' }}>남은 쟁점:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
                {mockAgreementSummary.remainingIssues.map((issue, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem' }}>{issue}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                이 합의안에 대한 의견:
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  className={`btn ${agreementStatus === 'agree' ? 'btn-primary' : ''}`}
                  onClick={() => setAgreementStatus('agree')}
                  style={{ 
                    textAlign: 'left',
                    background: agreementStatus === 'agree' ? '#4caf50' : '#fff',
                    borderColor: agreementStatus === 'agree' ? '#4caf50' : '#ddd',
                    color: agreementStatus === 'agree' ? 'white' : '#333'
                  }}
                >
                  <FaCheckCircle style={{ marginRight: '0.5rem' }} />
                  동의함
                </button>
                <button
                  className={`btn ${agreementStatus === 'conditional' ? 'btn-primary' : ''}`}
                  onClick={() => setAgreementStatus('conditional')}
                  style={{ 
                    textAlign: 'left',
                    background: agreementStatus === 'conditional' ? '#ff9800' : '#fff',
                    borderColor: agreementStatus === 'conditional' ? '#ff9800' : '#ddd',
                    color: agreementStatus === 'conditional' ? 'white' : '#333'
                  }}
                >
                  <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                  조건부 동의
                </button>
                <button
                  className={`btn ${agreementStatus === 'disagree' ? 'btn-primary' : ''}`}
                  onClick={() => setAgreementStatus('disagree')}
                  style={{ 
                    textAlign: 'left',
                    background: agreementStatus === 'disagree' ? '#f44336' : '#fff',
                    borderColor: agreementStatus === 'disagree' ? '#f44336' : '#ddd',
                    color: agreementStatus === 'disagree' ? 'white' : '#333'
                  }}
                >
                  <FaTimesCircle style={{ marginRight: '0.5rem' }} />
                  비동의
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                빠른 평가(정량)
              </strong>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#455a64' }}>
                  만족도 (1~10)
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={satisfaction}
                    onChange={(e) => setSatisfaction(Number(e.target.value))}
                    disabled={isSubmitted}
                  />
                  <span style={{ fontWeight: 600 }}>현재: {satisfaction}</span>
                </label>
                <div>
                  <div style={{ marginBottom: '0.35rem', color: '#455a64', fontWeight: 600 }}>절차적 공정성</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(['yes', 'partial', 'no'] as const).map((opt) => (
                      <button
                        key={opt}
                        className={`btn ${fairness === opt ? 'btn-primary' : ''}`}
                        onClick={() => setFairness(opt)}
                        disabled={isSubmitted}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        {opt === 'yes' ? '예' : opt === 'partial' ? '부분적으로' : '아니오'}
                      </button>
                    ))}
                  </div>
                </div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#455a64' }}>
                  상호 이해도 (1~5)
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={understanding}
                    onChange={(e) => setUnderstanding(Number(e.target.value))}
                    disabled={isSubmitted}
                  />
                  <span style={{ fontWeight: 600 }}>현재: {understanding}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 남은 우려 & 성찰 질문 */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">남은 우려</h2>
            <textarea
              className="form-textarea"
              style={{ minHeight: '120px', width: '100%' }}
              placeholder="이 합의안에서 여전히 걱정되는 점이나 보완이 필요한 부분을 입력하세요..."
              value={remainingConcerns}
              onChange={(e) => setRemainingConcerns(e.target.value)}
              disabled={isSubmitted}
            />
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">서술형 피드백</h2>
            <p className="text-muted" style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              가장 아쉬운 점이나 다음에 반드시 다룰 내용을 한 문장으로 적어주세요.
            </p>
            <textarea
              className="form-textarea"
              style={{ minHeight: '100px', width: '100%' }}
              placeholder="예: 지역 환류 로드맵과 안전장치 기준이 모호합니다."
              value={freeFeedback}
              onChange={(e) => setFreeFeedback(e.target.value)}
              disabled={isSubmitted}
            />
          </div>

          <div className="card">
            <h2 className="card-title">성찰 질문</h2>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              오늘 논의를 통해 생각이 바뀐 점이나 남은 질문을 적어보세요.
            </p>
            {mockReflectionQuestions.map((question, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#555', 
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  {question}
                </p>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px', width: '100%' }}
                  placeholder="답변을 입력하세요..."
                  value={reflectionAnswers[idx] || ''}
                  onChange={(e) => setReflectionAnswers({ ...reflectionAnswers, [idx]: e.target.value })}
                  disabled={isSubmitted}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isSubmitted ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={!agreementStatus || llmLoading}
            style={{ minWidth: '200px', fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            {llmLoading ? '제출 중...' : '피드백 제출하기'}
          </button>
        </div>
      ) : (
        <>
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #4caf50'
          }}>
            <p style={{ color: '#2e7d32', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
              ✓ 피드백이 제출되었습니다. 주관자 화면에 전송되었습니다.
            </p>
          </div>

          <div className="card" style={{ marginTop: '1.25rem' }}>
            <h2 className="card-title" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>AI 구조화 결과</h2>
            {llmError && <div style={{ color: '#c62828', marginBottom: '0.75rem' }}>LLM 오류: {llmError}</div>}
            {llmLoading && <div className="text-muted">LLM 분석 중...</div>}
            {!llmLoading && llmParsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#333' }}>
                <div><strong>감정:</strong> {llmParsed.sentiment || '—'}</div>
                <div><strong>핵심 이슈:</strong> {llmParsed.key_issue || '—'}</div>
                <div><strong>미해결 포인트:</strong> {llmParsed.unresolved_point || '—'}</div>
                <div><strong>다음 제안:</strong> {llmParsed.suggestion_for_next || '—'}</div>
              </div>
            )}
            {!llmLoading && !llmParsed && !llmError && (
              <div className="text-muted">LLM 결과를 파싱할 수 없습니다. 원문을 확인하세요.</div>
            )}
            {IS_DEMO_MODE && llmRaw && (
              <details style={{ marginTop: '0.75rem' }}>
                <summary style={{ cursor: 'pointer', color: '#1a73e8', fontWeight: 600 }}>LLM 출력 원문 보기</summary>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, paddingTop: '0.5rem' }}>{llmRaw}</pre>
              </details>
            )}
          </div>
        </>
      )}
    </div>
  )
}
