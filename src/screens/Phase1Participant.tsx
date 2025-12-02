type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase1ParticipantProps = {
  meeting: Meeting | null
  onBack: () => void
}

const mockMyEmotions = [
  { keyword: '불안', example: '재생에너지 전환 과정에서 기존 산업 종사자들의 일자리 손실이 우려됩니다.' },
  { keyword: '우려', example: '정부의 일방적인 정책 추진으로 지역 경제가 타격을 받을 수 있습니다.' },
  { keyword: '기대', example: '올바른 전환 정책이라면 환경과 경제를 모두 살릴 수 있을 것입니다.' }
]

const mockMyValues = [
  '형평성',
  '안전',
  '환경 보호',
  '사회 정의',
  '지역 경제 보호'
]

const mockMyStatement = `저는 에너지 전환의 필요성을 인정합니다. 하지만 재생에너지 전환 과정에서 
기존 산업 종사자들과 지역 주민들이 소외되지 않아야 합니다. 
정부는 전환 속도와 규모를 신중하게 결정하고, 영향을 받는 사람들을 위한 
재교육 프로그램과 일자리 창출 계획을 먼저 마련해야 합니다. 
형평성과 사회적 안전망이 보장되지 않으면, 전환 정책 자체에 대한 
사회적 합의를 얻기 어려울 것입니다.`

export default function Phase1Participant({ meeting, onBack }: Phase1ParticipantProps) {
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
        <h1 className="page-title">Phase 1 – 내 발언의 감정·가치 분석</h1>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      <div className="grid grid-2">
        {/* 좌측: 내 발언 */}
        <div>
          <div className="card">
            <h2 className="card-title">내 발언 내용</h2>
            <div style={{ 
              padding: '1rem', 
              background: '#f9f9f9', 
              borderRadius: '6px',
              border: '1px solid #eee',
              whiteSpace: 'pre-line',
              lineHeight: '1.8',
              color: '#555'
            }}>
              {mockMyStatement}
            </div>
          </div>
        </div>

        {/* 우측: 분석 결과 */}
        <div>
          {/* 감정 분석 카드 */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">내 발언의 감정 분석</h2>
            <div>
              {mockMyEmotions.map((emotion, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <span className="tag" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    {emotion.keyword}
                  </span>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                    {emotion.example}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 가치 분석 카드 */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">내 발언의 가치 분석</h2>
            <div>
              {mockMyValues.map((value, idx) => (
                <span key={idx} className="tag">
                  {value}
                </span>
              ))}
            </div>
          </div>

          {/* 요약 카드 */}
          <div className="card">
            <h2 className="card-title">내 관점 요약</h2>
            <p style={{ color: '#555', lineHeight: '1.6' }}>
              당신의 발언은 <strong>형평성과 사회적 안전망</strong>을 중시하는 관점을 보여줍니다. 
              에너지 전환의 필요성은 인정하지만, 전환 과정에서 발생할 수 있는 
              <strong> 사회적 비용</strong>에 대한 우려가 주요 감정입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

