import PhaseGuide from '../components/PhaseGuide'
import TabletCTA from '../components/TabletCTA'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase1Props = {
  meeting: Meeting | null
  onBack: () => void
}

const mockStatements = [
  {
    speaker: 'Expert',
    text: '지금 안을 보면, LNG 기준을 340gCO₂/kWh으로 제안하셨는데, EU에서도 아직 기준이 확정되지 않았고 340, 270 얘기가 오락가락하는 걸로 알고 있습니다. 그런데 이렇게 불확실한 상태에서 우리가 먼저 기준을 박는 게 맞나요?',
    emotions: [
      { keyword: '불안', example: '불확실한 기준을 먼저 정하는 것에 대한 우려' },
      { keyword: '의심', example: '국제 기준과의 정합성에 대한 의문' }
    ],
    values: ['제도 무결성', '국제 기준과의 정합성', '예방 원칙']
  },
  {
    speaker: 'Official',
    text: 'EU 기준이 완전히 확정된 건 아니지만, 우리는 현 시점에서 국내 최고기술 수준을 고려해 340을 출발점으로 삼고, 미래 목표는 250까지 낮추겠다는 신호를 주려는 겁니다.',
    emotions: [
      { keyword: '압박감', example: '기한 내 기준 마련의 부담' },
      { keyword: '책임감', example: '제도 도입에 대한 책임' }
    ],
    values: ['실행 가능성', '에너지 전환 속도', '시장 안착']
  },
  {
    speaker: 'Expert',
    text: '문제는 LNG랑 블루수소입니다. LNG는 전과정으로 보면 석탄의 70% 배출이라고 하는데, 이걸 전환이라 하더라도 녹색 활동의 프레임 안에 넣어버리면, 탄소중립과 동일시되는 착시효과를 줄 수 있어요.',
    emotions: [
      { keyword: '분노', example: '녹색 기준이 너무 느슨하게 정해지는 것에 대한 분노' },
      { keyword: '불안', example: '그린워싱 리스크에 대한 우려' }
    ],
    values: ['제도 무결성', '그린워싱 방지', '장기적 신뢰']
  },
  {
    speaker: 'Official',
    text: '그 지적이 타당한 부분이 있는 건 저희도 인정합니다. 다만, 탄소중립 시나리오와 NDC에서 LNG와 청정수소는 과도기적으로 이미 반영되어 있고, 지금 석탄을 줄이고 전원믹스를 바꾸려면 현실적으로 LNG가 필요한 부분이 있습니다.',
    emotions: [
      { keyword: '압박감', example: '현실적 제약과 목표 사이의 긴장' },
      { keyword: '책임감', example: '실행 가능한 정책 설계에 대한 책임' }
    ],
    values: ['실행 가능성', '현실적 제약 고려', '단계적 전환']
  }
]

const mockGroupSummary = {
  expert: {
    emotions: '불안(좌초자산·그린워싱), 분노(기준의 조급함), 의심',
    values: '무결성, 예방 원칙, 국제적 신뢰'
  },
  official: {
    emotions: '압박감(기한·현실), 책임감(제도 도입)',
    values: '실행 가능성, 에너지 전환 속도, 시장 안착'
  }
}

const quickCards = [
  { label: '불안 😟', detail: '좌초자산·그린워싱 리스크', tone: '#eef6ff', border: '#c6ddff' },
  { label: '분노 😠', detail: '기준 조급/느슨', tone: '#fff5f5', border: '#ffcdd2' },
  { label: '압박감 😣', detail: '기한 내 정책 완성', tone: '#fff7ed', border: '#ffe0b2' },
  { label: '책임감 🧭', detail: '실행 가능한 설계', tone: '#eefaf2', border: '#c8e6c9' },
  { label: '무결성 🧭', detail: '국제 정합성·예방 원칙', tone: '#eef6ff', border: '#c6ddff' },
  { label: '실행 가능성 ⚙️', detail: '전환 속도·시장 안착', tone: '#eefaf2', border: '#c8e6c9' }
]

