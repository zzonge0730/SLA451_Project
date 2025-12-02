import { useState } from 'react'
import StepIndicator from '../components/StepIndicator'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase0ParticipantProps = {
  meeting: Meeting | null
  onBack: () => void
  onNext?: () => void
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

export default function Phase0Participant({ meeting, onBack, onNext }: Phase0ParticipantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { speaker: 'ai', text: mockInterviewFlow[0].ai }
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [skipAnimation, setSkipAnimation] = useState(false)

  // Typewriter 효과
  const typewriterEffect = (text: string, targetSetter: (value: string) => void, onComplete?: () => void) => {
    if (skipAnimation) {
      targetSetter(text)
      onComplete?.()
      return
    }

    setIsTyping(true)
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        targetSetter(text.substring(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        onComplete?.()
      }
    }, 30) // 타이핑 속도 조절
  }

  const handleChipClick = (answer: string) => {
    typewriterEffect(answer, setUserInput, () => {
      // 타이핑 완료 후 자동 전송
      setTimeout(() => {
        handleSend(answer)
      }, 300)
    })
  }

  const handleSend = (prefilledText?: string) => {
    const textToSend = prefilledText || userInput
    if (!textToSend.trim()) return

    const nextStep = currentStep + 1
    const isLastStep = nextStep >= mockInterviewFlow.length - 1

    const newMessages: Message[] = [
      ...messages,
      { speaker: 'participant', text: textToSend },
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
        <StepIndicator
          steps={['사전 인터뷰', '발언 입력', '번역 비교', '합의 확인']}
          current={1}
        />
        <div className="card" style={{ background: '#ECEFF1', borderColor: '#CFD8DC', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#263238' }}>지금 하실 일</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#546E7A', lineHeight: '1.7' }}>
            <li>아래 "시나리오대로 답변" 버튼을 눌러 자동 입력하거나 짧게 입력하세요.</li>
            <li>AI가 질문을 던지면 버튼 한 번으로 답변을 채워 넣을 수 있습니다.</li>
            <li>완료 후 우측에서 요약을 확인하고 다음 단계로 이동합니다.</li>
          </ul>
        </div>
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
                {/* 즉시 입력 토글 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  marginBottom: '0.5rem',
                  fontSize: '0.85rem'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    cursor: 'pointer',
                    color: '#666'
                  }}>
                    <input
                      type="checkbox"
                      checked={skipAnimation}
                      onChange={(e) => setSkipAnimation(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    즉시 입력
                  </label>
                </div>

                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px', marginBottom: '0.75rem' }}
                  placeholder={isTyping ? "답변이 입력되고 있습니다..." : "답변을 입력하거나 아래 추천 답변을 선택하세요"}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  disabled={isTyping}
                />

                {/* 추천 답변 Chip */}
                {mockInterviewFlow[currentStep]?.participant && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: '#666', 
                      marginBottom: '0.5rem',
                      fontWeight: '500'
                    }}>
                      추천 답변:
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem' 
                    }}>
                      <button
                        className="btn"
                        onClick={() => handleChipClick(mockInterviewFlow[currentStep].participant)}
                        disabled={isTyping}
                        style={{
                          fontSize: '0.9rem',
                          padding: '0.5rem 1rem',
                          background: '#f0f7ff',
                          border: '1px solid #4a90e2',
                          color: '#1565c0',
                          cursor: isTyping ? 'not-allowed' : 'pointer',
                          opacity: isTyping ? 0.5 : 1
                        }}
                      >
                        시나리오대로 답변하기
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  className="btn btn-primary" 
                  onClick={() => handleSend()}
                  disabled={!userInput.trim() || isTyping}
                  style={{ 
                    width: '100%',
                    opacity: (!userInput.trim() || isTyping) ? 0.5 : 1,
                    cursor: (!userInput.trim() || isTyping) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isTyping ? '입력 중...' : '답변 전송'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f0f7ff', 
                  borderRadius: '6px',
                  border: '1px solid #b8dce8',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <p style={{ color: '#2c5f7c', margin: 0 }}>
                    인터뷰가 완료되었습니다. 우측에서 프로필 요약을 확인하세요.
                  </p>
                </div>
                {onNext && (
                  <button 
                    className="btn btn-primary" 
                    onClick={onNext}
                    style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                  >
                    회의 참여 준비 완료 →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 우측: AI 프로필 요약 (인터뷰 완료 후 표시) */}
        <div>
          {interviewComplete ? (
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
          ) : (
            <div className="card" style={{ 
              background: '#f9f9f9', 
              border: '1px dashed #ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <div style={{ textAlign: 'center', color: '#999' }}>
                <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>⏳</p>
                <p style={{ fontSize: '0.9rem' }}>
                  인터뷰를 완료하면<br />
                  AI 프로필 요약이 여기에 표시됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
