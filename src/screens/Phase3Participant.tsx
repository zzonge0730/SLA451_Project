import { useState, useEffect, useRef } from 'react'
import { FaCheckCircle, FaQuestionCircle, FaLightbulb } from 'react-icons/fa'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase3ParticipantProps = {
  meeting: Meeting | null
  onBack: () => void
  onNext?: () => void
}

// TODO: Phase2 결과에서 가져올 내 논증 요약
const mockMyArgumentSummary = {
  position: '지역 생존권과 형평성을 중시하는 시민단체 활동가',
  coreValues: ['형평성', '지역 생존권', '생활·안전', '공공성'],
  mainArgument: '국가 R&D가 지역 주민 삶과 너무 동떨어져 있고, "성장"이라는 이름으로 지역이 또다시 희생될 것을 깊이 우려함. 전략기술 투자와 별도로 생활·안전 R&D 최소 비율을 설정해야 함.',
  bridgeProposals: [
    '예산을 3바스켓(A:전략기술 / B:응용 / C:생활·안전·기초)으로 구분',
    '생활·안전(C) 바스켓은 전체의 최소 N% 이상을 의무 배정',
    '청년 연구자와 시민 대표가 참여하는 평가위원회 시범사업 도입'
  ]
}

const mockMyVerifyQuestions = [
  '내가 제시한 "점진적 전환"의 구체적 기준과 시기는 무엇인가요?',
  '사회적 안전망 구축을 위한 예산과 정책의 구체적 내용은 무엇인가요?',
  '기존 산업 종사자들의 재교육 프로그램은 어떻게 운영되나요?',
  '지역 경제 보호를 위한 모니터링 체계는 무엇인가요?',
  '생활·안전 R&D 최소 비율의 구체적 수치는 어떻게 정할 수 있을까요?'
]

const mockCritiqueQuestions = [
  '내 논증에서 놓치고 있는 부분은 무엇일까요?',
  '정부의 "경쟁력 강화" 논리와 내 "형평성" 논리를 어떻게 절충할 수 있을까요?',
  '내가 제시한 해결책이 실현 가능한가요?',
  '장기적으로 이 정책이 미래 세대에게 미칠 영향은 무엇인가요?',
  '전략기술 투자와 생활·안전 R&D의 균형을 어떻게 보장할 수 있을까요?'
]

const mockReflectionQuestions = [
  '오늘 논의를 통해 내 입장이 어디까지 이동했나요?',
  '남아있는 가장 큰 우려는 무엇인가요?',
  '이 합의안이 실제로 실행될 수 있다고 생각하시나요?'
]

