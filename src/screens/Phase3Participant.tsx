import { useState, useEffect, useRef } from 'react'
import { FaCheckCircle, FaQuestionCircle, FaLightbulb } from 'react-icons/fa'
import StepIndicator from '../components/StepIndicator'

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

// 객관식 질문 (슬라이더)
const mockVerifyQuestions = [
  {
    question: '이 번역이 내 의도를 정확하게 반영하나요?',
    type: 'slider' as const,
    min: 1,
    max: 5,
    labels: ['전혀 아님', '약간 아님', '보통', '대체로 맞음', '완전히 맞음']
  },
  {
    question: '내 논증의 핵심이 잘 전달되었나요?',
    type: 'slider' as const,
    min: 1,
    max: 5,
    labels: ['전혀 아님', '약간 아님', '보통', '대체로 맞음', '완전히 맞음']
  },
  {
    question: '이 번역에서 빠진 중요한 부분이 있나요?',
    type: 'slider' as const,
    min: 1,
    max: 5,
    labels: ['많이 빠짐', '약간 빠짐', '보통', '거의 다 있음', '완벽함']
  }
]

const mockCritiqueQuestions = [
  {
    question: '내 논증에서 놓치고 있는 부분이 있나요?',
    type: 'ox' as const,
    options: ['있음', '없음']
  },
  {
    question: '정부의 "경쟁력 강화" 논리와 내 "형평성" 논리를 절충할 수 있나요?',
    type: 'ox' as const,
    options: ['가능함', '불가능함']
  },
  {
    question: '내가 제시한 해결책이 실현 가능한가요?',
    type: 'ox' as const,
    options: ['가능함', '불가능함']
  },
  {
    question: '전략기술 투자와 생활·안전 R&D의 균형을 보장할 수 있나요?',
    type: 'ox' as const,
    options: ['가능함', '불가능함']
  }
]

// 키워드 선택 질문
const mockKeywordQuestions = [
  {
    question: '남아있는 가장 큰 우려는 무엇인가요? (복수 선택 가능)',
    type: 'keywords' as const,
    keywords: ['지역소멸', '예산부족', '실행미흡', '평가체계', '인력유출', '기타']
  }
]

// 주관식 질문 (하나만)
const mockReflectionQuestion = '오늘 논의를 통해 내 입장이 어디까지 이동했는지 한 줄로 적어주세요.'

