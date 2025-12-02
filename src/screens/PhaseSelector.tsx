import { FaUser, FaChartLine, FaExchangeAlt, FaCheckCircle, FaFileContract } from 'react-icons/fa'
import TabletCTA from '../components/TabletCTA'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type PhaseSelectorProps = {
  meeting: Meeting
  onPhaseSelect: (phase: number) => void
  onBack: () => void
  userRole: 'moderator' | 'participant'
}

const phases = [
  {
    id: 0,
    title: 'Phase 0',
    subtitle: '사전 프로필 입력',
    description: '참여자 프로필 및 가치 키워드 입력',
    icon: FaUser,
    color: '#4a90e2'
  },
  {
    id: 1,
    title: 'Phase 1',
    subtitle: '감정·가치 매핑',
    description: '발언 내용의 감정과 가치 분석',
    icon: FaChartLine,
    color: '#9c27b0'
  },
  {
    id: 2,
    title: 'Phase 2',
    subtitle: '논증 구조화 & 가치 번역',
    description: '논리 구조 분석 및 가치 번역',
    icon: FaExchangeAlt,
    color: '#ff9800'
  },
  {
    id: 3,
    title: 'Phase 3',
    subtitle: '검증·비평·성찰 질문',
    description: '검증 및 비평 질문 생성',
    icon: FaCheckCircle,
    color: '#4caf50'
  },
  {
    id: 4,
    title: 'Phase 4',
    subtitle: '조건부 합의안 초안',
    description: '합의안 초안 작성',
    icon: FaFileContract,
    color: '#f44336'
  }
]

export default function PhaseSelector({
  meeting,
  onPhaseSelect,
  onBack,
  userRole
}: PhaseSelectorProps) {
  return (
    <div>
      <div className="page-header">
        <button
          className="btn"
          onClick={onBack}
          style={{ marginBottom: '1rem' }}
        >
          ← 홈으로
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>{meeting.name}</h1>
          <span className="tag" style={{ 
            background: userRole === 'moderator' ? '#e8f4f8' : '#fff4e6',
            borderColor: userRole === 'moderator' ? '#b8dce8' : '#ffd4a3',
            color: userRole === 'moderator' ? '#2c5f7c' : '#8b5a00'
          }}>
            {userRole === 'moderator' ? '주관자 모드' : '참가자 모드'}
          </span>
        </div>
        <p className="page-subtitle">{meeting.agenda}</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>데모 시나리오 개요</h3>
        <p className="text-muted" style={{ marginBottom: '0.75rem' }}>
          K-택소노미 안건 2(녹색분류체계) 논쟁을 바탕으로, "무결성 vs 실행 가능성" 갈등을 5단계로 번역·브릿징하는 흐름을 시연합니다.
        </p>
        <ul style={{ paddingLeft: '1.25rem', color: '#555', lineHeight: '1.6' }}>
          <li><strong>Phase 0</strong>: 사전 인터뷰로 감정·가치·프로필을 정리</li>
          <li><strong>Phase 1</strong>: 1라운드 발언을 감정/가치 맵으로 시각화</li>
          <li><strong>Phase 2</strong>: 논증을 구조화하고 상호 번역 + 브릿지 문장 제안</li>
          <li><strong>Phase 3</strong>: Verify/Critique/Reflection 질문을 생성해 편향 검증</li>
          <li><strong>Phase 4</strong>: 조건부 합의안 초안과 남은 쟁점을 명시</li>
        </ul>
      </div>

      <div>
        <h2 className="card-title" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Phase 선택</h2>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {phases.map((phase) => {
            const IconComponent = phase.icon
            return (
              <div
                key={phase.id}
                className="card"
                style={{
                  width: '180px',
                  minHeight: '200px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1.5rem 1rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: `2px solid ${phase.color}20`
                }}
                onClick={() => onPhaseSelect(phase.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%',
                  background: `${phase.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <IconComponent style={{ fontSize: '2rem', color: phase.color }} />
                </div>
                <h3 style={{ 
                  marginBottom: '0.25rem', 
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#222'
                }}>
                  {phase.title}
                </h3>
                <p style={{ 
                  marginBottom: '0.75rem', 
                  fontSize: '0.85rem',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  {phase.subtitle}
                </p>
                <p className="text-muted" style={{ 
                  fontSize: '0.85rem', 
                  lineHeight: '1.4',
                  marginBottom: '1rem',
                  flex: 1
                }}>
                  {phase.description}
                </p>
                <button
                  className="btn btn-primary"
                  style={{ 
                    width: '100%',
                    marginTop: 'auto',
                    background: phase.color,
                    borderColor: phase.color
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onPhaseSelect(phase.id)
                  }}
                >
                  실행
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <TabletCTA
        onPrev={onBack}
        onNext={() => onPhaseSelect(0)}
        prevLabel="← 홈으로"
        nextLabel="Phase 0 시작"
      />
    </div>
  )
}
