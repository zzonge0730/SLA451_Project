import { useState, useEffect, useRef } from 'react'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase3ParticipantProps = {
  meeting: Meeting | null
  onBack: () => void
}

const mockMyVerifyQuestions = [
  '내가 제시한 "점진적 전환"의 구체적 기준과 시기는 무엇인가요?',
  '사회적 안전망 구축을 위한 예산과 정책의 구체적 내용은 무엇인가요?',
  '기존 산업 종사자들의 재교육 프로그램은 어떻게 운영되나요?',
  '지역 경제 보호를 위한 모니터링 체계는 무엇인가요?'
]

const mockCritiqueQuestions = [
  '내 논증에서 놓치고 있는 부분은 무엇일까요?',
  '정부의 "경쟁력 강화" 논리와 내 "형평성" 논리를 어떻게 절충할 수 있을까요?',
  '에너지 전환의 긴급성과 사회적 보호 사이의 균형점은 어디인가요?',
  '내가 제시한 해결책이 실현 가능한가요?',
  '장기적으로 이 정책이 미래 세대에게 미칠 영향은 무엇인가요?'
]

export default function Phase3Participant({ meeting, onBack }: Phase3ParticipantProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)
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
  
  const handleResponseChange = (key: string, value: string) => {
    setResponses({ ...responses, [key]: value })
  }
  
  const handleSubmit = () => {
    setIsComplete(true)
    // 주관자에게 응답 완료 알림 전송
    if (channelRef.current) {
      channelRef.current.postMessage({ 
        type: 'PARTICIPANT_RESPONSE', 
        phase: 3,
        participant: '참여자 A',
        message: '응답 완료!'
      })
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
          ← Phase 선택으로
        </button>
        <h1 className="page-title">Phase 3 – 검증·비평·성찰 질문</h1>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      <div className="grid grid-2">
        {/* 좌측: 내 논증 검증 질문 */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">내 논증 검증 질문</h2>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              내가 제시한 논증을 검증하기 위한 질문들입니다.
            </p>
            {mockMyVerifyQuestions.map((question, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                  {question}
                </p>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px', width: '100%' }}
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
          <div className="card">
            <h2 className="card-title">비평 & 성찰 질문</h2>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              내 논증을 비판적으로 검토하고 성찰하기 위한 질문들입니다.
            </p>
            {mockCritiqueQuestions.map((question, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                  {question}
                </p>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px', width: '100%' }}
                  placeholder="답변을 입력하세요..."
                  value={responses[`critique-${idx}`] || ''}
                  onChange={(e) => handleResponseChange(`critique-${idx}`, e.target.value)}
                  disabled={isComplete}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {!isComplete ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ minWidth: '200px' }}>
            응답 제출하기
          </button>
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
            ✓ 응답이 제출되었습니다. 주관자 화면에 알림이 전송되었습니다.
          </p>
        </div>
      )}
    </div>
  )
}