export default function Phase3Participant({ meeting, onBack, onNext }: Phase3ParticipantProps) {
  const [responses, setResponses] = useState<Record<string, string | number | string[]>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)
  
  // 슬라이더 기본값은 3 (중립)
  useEffect(() => {
    mockVerifyQuestions.forEach((_, idx) => {
      if (!responses[`verify-${idx}`]) {
        setResponses(prev => ({ ...prev, [`verify-${idx}`]: 3 }))
      }
    })
  }, [])
  
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
  
  const handleResponseChange = (key: string, value: string | number | string[]) => {
    setResponses({ ...responses, [key]: value })
  }
  
  const handleKeywordToggle = (key: string, keyword: string) => {
    const current = (responses[key] as string[]) || []
    const updated = current.includes(keyword)
      ? current.filter(k => k !== keyword)
      : [...current, keyword]
    handleResponseChange(key, updated)
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
  
  const allVerifyAnswered = mockVerifyQuestions.every((_, idx) => responses[`verify-${idx}`] !== undefined)
  const allCritiqueAnswered = mockCritiqueQuestions.every((_, idx) => responses[`critique-${idx}`] !== undefined)
  const keywordsAnswered = mockKeywordQuestions.every((_, idx) => {
    const keywords = responses[`keywords-${idx}`] as string[]
    return keywords && keywords.length > 0
  })
  const reflectionAnswered = responses['reflection'] && (responses['reflection'] as string).trim()
  const canSubmit = allVerifyAnswered && allCritiqueAnswered && keywordsAnswered && reflectionAnswered
  
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
        <StepIndicator
          steps={['발언 입력', '재구성 확인', '번역 비교', '합의 확인']}
          current={3}
        />
        <div className="card" style={{ background: '#ECEFF1', borderColor: '#CFD8DC', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#263238' }}>지금 하실 일</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#546E7A', lineHeight: '1.7' }}>
            <li>슬라이더와 O/X로 번역 정확도와 균형감을 빠르게 평가하세요.</li>
            <li>남은 우려 키워드를 선택하고, 마지막으로 한 줄 성찰을 남깁니다.</li>
            <li>제출하면 주관자 화면 응답 현황에 바로 반영됩니다.</li>
          </ul>
        </div>
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
        {/* 좌측: Verify 질문 (슬라이더) */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaQuestionCircle style={{ color: '#4a90e2', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>검증 질문</h2>
            </div>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              슬라이더로 답변해주세요 (기본값: 중립)
            </p>
            {mockVerifyQuestions.map((q, idx) => {
              const value = (responses[`verify-${idx}`] as number) || 3
              return (
                <div key={idx} style={{ marginBottom: '2rem' }}>
                  <p style={{ 
                    color: '#555', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.6', 
                    marginBottom: '1rem',
                    fontWeight: '500'
                  }}>
                    {idx + 1}. {q.question}
                  </p>
                  <input
                    type="range"
                    min={q.min}
                    max={q.max}
                    value={value}
                    onChange={(e) => handleResponseChange(`verify-${idx}`, parseInt(e.target.value))}
                    disabled={isComplete}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      background: `linear-gradient(to right, #e0e0e0 0%, #e0e0e0 ${(value - 1) * 25}%, #455A64 ${(value - 1) * 25}%, #455A64 100%)`,
                      outline: 'none',
                      cursor: isComplete ? 'not-allowed' : 'pointer'
                    }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>
                    {q.labels.map((label, labelIdx) => (
                      <span 
                        key={labelIdx}
                        style={{
                          fontWeight: labelIdx + 1 === value ? '600' : '400',
                          color: labelIdx + 1 === value ? '#1565c0' : '#666'
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '0.5rem',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#1565c0'
                  }}>
                    {value}점
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 우측: Critique (O/X) & Keywords & Reflection (주관식 하나) */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaLightbulb style={{ color: '#ff9800', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>비평 질문</h2>
            </div>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              O/X로 답변해주세요
            </p>
            {mockCritiqueQuestions.map((q, idx) => {
              const selected = responses[`critique-${idx}`] as string
              return (
                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                  <p style={{ 
                    color: '#555', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.6', 
                    marginBottom: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {idx + 1}. {q.question}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {q.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => !isComplete && handleResponseChange(`critique-${idx}`, option)}
                        disabled={isComplete}
                        style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          borderRadius: '6px',
                          border: `2px solid ${selected === option ? '#ff9800' : '#ddd'}`,
                          background: selected === option ? '#fff3e0' : '#fff',
                          color: selected === option ? '#e65100' : '#666',
                          cursor: isComplete ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 키워드 선택 */}
          {mockKeywordQuestions.map((q, idx) => {
            const selectedKeywords = (responses[`keywords-${idx}`] as string[]) || []
            return (
              <div key={idx} className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                  {q.question}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {q.keywords.map((keyword) => {
                    const isSelected = selectedKeywords.includes(keyword)
                    return (
                      <button
                        key={keyword}
                        onClick={() => !isComplete && handleKeywordToggle(`keywords-${idx}`, keyword)}
                        disabled={isComplete}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem',
                          borderRadius: '20px',
                          border: `2px solid ${isSelected ? '#4caf50' : '#ddd'}`,
                          background: isSelected ? '#e8f5e9' : '#fff',
                          color: isSelected ? '#2e7d32' : '#666',
                          cursor: isComplete ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          fontWeight: isSelected ? '600' : '400'
                        }}
                      >
                        {keyword}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* 성찰 질문 (주관식 하나만) */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaCheckCircle style={{ color: '#4caf50', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>성찰 질문</h2>
            </div>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              한 줄로 답변해주세요
            </p>
            <div>
              <p style={{ 
                color: '#555', 
                fontSize: '0.95rem', 
                lineHeight: '1.6', 
                marginBottom: '0.75rem',
                fontWeight: '500'
              }}>
                {mockReflectionQuestion}
              </p>
              <textarea
                className="form-textarea"
                style={{ minHeight: '100px', width: '100%' }}
                placeholder="한 줄로 답변을 입력하세요..."
                value={(responses['reflection'] as string) || ''}
                onChange={(e) => handleResponseChange('reflection', e.target.value)}
                disabled={isComplete}
              />
            </div>
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
