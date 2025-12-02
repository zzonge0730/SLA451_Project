type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase4ParticipantProps = {
  meeting: Meeting | null
  onBack: () => void
}

const mockAgreementItems = [
  {
    number: 1,
    title: '기본 원칙',
    content: '재생에너지 전환은 경제적 기회와 사회적 보호를 동시에 고려한 통합적 접근으로 추진한다.',
    myPerspective: true,
    highlight: '사회적 보호 - 내 관점이 반영됨'
  },
  {
    number: 2,
    title: '조건 1',
    content: '재생에너지 비중 확대는 단계적으로 진행하며, 각 단계마다 경제·사회적 영향 평가를 실시한다.',
    myPerspective: true,
    highlight: '단계적 진행 - 내 요구사항 반영'
  },
  {
    number: 3,
    title: '조건 2',
    content: '전환 과정에서 영향을 받는 산업 종사자와 지역에 대한 재교육·재취업 지원 프로그램을 운영한다.',
    myPerspective: true,
    highlight: '재교육·재취업 지원 - 내 핵심 요구사항'
  },
  {
    number: 4,
    title: '재검토',
    content: '연 1회 전환 정책의 효과를 평가하고, 필요시 속도와 방향을 조정한다.',
    myPerspective: false,
    highlight: null
  },
  {
    number: 5,
    title: '정보 공개',
    content: '정책 추진 과정의 주요 결정사항과 평가 결과를 투명하게 공개한다.',
    myPerspective: false,
    highlight: null
  },
  {
    number: 6,
    title: '소수 의견 명시',
    content: '합의안에 동의하지 않는 의견도 문서에 명시하고, 지속적인 대화의 기회를 보장한다.',
    myPerspective: false,
    highlight: null
  }
]

const mockRemainingIssues = [
  '재생에너지 비중의 구체적 수치와 시기 (내 요구: 더 보수적 접근)',
  '사회적 안전망 예산 규모와 배분 방식 (내 관심사)',
  '전환 과정 모니터링 주체와 권한 (시민 참여 필요)'
]

const mockMyNextSteps = [
  '합의안의 구체적 수치와 일정에 대한 추가 협의 참여',
  '재교육·재취업 프로그램의 세부 계획 수립에 참여',
  '모니터링 체계에 시민 대표 포함 요구',
  '지역별 영향 평가 결과 검토 및 피드백'
]

export default function Phase4Participant({ meeting, onBack }: Phase4ParticipantProps) {
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
        <h1 className="page-title">Phase 4 – 조건부 합의안 초안</h1>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      <div className="grid grid-2">
        {/* 좌측: 합의안 조항 */}
        <div>
          <div className="card">
            <h2 className="card-title">합의안 조항</h2>
            {mockAgreementItems.map((item) => (
              <div 
                key={item.number} 
                style={{ 
                  marginBottom: '1.5rem',
                  padding: item.myPerspective ? '1rem' : '0',
                  background: item.myPerspective ? '#f0f7ff' : 'transparent',
                  borderRadius: item.myPerspective ? '6px' : '0',
                  border: item.myPerspective ? '1px solid #b8dce8' : 'none'
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {item.number}. {item.title}
                  </strong>
                  {item.highlight && (
                    <span className="tag" style={{ 
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      background: '#fff4e6',
                      borderColor: '#ffd4a3',
                      color: '#8b5a00'
                    }}>
                      내 관점 반영
                    </span>
                  )}
                </div>
                <p style={{ color: '#555', lineHeight: '1.6', paddingLeft: item.myPerspective ? '0' : '1rem' }}>
                  {item.content}
                </p>
                {item.highlight && (
                  <p style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.85rem', 
                    color: '#2c5f7c',
                    fontStyle: 'italic'
                  }}>
                    💡 {item.highlight}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 이견 및 다음 단계 */}
        <div>
          {/* 여전히 이견이 남은 쟁점 */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">여전히 이견이 남은 쟁점</h2>
            <ul className="list">
              {mockRemainingIssues.map((issue, idx) => (
                <li key={idx} className="list-item">
                  <p style={{ color: '#555', fontSize: '0.95rem' }}>
                    {issue}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* 내 다음 단계 */}
          <div className="card">
            <h2 className="card-title">내 다음 단계</h2>
            <ul className="list">
              {mockMyNextSteps.map((step, idx) => (
                <li key={idx} className="list-item">
                  <p style={{ color: '#555', fontSize: '0.95rem' }}>
                    {step}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 하단: 홈으로 돌아가기 버튼 */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={onBack}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  )
}

