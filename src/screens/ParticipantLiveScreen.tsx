import { useState, useEffect, useRef } from 'react'
import { FaMicrophone, FaCheckCircle, FaTimesCircle, FaExchangeAlt } from 'react-icons/fa'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type ParticipantLiveScreenProps = {
  meeting: Meeting | null
  onBack: () => void
  onNext?: () => void
}

// TODO: 나중에 실제 STT/LLM 응답으로 대체될 데이터
const mockMyStatement = '그 말대로라면 지방은 앞으로도 계속 "희생의 대상"이라는 뜻입니까? 응급실도 없는 지역 현실은 외면하고 수조 원을 쏟아붓는다니, 국민 세금으로 누굴 위한 잔치를 하는 겁니까?'

const mockAIRestructured = '전략기술 투자가 필요하다는 점은 이해합니다. 다만 최소한의 연구 인프라와 생활·안전 R&D가 확보되지 않으면, 지방 주민들은 국가 R&D를 "우리 삶과 무관한 투자"로 느끼게 됩니다. 오늘 회의에서 전략기술 비율과 별도로 생활·안전 R&D 최소 비율을 설정하자고 제안하고 싶습니다.'

const mockTranslationToOfficial = {
  title: '내 발언 → 정부가 이해할 수 있는 언어로',
  risks: [
    {
      type: '정책 정당성 리스크',
      content: '지역 주민과 청년 연구자가 배제된 R&D는 "그들만의 리그"로 인식되어, 장기적인 정책 지지를 잃을 수 있습니다.'
    },
    {
      type: '사회 통합 리스크',
      content: '지역 간 격차가 심화되면 "국가 R&D 무용론"이나 조세 저항 같은 사회적 갈등 비용이 발생합니다.'
    }
  ]
}

