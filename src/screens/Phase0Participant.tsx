import { useState } from 'react'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase0ParticipantProps = {
  meeting: Meeting | null
  onBack: () => void
}

type Message = {
  speaker: 'ai' | 'participant'
  text: string
}

// TODO: 나중에 실제 LLM 응답으로 대체될 "데모용 복붙 텍스트" (issue-dependent copy)
const mockInterviewFlow = [
  {
    ai: '회의 전에 몇 가지 여쭤보겠습니다. 국가 R&D 예산 분배 논의에서, 당신이 가장 크게 느끼는 감정은 무엇인가요?',
    participant: '솔직히 박탈감과 분노가 큽니다. 우리 지역엔 응급실도 없고 학교 과학실도 엉망인데, 뉴스엔 맨날 AI·양자에 수조 원 투자했다고만 나오니까요.'
  },
  {
    ai: '말씀하신 내용을 보면, 박탈감(지역 소외)과 분노(희생양이라는 느낌)가 섞여 있는 것 같습니다. 그 뒤에 있는 핵심 가치는 "형평성"과 "지역 생존권", "생활 안전"으로 요약할 수 있을까요?',
    participant: '네, 맞습니다. 국가 R&D가 국민 세금이라면, 지역 주민들의 생존과 안전을 먼저 챙겨야 한다고 생각합니다.'
  },
  {
    ai: '그럼 당신의 프로필을 이렇게 정리해보겠습니다: "지역 생존권과 형평성을 중시하는 시민단체 활동가. 국가 R&D가 주민 삶과 동떨어져 있으며, 성장을 명분으로 지역이 또다시 희생될 것을 우려함." 이 요약이 당신의 자기 이해와 대체로 일치하나요?',
    participant: '네, 정확합니다. 우리가 겪는 현실이 잘 반영된 것 같아요.'
  }
]

export default function Phase0Participant({ meeting, onBack }: Phase0ParticipantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { speaker: 'ai', text: mockInterviewFlow[0].ai }
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [interviewComplete, setInterviewComplete] = useState(false)

  const handleSend = () => {
    if (!userInput.trim()) return

    const nextStep = currentStep + 1
    const isLastStep = nextStep >= mockInterviewFlow.length - 1

    const newMessages: Message[] = [
      ...messages,
      { speaker: 'participant', text: userInput },
      { speaker: 'ai', text: mockInterviewFlow[nextStep]?.ai || '' }
    ]

    setMessages(newMessages)
    setUserInput('')
    setCurrentStep(nextStep)

    if (isLastStep) {
      setInterviewComplete(true)
    }
  }

  // TODO: 나중에 실제 LLM 분석 결과로 대체될 데이터
  const mockProfileSummary = {
    role: '지역 시민단체 활동가 (생활·안전 R&D 중시)',
    coreValues: '형평성, 지역 생존권, 생활·안전, 공공성',
    mainEmotions: '박탈감(소외), 분노(희생양), 불안(지역 소멸)',
    summary: '국가 R&D가 지역 주민 삶과 너무 동떨어져 있고, "성장"이라는 이름으로 지역이 또다시 희생될 것을 깊이 우려함.'
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
        <h1 className="page-title">Phase 0 – 내 프로필 입력</h1>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
        <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          회의 전날, 온라인 사전 인터뷰
        </p>
      </div>

      <div className="grid grid-2">
        {/* 좌측: 대화형 인터뷰 */}
        <div>
          <div className="card">
            <h2 className="card-title">AI Agent와의 사전 인터뷰</h2>
            <div style={{ 
              padding: '0.5rem 0.75rem', 
              background: '#fff9f0', 
              border: '1px solid #ffd4a3', 
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#8b5a00'
            }}>
              ※ 현재는 스크립트 기반 데모입니다. 실제 시스템에서는 LLM이 참여자 입력을 요약·반영합니다.
            </div>
            <div style={{ 
              minHeight: '400px', 
              maxHeight: '500px', 
              overflowY: 'auto',
              padding: '1rem',
              background: '#f9f9f9',
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid #eee'
            }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    marginBottom: '1.5rem',
                    textAlign: msg.speaker === 'ai' ? 'left' : 'right'
                  }}
                >
                  <div style={{
                    display: 'inline-block',
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: msg.speaker === 'ai' ? '#e8f4f8' : '#fff4e6',
                    border: msg.speaker === 'ai' ? '1px solid #b8dce8' : '1px solid #ffd4a3',
                    color: msg.speaker === 'ai' ? '#2c5f7c' : '#8b5a00'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '600', 
                      marginBottom: '0.25rem',
                      opacity: 0.8
                    }}>
                      {msg.speaker === 'ai' ? 'AI Agent' : '나'}
                    </div>
                    <div style={{ lineHeight: '1.6' }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!interviewComplete ? (
              <div>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px', marginBottom: '0.75rem' }}
                  placeholder="(데모에서는 아래 예시 답변을 참고하세요)"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleSend}
                  style={{ width: '100%' }}
                >
                  답변 전송
                </button>
              </div>
            ) : (
              <div style={{ 
                padding: '1rem', 
                background: '#f0f7ff', 
                borderRadius: '6px',
                border: '1px solid #b8dce8',
                textAlign: 'center'
              }}>
                <p style={{ color: '#2c5f7c', margin: 0 }}>
                  인터뷰가 완료되었습니다. 우측에서 프로필 요약을 확인하세요.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 우측: AI 프로필 요약 */}
        <div>
          <div className="card">
            <h2 className="card-title">AI가 분석한 내 프로필</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>역할:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555' }}>
                {mockProfileSummary.role}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>핵심 가치:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555' }}>
                {mockProfileSummary.coreValues}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>주요 감정:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555' }}>
                {mockProfileSummary.mainEmotions}
              </p>
            </div>

            <div className="divider"></div>

            <div>
              <strong>한 줄 요약:</strong>
              <p style={{ marginTop: '0.5rem', color: '#555', lineHeight: '1.6' }}>
                {mockProfileSummary.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