export default function Phase1({ meeting, onBack }: Phase1Props) {
  const phaseGuide = {
    purpose: '1라운드 발언을 감정·가치 지도와 집단 요약으로 바꿔 초기 마찰 지점을 드러냅니다.',
    inputs: ['회의 1라운드 발언 스크립트', '화자 정보(Expert/Official 등)'],
    outputs: ['발언별 감정·가치 태깅', '집단별 감정/가치 요약', '마찰 축 한 줄 분석'],
    demoTips: [
      '같은 목표를 공유하지만 우선순위가 다른 지점을 강조',
      '"무결성이 먼저" vs "실행 가능성이 먼저"라는 축을 카드/태그로 보여줌',
      '스크립트 영역과 분석 영역이 나란히 있다는 점을 강조'
    ]
  }

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
        <h1 className="page-title">Phase 1 – 감정·가치 매핑</h1>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      <div className="grid grid-2">
        {/* 좌측: 발언 스크립트 및 발언별 분석 */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">회의 발언 스크립트</h2>
            <div style={{ 
              padding: '1rem', 
              background: '#f9f9f9', 
              borderRadius: '6px',
              border: '1px solid #eee',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {mockStatements.map((stmt, idx) => (
                <div key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: idx < mockStatements.length - 1 ? '1px solid #eee' : 'none' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                    {stmt.speaker}:
                  </div>
                  <div style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {stmt.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 발언별 분석 */}
          <div className="card">
            <h2 className="card-title">발언별 감정·가치 분석</h2>
            {mockStatements.map((stmt, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: idx < mockStatements.length - 1 ? '1px solid #eee' : 'none' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ color: '#333' }}>{stmt.speaker}의 발언:</strong>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>감정:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    {stmt.emotions.map((emotion, eIdx) => (
                      <div key={eIdx} style={{ marginBottom: '0.5rem' }}>
                        <span className="tag" style={{ fontSize: '0.85rem' }}>
                          {emotion.keyword}
                        </span>
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                          {emotion.example}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>가치:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    {stmt.values.map((value, vIdx) => (
                      <span key={vIdx} className="tag" style={{ fontSize: '0.85rem' }}>
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 집단별 요약 */}
        <div>
          <PhaseGuide
            title="Phase 1 시연 가이드"
            purpose={phaseGuide.purpose}
            inputs={phaseGuide.inputs}
            outputs={phaseGuide.outputs}
            demoTips={phaseGuide.demoTips}
          />
          {/* Expert 집단 요약 */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">Expert 집단 요약</h2>
            <div style={{ marginBottom: '1rem' }}>
              <strong>주요 감정:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555' }}>
                {mockGroupSummary.expert.emotions}
              </p>
            </div>
            <div>
              <strong>주요 가치:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555' }}>
                {mockGroupSummary.expert.values}
              </p>
            </div>
            <div className="divider" style={{ margin: '1rem 0' }}></div>
            <div>
              <strong>핵심 질문:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem', fontStyle: 'italic' }}>
                "이 체계가 정말로 그린워싱을 막고, 장기적으로 기후목표에 도움이 되는가?"
              </p>
            </div>
          </div>

          {/* Official 집단 요약 */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">Official 집단 요약</h2>
            <div style={{ marginBottom: '1rem' }}>
              <strong>주요 감정:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555' }}>
                {mockGroupSummary.official.emotions}
              </p>
            </div>
            <div>
              <strong>주요 가치:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555' }}>
                {mockGroupSummary.official.values}
              </p>
            </div>
            <div className="divider" style={{ margin: '1rem 0' }}></div>
            <div>
              <strong>핵심 질문:</strong>
              <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem', fontStyle: 'italic' }}>
                "완벽하진 않더라도, 지금 당장 석탄 감축을 촉진하기 위한 현실적 도구가 필요한 것 아닌가?"
              </p>
            </div>
          </div>

          {/* 한 줄 분석 */}
          <div className="card">
            <h2 className="card-title">마찰 축 분석</h2>
            <p style={{ color: '#555', lineHeight: '1.6' }}>
              두 집단 모두 <strong>"그린워싱 방지 + 녹색투자 활성화"</strong>라는 같은 정책 목표를 공유하고 있지만,
            </p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.8' }}>
              <li>Expert 집단은 <strong>"무결성이 먼저"</strong></li>
              <li>Official 집단은 <strong>"실행 가능성이 먼저"</strong></li>
            </ul>
            <p style={{ marginTop: '0.75rem', color: '#555', lineHeight: '1.6' }}>
              로 우선순위가 다른 상태입니다.
            </p>
          </div>

          {/* 감정/가치 카드 요약 (바둑판형) */}
          <div className="card">
            <h2 className="card-title">감정·가치 한눈에 보기 (카드)</h2>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              태블릿용 요약: 이모지 + 키워드 + 한 줄 설명으로 빠르게 훑을 수 있도록 구성했습니다.
            </p>
            <div className="grid grid-2">
              {quickCards.map((card, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    border: `1px solid ${card.border}`,
                    background: card.tone,
                    marginBottom: '0.5rem'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: '#333' }}>{card.label}</div>
                  <div style={{ color: '#555', fontSize: '0.95rem' }}>{card.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TabletCTA onPrev={onBack} nextDisabled nextLabel="다음 단계 → (Phase 선택에서 이동)" />
    </div>
  )
}
