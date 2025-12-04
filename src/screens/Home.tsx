type Meeting = {
  id: string
  name: string
  agenda: string
}

type HomeProps = {
  onMeetingSelect: (meeting: Meeting, role: 'moderator' | 'participant') => void
  scenarioMode: 'scripted' | 'llm'
  onScenarioChange: (mode: 'scripted' | 'llm') => void
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    name: '과학기술정책위원회 R&D 예산 배분 회의',
    agenda: '국가 R&D 예산 분배 원칙 수립'
  }
]

export default function Home({ onMeetingSelect, scenarioMode, onScenarioChange }: HomeProps) {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">8조 가치번역 AI Agent</h1>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ marginBottom: '0.35rem' }}>시나리오 소스 선택</h3>
        <p className="text-muted" style={{ marginBottom: '0.75rem' }}>Home 단계에서 선택한 모드가 전체 Phase에 적용됩니다.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${scenarioMode === 'scripted' ? 'btn-primary' : ''}`}
            style={{ padding: '0.6rem 1rem' }}
            onClick={() => onScenarioChange('scripted')}
          >
            하드코딩 데모
          </button>
          <button
            className={`btn ${scenarioMode === 'llm' ? 'btn-primary' : ''}`}
            style={{ padding: '0.6rem 1rem' }}
            onClick={() => onScenarioChange('llm')}
          >
            LLM 모드
          </button>
          <span className="tag" style={{ background: '#f7f7f7', borderColor: '#e0e0e0', color: '#424242', margin: 0 }}>
            현재: {scenarioMode === 'llm' ? 'LLM 연결' : '스크립트'}
          </span>
        </div>
      </div>

      <div>
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>회의 목록</h2>
        {mockMeetings.map((meeting) => (
          <div key={meeting.id} className="card">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
              {meeting.name}
            </h3>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>
              {meeting.agenda}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {IS_DEMO_MODE && (
                <button
                  className="btn btn-primary"
                  onClick={() => onMeetingSelect(meeting, 'moderator')}
                >
                  주관자 모드
                </button>
              )}
              <button
                className="btn"
                onClick={() => onMeetingSelect(meeting, 'participant')}
              >
                참가자 모드
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
import { IS_DEMO_MODE } from '../config'
