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
    name: '경제산업분과 제11차 회의',
    agenda: '에너지 전환 정책 수립'
  },
  {
    id: '2',
    name: '환경정책위원회 제5차 회의',
    agenda: '탄소중립 로드맵 검토'
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
              <button
                className="btn btn-primary"
                onClick={() => onMeetingSelect(meeting, 'moderator')}
              >
                주관자 모드
              </button>
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

