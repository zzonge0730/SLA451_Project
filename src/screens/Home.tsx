import { IS_DEMO_MODE } from '../config'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type HomeProps = {
  onMeetingSelect: (meeting: Meeting, role: 'moderator' | 'participant') => void
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    name: '과학기술정책위원회 R&D 예산 배분 회의',
    agenda: '국가 R&D 예산 분배 원칙 수립'
  }
]

export default function Home({ onMeetingSelect }: HomeProps) {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">8조 가치번역 AI Agent</h1>
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