export default function Phase3Participant({ meeting, onBack, onNext }: Phase3ParticipantProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
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
  
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])
  
  const handleResponseChange = (key: string, value: string) => {
    setResponses({ ...responses, [key]: value })
  }
  
  const handleSubmit = () => {
    setIsComplete(true)
    setToastMessage('응답이 제출되었습니다!')
    
    // 주관자에게 응답 완료 알림 전송
    if (channelRef.current) {
      channelRef.current.postMessage({ 
        type: 'PARTICIPANT_RESPONSE', 
        phase: 3,
        participant: '지역 시민단체 활동가',
        message: '응답 완료!'
      })
    }
    
    // 2초 후 자동으로 다음 단계로 이동
    if (onNext) {
      setTimeout(() => {
        onNext()
      }, 2000)
    }
  }
  
  const allVerifyAnswered = mockMyVerifyQuestions.every((_, idx) => responses[`verify-${idx}`]?.trim())
  const allCritiqueAnswered = mockCritiqueQuestions.every((_, idx) => responses[`critique-${idx}`]?.trim())
  const allReflectionAnswered = mockReflectionQuestions.every((_, idx) => responses[`reflection-${idx}`]?.trim())
  const canSubmit = allVerifyAnswered && allCritiqueAnswered && allReflectionAnswered
  
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
        <h1 className="page-title">Phase 3 – 검증·비평·성찰 질문</h1>
        <p className="phase-desc">내 논증을 검증하고 비판적으로 성찰하기</p>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      {/* 1. 내 논증 요약 */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#f0f7ff', border: '2px solid #4a90e2' }}>
        <h2 className="card-title" style={{ color: '#1565c0' }}>내 논증 요약</h2>
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: '0.95rem', color: '#333' }}>입장:</strong>
          <p style={{ marginTop: '0.25rem', color: '#555', lineHeight: '1.6' }}>
            {mockMyArgumentSummary.position}
          </p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: '0.95rem', color: '#333' }}>핵심 가치:</strong>
          <p style={{ marginTop: '0.25rem', color: '#555', lineHeight: '1.6' }}>
            {mockMyArgumentSummary.coreValues.join(', ')}
          </p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: '0.95rem', color: '#333' }}>주요 논증:</strong>
          <p style={{ marginTop: '0.25rem', color: '#555', lineHeight: '1.6' }}>
            {mockMyArgumentSummary.mainArgument}
          </p>
        </div>
        <div>
          <strong style={{ fontSize: '0.95rem', color: '#333' }}>제안한 브릿지:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.8' }}>
            {mockMyArgumentSummary.bridgeProposals.map((proposal, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem' }}>{proposal}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '1.5rem' }}>
        {/* 좌측: Verify 질문 */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaQuestionCircle style={{ color: '#4a90e2', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>검증 질문</h2>
            </div>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              내가 제시한 논증을 검증하기 위한 질문들입니다.
            </p>
            {mockMyVerifyQuestions.map((question, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <p style={{ 
                  color: '#555', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  {idx + 1}. {question}
                </p>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '100px', width: '100%' }}
                  placeholder="답변을 입력하세요..."
                  value={responses[`verify-${idx}`] || ''}
                  onChange={(e) => handleResponseChange(`verify-${idx}`, e.target.value)}
                  disabled={isComplete}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 우측: Critique & Reflection 질문 */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaLightbulb style={{ color: '#ff9800', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>비평 질문</h2>
            </div>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              내 논증을 비판적으로 검토하기 위한 질문들입니다.
            </p>
            {mockCritiqueQuestions.map((question, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <p style={{ 
                  color: '#555', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  {idx + 1}. {question}
                </p>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '100px', width: '100%' }}
                  placeholder="답변을 입력하세요..."
                  value={responses[`critique-${idx}`] || ''}
                  onChange={(e) => handleResponseChange(`critique-${idx}`, e.target.value)}
                  disabled={isComplete}
                />
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaCheckCircle style={{ color: '#4caf50', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>성찰 질문</h2>
            </div>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              오늘 논의를 통해 생각이 바뀐 점이나 남은 질문을 적어보세요.
            </p>
            {mockReflectionQuestions.map((question, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <p style={{ 
                  color: '#555', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  {idx + 1}. {question}
                </p>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '100px', width: '100%' }}
                  placeholder="답변을 입력하세요..."
                  value={responses[`reflection-${idx}`] || ''}
                  onChange={(e) => handleResponseChange(`reflection-${idx}`, e.target.value)}
                  disabled={isComplete}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Toast 메시지 */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: '#4caf50',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaCheckCircle />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      
      {!isComplete ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            style={{ 
              minWidth: '250px',
              fontSize: '1.1rem',
              padding: '1rem 2rem',
              opacity: canSubmit ? 1 : 0.5,
              cursor: canSubmit ? 'pointer' : 'not-allowed'
            }}
          >
            응답 제출하기
          </button>
          {!canSubmit && (
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
              모든 질문에 답변해주세요.
            </p>
          )}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '1px solid #4caf50'
        }}>
          <p style={{ color: '#2e7d32', fontSize: '1rem', fontWeight: '600' }}>
            ✓ 응답이 제출되었습니다. 다음 단계로 이동합니다...
          </p>
        </div>
      )}
    </div>
  )
}