export default function ParticipantLiveScreen({ meeting, onBack, onNext }: ParticipantLiveScreenProps) {
  const [userStatement, setUserStatement] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showRestructured, setShowRestructured] = useState(false)
  const [intentConfirmed, setIntentConfirmed] = useState<boolean | null>(null)
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
  
  const handleRecord = () => {
    setIsRecording(true)
    // 데모: 2초 후 자동으로 텍스트 입력
    setTimeout(() => {
      setIsRecording(false)
      setUserStatement(mockMyStatement)
    }, 2000)
  }
  
  const handleRestructure = () => {
    setShowRestructured(true)
    // 주관자에게 발언 알림
    if (channelRef.current) {
      channelRef.current.postMessage({ 
        type: 'PARTICIPANT_STATEMENT', 
        participant: '지역 시민단체 활동가',
        statement: userStatement
      })
    }
  }
  
  const handleIntentConfirm = (confirmed: boolean) => {
    setIntentConfirmed(confirmed)
    if (channelRef.current) {
      channelRef.current.postMessage({ 
        type: 'PARTICIPANT_INTENT_CONFIRM', 
        participant: '지역 시민단체 활동가',
        confirmed
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
          ← 돌아가기
        </button>
        <h1 className="page-title">회의 참여</h1>
        <p className="phase-desc">발언하기 & AI 재구성 확인</p>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
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
        {/* 좌측: 발언 입력 */}
        <div>
          <div className="card">
            <h2 className="card-title">내 발언 입력</h2>
            
            {!userStatement ? (
              <div>
                <button
                  className="btn btn-primary"
                  onClick={handleRecord}
                  disabled={isRecording}
                  style={{ 
                    width: '100%',
                    minHeight: '80px',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaMicrophone style={{ fontSize: '1.5rem' }} />
                  {isRecording ? '녹음 중...' : '발언하기'}
                </button>
                <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                  (데모에서는 예시 발언이 자동 입력됩니다)
                </p>
              </div>
            ) : (
              <div>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f9f9f9', 
                  borderRadius: '6px',
                  border: '1px solid #eee',
                  marginBottom: '1rem',
                  minHeight: '120px'
                }}>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {userStatement}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleRestructure}
                  style={{ width: '100%' }}
                >
                  AI 재구성 요청
                </button>
              </div>
            )}
          </div>

          {/* AI 재구성 결과 */}
          {showRestructured && (
            <div className="card" style={{ marginTop: '1.5rem', background: '#f0f7ff', border: '2px solid #4a90e2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaExchangeAlt style={{ color: '#4a90e2', fontSize: '1.2rem' }} />
                <h2 className="card-title" style={{ marginBottom: 0, color: '#1565c0' }}>
                  AI가 재구성한 발언
                </h2>
              </div>
              <div style={{ 
                padding: '1rem', 
                background: 'white', 
                borderRadius: '6px',
                marginBottom: '1rem',
                border: '1px solid #b8dce8'
              }}>
                <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {mockAIRestructured}
                </p>
              </div>
              
              {intentConfirmed === null ? (
                <div>
                  <p style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.9rem' }}>
                    이 재구성이 내 의도와 일치하나요?
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleIntentConfirm(true)}
                      style={{ flex: 1, background: '#4caf50', borderColor: '#4caf50' }}
                    >
                      <FaCheckCircle style={{ marginRight: '0.5rem' }} />
                      일치함
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleIntentConfirm(false)}
                      style={{ flex: 1, background: '#fff', borderColor: '#f44336', color: '#f44336' }}
                    >
                      <FaTimesCircle style={{ marginRight: '0.5rem' }} />
                      다름
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ 
                    padding: '0.75rem', 
                    background: intentConfirmed ? '#e8f5e9' : '#fff3e0',
                    borderRadius: '6px',
                    border: `1px solid ${intentConfirmed ? '#4caf50' : '#ff9800'}`,
                    marginBottom: '1rem'
                  }}>
                    <p style={{ 
                      color: intentConfirmed ? '#2e7d32' : '#e65100',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      margin: 0
                    }}>
                      {intentConfirmed ? '✓ 의도 확인 완료' : '⚠ 수정 요청 전송됨'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 우측: 번역 결과 */}
        <div>
          {showRestructured && (
            <div className="card">
              <h2 className="card-title">{mockTranslationToOfficial.title}</h2>
              <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                내 발언이 정부·전문가가 이해하기 쉬운 언어로 번역되었습니다.
              </p>
              <div>
                {mockTranslationToOfficial.risks[0] && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#d32f2f' }}>
                      {mockTranslationToOfficial.risks[0].type}:
                    </strong>
                    <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {mockTranslationToOfficial.risks[0].content}
                    </p>
                  </div>
                )}
                {mockTranslationToOfficial.risks[1] && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#d32f2f' }}>
                      {mockTranslationToOfficial.risks[1].type}:
                    </strong>
                    <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {mockTranslationToOfficial.risks[1].content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {!showRestructured && (
            <div className="card" style={{ background: '#f9f9f9', border: '1px dashed #ddd' }}>
              <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                발언을 입력하고 AI 재구성을 요청하면<br />
                번역 결과가 여기에 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* 하단: 다음 단계 버튼 (의도 확인 완료 후 표시) */}
      {showRestructured && intentConfirmed && onNext && (
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          padding: '1.5rem',
          background: '#f0f7ff',
          borderRadius: '8px',
          border: '2px solid #4a90e2'
        }}>
          <p style={{ 
            marginBottom: '1rem', 
            color: '#1565c0', 
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            발언이 정리되었습니다. 발언 번역을 확인하세요.
          </p>
          <button
            className="btn btn-primary"
            onClick={onNext}
            style={{ 
              fontSize: '1.2rem', 
              padding: '1rem 2rem',
              minWidth: '250px',
              fontWeight: '600'
            }}
          >
            발언 번역 확인하기 →
          </button>
        </div>
      )}
    </div>
  )
}
