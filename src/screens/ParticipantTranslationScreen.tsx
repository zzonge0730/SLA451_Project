import { useState, useEffect, useRef } from 'react'
import { FaExchangeAlt, FaArrowRight } from 'react-icons/fa'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type ParticipantTranslationScreenProps = {
  meeting: Meeting | null
  onBack: () => void
  onNext?: () => void
}

// TODO: 나중에 실제 LLM 응답으로 대체될 데이터
const mockMyStatement = '그 말대로라면 지방은 앞으로도 계속 "희생의 대상"이라는 뜻입니까? 응급실도 없는 지역 현실은 외면하고 수조 원을 쏟아붓는다니, 국민 세금으로 누굴 위한 잔치를 하는 겁니까?'

const mockAIRestructuredMy = '전략기술 투자가 필요하다는 점은 이해합니다. 다만 최소한의 연구 인프라와 생활·안전 R&D가 확보되지 않으면, 지방 주민들은 국가 R&D를 "우리 삶과 무관한 투자"로 느끼게 됩니다. 오늘 회의에서 전략기술 비율과 별도로 생활·안전 R&D 최소 비율을 설정하자고 제안하고 싶습니다.'

const mockOpponentStatement = '국가 경쟁력을 위해서는 전략기술에 집중 투자해야 합니다. AI, 양자, 바이오 같은 분야에서 선도국가가 되려면, 제한된 예산을 효율적으로 배분해야 합니다. 생활·안전 R&D는 중요하지만, 전략기술 투자와는 별도로 관리해야 합니다.'

const mockAIRestructuredOpponent = '국가 경쟁력 강화를 위해 전략기술 분야에 집중 투자가 필요하다는 점을 이해합니다. 다만, 생활·안전 R&D와 전략기술 투자는 상호 배타적이지 않으며, 양쪽 모두를 지원하는 3바스켓 구조를 통해 균형을 맞출 수 있습니다. 전략기술 투자와 함께 생활·안전 R&D 최소 비율을 보장하는 방안을 검토하겠습니다.'

const mockTranslationMyToOfficial = {
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

const mockTranslationOpponentToCitizen = {
  title: '상대 발언 → 시민이 이해할 수 있는 언어로',
  translations: [
    {
      type: '전략적 목표',
      content: '전략기술 투자는 최종적으로 국민의 삶의 질 향상과 국가 경쟁력을 동시에 달성하기 위한 수단입니다. 생활·안전 R&D와 전략기술 투자는 상호 보완적 관계로, 양쪽 모두를 지원하는 구조가 필요합니다.'
    },
    {
      type: '단계적 접근',
      content: '전략기술 투자를 통해 얻은 기술과 성과는 향후 생활·안전 분야에도 적용될 수 있으며, 이를 통해 장기적으로 지역 주민의 삶의 질도 개선될 수 있습니다.'
    }
  ]
}

export default function ParticipantTranslationScreen({ meeting, onBack, onNext }: ParticipantTranslationScreenProps) {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    // 데모: 1초 후 준비 완료
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])
  
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
        <h1 className="page-title">발언 번역 확인</h1>
        <p className="phase-desc">내 발언과 상대 발언의 상호 번역</p>
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
        {/* 좌측: 내 발언 번역 */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaExchangeAlt style={{ color: '#4a90e2', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>
                {mockTranslationMyToOfficial.title}
              </h2>
            </div>
            
            <div style={{ 
              padding: '0.75rem', 
              background: '#f9f9f9', 
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid #eee'
            }}>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>원문:</p>
              <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.9rem' }}>
                {mockMyStatement}
              </p>
            </div>
            
            <div style={{ 
              padding: '0.75rem', 
              background: '#f0f7ff', 
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid #b8dce8'
            }}>
              <p style={{ fontSize: '0.85rem', color: '#1565c0', marginBottom: '0.5rem', fontWeight: '500' }}>AI 재구성:</p>
              <p style={{ color: '#2c5f7c', lineHeight: '1.6', fontSize: '0.9rem' }}>
                {mockAIRestructuredMy}
              </p>
            </div>
            
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', color: '#333' }}>
                리스크 관리 언어로 번역:
              </p>
              {mockTranslationMyToOfficial.risks[0] && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#d32f2f' }}>
                    {mockTranslationMyToOfficial.risks[0].type}:
                  </strong>
                  <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {mockTranslationMyToOfficial.risks[0].content}
                  </p>
                </div>
              )}
              {mockTranslationMyToOfficial.risks[1] && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#d32f2f' }}>
                    {mockTranslationMyToOfficial.risks[1].type}:
                  </strong>
                  <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {mockTranslationMyToOfficial.risks[1].content}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 상대 발언 번역 */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaExchangeAlt style={{ color: '#ff9800', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>
                {mockTranslationOpponentToCitizen.title}
              </h2>
            </div>
            
            <div style={{ 
              padding: '0.75rem', 
              background: '#f9f9f9', 
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid #eee'
            }}>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>상대 원문:</p>
              <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.9rem' }}>
                {mockOpponentStatement}
              </p>
            </div>
            
            <div style={{ 
              padding: '0.75rem', 
              background: '#fff3e0', 
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid #ffcc80'
            }}>
              <p style={{ fontSize: '0.85rem', color: '#e65100', marginBottom: '0.5rem', fontWeight: '500' }}>AI 재구성:</p>
              <p style={{ color: '#bf360c', lineHeight: '1.6', fontSize: '0.9rem' }}>
                {mockAIRestructuredOpponent}
              </p>
            </div>
            
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', color: '#333' }}>
                시민 언어로 번역:
              </p>
              {mockTranslationOpponentToCitizen.translations[0] && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#f57c00' }}>
                    {mockTranslationOpponentToCitizen.translations[0].type}:
                  </strong>
                  <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {mockTranslationOpponentToCitizen.translations[0].content}
                  </p>
                </div>
              )}
              {mockTranslationOpponentToCitizen.translations[1] && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#f57c00' }}>
                    {mockTranslationOpponentToCitizen.translations[1].type}:
                  </strong>
                  <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {mockTranslationOpponentToCitizen.translations[1].content}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단: 다음 단계 버튼 */}
      {isReady && onNext && (
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
            발언 번역이 완료되었습니다. 합의문을 확인하세요.
          </p>
          <button
            className="btn btn-primary"
            onClick={onNext}
            style={{ 
              fontSize: '1.2rem', 
              padding: '1rem 2rem',
              minWidth: '250px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            합의문 확인하기
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  )
}

