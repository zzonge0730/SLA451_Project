import { useState } from 'react'
import PhaseGuide from '../components/PhaseGuide'
import TabletCTA from '../components/TabletCTA'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase4Props = {
  meeting: Meeting | null
  onBack: () => void
}

const mockAgreementItems = [
  {
    number: 1,
    title: '분류 원칙',
    items: [
      'LNG·청정수소·블루수소는 녹색활동이 아니라 전환활동으로만 한시 인정한다.',
      '전환활동은 NDC·탄소중립 시나리오보다 느슨해질 수 없으며, 시나리오와의 정합성을 매년 점검한다.'
    ]
  },
  {
    number: 2,
    title: '조건 1 – LCA 도입 및 유예 한계',
    items: [
      'LCA는 3년 유예 후 2025년부터 적용한다.',
      '유예 기간 내 LCA 데이터가 확보되지 않는 활동은 전환활동 인정 대상에서 제외할 수 있다.'
    ]
  },
  {
    number: 3,
    title: '조건 2 – 녹색·전환 금융상품의 명확한 구분',
    items: [
      '녹색채권과 전환채권을 상품명, 공시, 금리, 만기 구조에서 명확히 구분한다.',
      '전환채권에는 녹색채권보다 높은 리스크 프리미엄을 반영한다.'
    ]
  },
  {
    number: 4,
    title: '조건 3 – 시범운영 및 기준 상향',
    items: [
      '1년간 시범운영 후 그린워싱 방지 효과, 녹색·전환 투자 비율, 좌초자산 리스크 지표를 평가한다.',
      '평가 결과를 반영해 기준을 상향하거나, 특정 전환활동(LNG·블루수소 등)의 범위를 축소·조정한다.'
    ]
  },
  {
    number: 5,
    title: '조건 4 – 논란 큰 에너지원에 대한 정보 제공',
    items: [
      'LNG·블루수소 등 논란이 큰 에너지원은 "녹색, 황색, 적색" 등 레이블 구분을 도입해 투자자에게 명확한 정보를 제공하는 방안을 추가 검토한다.'
    ]
  },
  {
    number: 6,
    title: '소수 의견의 명시적 포함',
    items: [
      '일부 위원은 블루수소의 전과정 배출 특성, 국내 수소 인프라 투자 구조를 감안하더라도 블루수소를 전환활동에 포함하는 것 자체에 반대한다.',
      '이 의견은 향후 기준 상향·재검토 과정에서 별도 검토 대상임을 합의문에 함께 명시한다.'
    ]
  }
]

const mockRemainingIssues = [
  '재생에너지 비중의 구체적 수치와 시기',
  'LNG·블루수소의 전환활동 인정 기간의 구체적 상한선',
  '녹색·전환 채권 금리 차등화의 구체적 수준',
  '시범운영 평가 지표의 가중치와 기준',
  'LCA 데이터 확보 실패 시 제외 절차의 구체적 기준'
]

const mockNextSteps = [
  '각 집단의 세부 의견 수렴 및 보완',
  '구체적 수치와 일정에 대한 추가 협의',
  '시범운영 계획 수립 및 평가 체계 설계',
  '녹색·전환 채권 구분 발행 방안의 세부 설계',
  '레이블 구분(녹색/황색/적색) 시스템의 구체적 설계'
]

const phaseGuide = {
  purpose: '조건부 합의안을 문서 형태로 초안화하고, 남은 쟁점을 명시해 "마지못한 타협"임을 보여줍니다.',
  inputs: ['공통 원칙', '레드라인(집단 A/B)', '남아있는 쟁점', '브릿지 문장 검증 결과'],
  outputs: ['조건부 조항 목록', '운영·평가·재검토 절차', '정보 공개·참여 보장 항목', '소수 의견 명시'],
  demoTips: [
    '각 조건에 기간/기준을 붙여 한시성·상향 가능성을 보여줌',
    '이견이 남은 쟁점을 별도 박스로 고정해 완전 합의가 아님을 강조',
    '다음 단계(시범운영/레이블 설계 등)로 연결되는 액션을 리스트업'
  ]
}

export default function Phase4({ meeting, onBack }: Phase4Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

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
        <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          "무결성 vs 현실성"의 대립을 "조건부·단계적 전환 설계"로 부분적 공통 언어로 전환한 결과
        </p>
      </div>

      <PhaseGuide
        title="Phase 4 시연 가이드"
        purpose={phaseGuide.purpose}
        inputs={phaseGuide.inputs}
        outputs={phaseGuide.outputs}
        demoTips={phaseGuide.demoTips}
      />

      <div className="grid grid-2">
        {/* 좌측: 합의안 조항 */}
        <div>
          <div className="card">
            <h2 className="card-title">조건부 합의안(초안)</h2>
            {mockAgreementItems.map((item, idx) => (
              <div key={item.number} style={{ marginBottom: '0.75rem', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  className="btn"
                  style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f9f9f9',
                    border: 'none',
                    borderRadius: 0,
                    padding: '0.9rem 1rem'
                  }}
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#333' }}>
                    {item.number}. {item.title}
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>{openIdx === idx ? '–' : '+'}</span>
                </button>
                {openIdx === idx && (
                  <ul style={{ padding: '0.75rem 1rem 1rem 1.5rem', background: '#fff' }}>
                    {item.items.map((content, cIdx) => (
                      <li key={cIdx} style={{ marginBottom: '0.65rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        {content}
                      </li>
                    ))}
                  </ul>
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
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              다음 쟁점들은 향후 별도 논의가 필요합니다.
            </p>
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

          {/* 다음 단계 제안 */}
          <div className="card">
            <h2 className="card-title">다음 단계 제안</h2>
            <ul className="list">
              {mockNextSteps.map((step, idx) => (
                <li key={idx} className="list-item">
                  <p style={{ color: '#555', fontSize: '0.95rem' }}>
                    {step}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* 합의 성격 안내 */}
          <div className="card" style={{ marginTop: '1.5rem', background: '#fff9f0', border: '1px solid #ffd4a3' }}>
            <h3 className="card-title" style={{ fontSize: '1rem', color: '#8b5a00' }}>
              합의안의 성격
            </h3>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
              이 합의안은 "해피 엔딩"이 아닌 <strong>"마지못한 타협(Grudging Compromise)"</strong>입니다. 
              모든 참여자가 만족한 것이 아니라, 일정 수준의 공통 인식에 도달한 상태입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 하단: 홈으로 돌아가기 버튼 */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={onBack}>
          홈으로 돌아가기
        </button>
      </div>

      <TabletCTA onPrev={onBack} nextDisabled nextLabel="다음 단계 → (Phase 선택에서 이동)" />
    </div>
  )
}
