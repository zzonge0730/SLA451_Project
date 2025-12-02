import { useState } from 'react'
import PhaseGuide from '../components/PhaseGuide'
import TabletCTA from '../components/TabletCTA'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase0Props = {
  meeting: Meeting | null
  onBack: () => void
}

type Message = {
  speaker: 'ai' | 'participant'
  text: string
}

const mockInterviewFlow = [
  {
    ai: '회의 전에 몇 가지 여쭤보겠습니다. K-택소노미 논의에서, 지금 가장 크게 느끼는 감정은 무엇인가요?',
    participant: '솔직히 말하면 불안과 분노요. LNG랑 블루수소를 이렇게 서둘러 녹색분류체계에 넣으려는 게 이해가 안 돼요.'
  },
  {
    ai: '지금 말씀을 정리하면, 불안(좌초자산·그린워싱 리스크)과 분노(녹색 기준이 너무 빨리, 느슨하게 정해지는 것)가 섞여 있는 것으로 보입니다. 그 뒤에 있는 핵심 가치는 "제도 무결성"과 "국제 기준과의 정합성"으로 요약할 수 있을까요?',
    participant: '네, 맞아요. K-택소노미는 우리나라 기후금융 제도의 첫 출발인데, 여기서부터 애매하게 가면 국내·국제 시장에서 신뢰를 잃을 수 있다고 생각해요.'
  },
  {
    ai: '그럼 Expert님의 프로필을 이렇게 정리해보겠습니다: "국제적 신뢰와 제도 무결성을 중시하는 신중한 비판자. 특히 논란이 큰 LNG·블루수소를 무리하게 포함시키는 것이 장기적으로 좌초자산·그린워싱·시장 혼선 리스크를 키운다고 우려함." 이 요약이 Expert님의 자기 이해와 대체로 일치하나요?',
    participant: '네, 이 정도면 제가 왜 이렇게 세게 반대하는지 잘 정리된 것 같아요.'
  }
]

const emotionOptions = ['불안 😟', '분노 😠', '의심 🤔', '압박감 😣']
const valueOptions = ['제도 무결성', '국제 정합성', '예방 원칙', '실행 가능성', '전환 속도']

export default function Phase0({ meeting, onBack }: Phase0Props) {
  const [messages, setMessages] = useState<Message[]>([
    { speaker: 'ai', text: mockInterviewFlow[0].ai }
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['불안 😟', '분노 😠'])
  const [selectedValues, setSelectedValues] = useState<string[]>(['제도 무결성', '국제 정합성'])

  const handleSend = () => {
    if (!userInput.trim()) return

    const newMessages: Message[] = [
      ...messages,
      { speaker: 'participant', text: userInput },
      { speaker: 'ai', text: mockInterviewFlow[currentStep + 1]?.ai || '' }
    ]

    setMessages(newMessages)
    setUserInput('')
    setCurrentStep(currentStep + 1)

    if (currentStep + 1 >= mockInterviewFlow.length - 1) {
      setInterviewComplete(true)
    }
  }

  const mockProfileSummary = {
    role: '시민사회·연구자 출신 위원 (K-택소노미 비판적 입장)',
    coreValues: '제도 무결성, 국제 기준과의 정합성, 예방 원칙',
    mainEmotions: '불안(좌초자산·그린워싱 리스크), 분노(기준의 조급함)',
    summary: '국제적 신뢰와 제도 무결성을 중시하는 신중한 비판자. 특히 논란이 큰 LNG·블루수소를 무리하게 포함시키는 것이 장기적으로 좌초자산·그린워싱·시장 혼선 리스크를 키운다고 우려함.'
  }

  const phaseGuide = {
    purpose: '사전 인터뷰를 통해 감정·가치·프로필을 명료화하고, 이후 단계의 맥락을 보정합니다.',
    inputs: ['참여자 사전 인터뷰 응답', '감정/가치 키워드', '우려·기대의 자유 서술'],
    outputs: ['프로필 요약(역할/가치/감정)', 'AI 메모(질문 톤, 주의점)', '한 줄 요약'],
    demoTips: [
      '참여자 답변 입력 → AI가 즉시 요약/재질문',
      '프로필 요약이 오른쪽 카드에 누적되는 흐름을 보여줌',
      '"자발적 지침일수록 더 엄격" 같은 예민 포인트가 어떻게 보존되는지 강조'
    ]
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
        <h1 className="page-title">Phase 0 – 사전 프로필 입력</h1>
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
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {emotionOptions.map((option) => (
                <button
                  key={option}
                  className="btn"
                  style={{
                    minHeight: '44px',
                    background: selectedEmotions.includes(option) ? '#eef6ff' : '#fff',
                    borderColor: selectedEmotions.includes(option) ? '#c6ddff' : '#ddd'
                  }}
                  onClick={() =>
                    setSelectedEmotions((prev) =>
                      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
                    )
                  }
                >
                  {option}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {valueOptions.map((option) => (
                <button
                  key={option}
                  className="btn"
                  style={{
                    minHeight: '44px',
                    background: selectedValues.includes(option) ? '#eefaf2' : '#fff',
                    borderColor: selectedValues.includes(option) ? '#c8e6c9' : '#ddd'
                  }}
                  onClick={() =>
                    setSelectedValues((prev) =>
                      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
                    )
                  }
                >
                  {option}
                </button>
              ))}
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
                      {msg.speaker === 'ai' ? 'AI Agent' : '참여자'}
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
                  placeholder="답변을 입력하세요..."
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
          <PhaseGuide
            title="Phase 0 시연 가이드"
            purpose={phaseGuide.purpose}
            inputs={phaseGuide.inputs}
            outputs={phaseGuide.outputs}
            demoTips={phaseGuide.demoTips}
          />
          <div className="card">
            <h2 className="card-title">AI 프로필 요약</h2>
            
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

            <div className="divider"></div>

            <div>
              <strong style={{ fontSize: '0.9rem' }}>AI Agent용 메모:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
                <li>이 사람에게 질문할 때: "완전 제외"보다 "조건부 인정" 옵션을 함께 제시</li>
                <li>의견 이끌어낼 때: 리스크 관리 관점에서 접근하면 수용 가능성 높음</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <TabletCTA onPrev={onBack} nextDisabled nextLabel="다음 단계 → (Phase 선택에서 진행)" />
    </div>
  )
}
