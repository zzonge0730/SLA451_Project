type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase2ParticipantProps = {
  meeting: Meeting | null
  onBack: () => void
}

const mockMyArgument = {
  premise: '에너지 전환 과정의 사회적 형평성 보장 필요',
  reason: '기존 산업 종사자와 지역 경제 보호 필요',
  hiddenPremise: '정책 추진 시 소외 계층 보호가 우선되어야 함',
  conclusion: '점진적 전환과 사회적 안전망 구축 필요'
}

const mockOtherArgument = {
  name: '정부',
  premise: '재생에너지 전환은 국가 경쟁력 강화에 필수적',
  reason: '글로벌 시장에서 탄소중립 기술 선도 필요',
  conclusion: '재생에너지 비중을 빠르게 확대해야 함'
}

const mockTranslationForMe = {
  title: '정부의 논리를 내 관점으로 번역',
  text: '정부는 "국가 경쟁력 강화"를 말하지만, 이는 곧 "경제적 기회 창출"을 의미합니다. 재생에너지 확대는 새로운 일자리와 산업 생태계를 만들 수 있으며, 이를 통해 기존 산업 종사자들도 새로운 기회를 얻을 수 있습니다. 다만, 전환 과정에서 발생하는 일시적 어려움을 완화하기 위한 사회적 안전망이 함께 마련되어야 합니다.'
}

const mockBridgeForMe = [
  '재생에너지 전환은 경제적 기회와 사회적 보호를 동시에 고려한 통합적 접근이 필요합니다.',
  '단계적 전환을 통해 기술 혁신의 이점을 활용하면서도 전환 과정의 사회적 비용을 관리할 수 있습니다.'
]

export default function Phase2Participant({ meeting, onBack }: Phase2ParticipantProps) {
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
        <h1 className="page-title">Phase 2 – 논증 구조화 & 가치 번역</h1>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      <div className="grid grid-2">
        {/* 좌측: 내 논증 구조 */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">내 논증 구조</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>전제:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                {mockMyArgument.premise}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>이유:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                {mockMyArgument.reason}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>숨은 전제:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                {mockMyArgument.hiddenPremise}
              </p>
            </div>

            <div>
              <strong>결론:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                {mockMyArgument.conclusion}
              </p>
            </div>
          </div>

          {/* 상대방 논증 구조 */}
          <div className="card">
            <h2 className="card-title">{mockOtherArgument.name}의 논증 구조</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>전제:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                {mockOtherArgument.premise}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>이유:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                {mockOtherArgument.reason}
              </p>
            </div>

            <div>
              <strong>결론:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                {mockOtherArgument.conclusion}
              </p>
            </div>
          </div>
        </div>

        {/* 우측: 가치 번역 & 브릿지 문장 */}
        <div>
          <div className="card">
            <h2 className="card-title">가치 번역 & 브릿지 문장</h2>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0f7ff', borderRadius: '6px', border: '1px solid #b8dce8' }}>
              <strong style={{ fontSize: '0.95rem', color: '#2c5f7c' }}>
                {mockTranslationForMe.title}
              </strong>
              <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {mockTranslationForMe.text}
              </p>
            </div>

            <div className="divider"></div>

            <div>
              <strong style={{ fontSize: '0.95rem' }}>브릿지 문장:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {mockBridgeForMe.map((sentence, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {sentence}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

