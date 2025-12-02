import { useState } from 'react'
import PhaseGuide from '../components/PhaseGuide'
import LogPanel from '../components/LogPanel'
import TabletCTA from '../components/TabletCTA'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase2Props = {
  meeting: Meeting | null
  onBack: () => void
  onNext: () => void
}

const mockExpert = { // 시민/청년 대표 (비판 측)
  name: '시민·청년 (비판 측)',
  premise: '국가 R&D는 국민 세금이며, 지역 주민의 삶과 연구자의 생존을 보장해야 한다.',
  reason: '전략기술 몰빵은 지역 소멸을 가속화하고, 단기 성과주의는 연구 생태계를 황폐화시킨다.',
  hiddenPremise: '성장보다 분배와 안정이 우선이며, 내가 배제된 성장은 의미가 없다.',
  conclusion: '전략기술 예산 독점을 막고, 생활·안전 R&D와 인력 투자를 보장해야 한다.'
}

const mockOfficial = { // 정부/산업 대표 (추진 측)
  name: '정부·산업 (추진 측)',
  premise: '글로벌 기술 패권 경쟁에서 살아남으려면 선택과 집중이 불가피하다.',
  reason: '나눠주기식 R&D로는 임팩트를 낼 수 없으며, 국가 경쟁력이 없으면 복지 재원도 없다.',
  hiddenPremise: '낙수 효과는 유효하며, 지금의 희생이 나중에 더 큰 보상으로 돌아올 것이다.',
  conclusion: '전략기술에 집중 투자하여 파이를 키우는 것이 최우선 과제다.'
}

const mockTranslationExpertToOfficial = {
  title: '시민/청년 → 정부를 위한 "리스크 관리 언어" 번역',
  risks: [
    {
      type: '정책 정당성 리스크',
      content: '지역 주민과 청년 연구자가 배제된 R&D는 "그들만의 리그"로 인식되어, 장기적인 정책 지지를 잃을 수 있습니다.'
    },
    {
      type: '사회 통합 리스크',
      content: '지역 간 격차가 심화되면 "국가 R&D 무용론"이나 조세 저항 같은 사회적 갈등 비용이 발생합니다.'
    },
    {
      type: '연구 생태계 붕괴 리스크',
      content: '단기 성과에만 집착하면 도전적 연구가 사라지고, 인재들이 해외로 유출되어 결국 기술 경쟁력도 잃게 됩니다.'
    }
  ],
  conclusion: '따라서 전략기술 투자와 별도로, 생활·안전 R&D와 인력 투자를 "사회적 안전망" 차원에서 필수적으로 확보해야 합니다.'
}

const mockTranslationOfficialToExpert = {
  title: '정부 → 시민을 위한 "전략적 전환 언어" 번역',
  strategy: [
    {
      step: '최종 목표',
      content: '기술 경쟁력 확보를 통해 세수와 일자리를 늘려, 결국 국민 삶의 질과 복지를 향상시키는 것'
    },
    {
      step: '선투자 전략',
      content: '지금은 골든타임이므로 전략기술에 선투자하여 재원을 확보하려는 것이며, 지역 소외가 목적이 아님'
    },
    {
      step: '제도적 보완',
      content: '전략기술 성과가 지역과 생활 안전으로 환류될 수 있도록, 예산 배분 구조와 평가 체계를 함께 개선하겠음'
    }
  ]
}

const mockBridgeSentences = [
  '예산을 3바스켓(A:전략기술 / B:응용 / C:생활·안전·기초)으로 구분하여 관리한다.',
  '전략기술(A)에 집중하되, Phase0에서 제기된 "지역 생존권" 우려를 반영하여 생활·안전·기초(C) 바스켓은 전체의 최소 N% 이상을 의무 배정한다.',
  '단기 성과 지표 대신, 청년 연구자와 시민이 참여하는 새로운 평가위원회 시범사업을 도입한다.',
  '지역 R&D는 나눠주기가 아니라 "지역 특화형 전략산업"과 연계하여 실효성을 높인다.'
]

const mockLogs = [
  {
    label: 'System prompt',
    content: '당신의 이름은 "AI Agent"이며... 감정·가치 번역과 조건부 합의를 설계합니다.',
    type: 'input' as const
  },
  {
    label: 'User(Phase2) 입력',
    content: '집단 A: 전략기술 집중 투자 / 집단 B: 지역 소외 및 단기 성과 비판',
    type: 'input' as const
  },
  {
    label: 'AI 출력 – 리스크 관리 번역',
    content: '정책 정당성 리스크, 사회 통합 리스크, 연구 생태계 붕괴 리스크...',
    type: 'output' as const
  },
  {
    label: 'AI 출력 – 전략적 전환 번역',
    content: '최종 목표는 삶의 질 향상, 선투자 후환류 전략, 제도적 보완 약속...',
    type: 'output' as const
  },
  {
    label: 'AI 출력 – 브릿지 문장',
    content: '예산 3바스켓 구조 / C바스켓 최소 비율 / 평가위원회 시범사업...',
    type: 'output' as const
  }
]

export default function Phase2({ meeting, onBack, onNext }: Phase2Props) {
  const [bridgeStatus, setBridgeStatus] = useState<Record<number, 'adopted' | 'edited' | 'dropped'>>({
    0: 'adopted',
    1: 'edited',
    2: 'adopted',
    3: 'dropped'
  })
  const [activeTab, setActiveTab] = useState<'expert' | 'official'>('expert')
  const [showLogs, setShowLogs] = useState(false)

  const phaseGuide = {
    purpose: '논증을 구조화하고, 서로 다른 언어(리스크/전략)로 번역해 브릿지 문장을 제안합니다.',
    inputs: ['양측 발언(논점, 근거)', '집단 A/B 구분 정보'],
    outputs: ['전제-이유-결론-숨은 전제 구조', '리스크 관리 언어 번역', '전략적 전환 언어 번역', '브릿지 문장 3~5개'],
    demoTips: [
      '좌측/우측 컬러 대비로 두 집단 논리를 분리',
      '"숨은 전제"가 어떻게 드러나는지 강조',
      '브릿지 문장은 토글이나 선택형으로 보여줄 수 있음을 언급'
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
        <h1 className="page-title">Phase 2 – 논증 구조화 & 가치 번역</h1>
        <p className="phase-desc">AI 완충지대 핵심 단계: 논쟁 구조도 → 가치 번역 → 브릿지 문장</p>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      <PhaseGuide
        title="Phase 2 시연 가이드"
        purpose={phaseGuide.purpose}
        inputs={phaseGuide.inputs}
        outputs={phaseGuide.outputs}
        demoTips={phaseGuide.demoTips}
      />

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: 0 }}>입출력 로그 보기</h3>
          <button className="btn" style={{ minWidth: '120px' }} onClick={() => setShowLogs(!showLogs)}>
            {showLogs ? '숨기기' : '열기'}
          </button>
        </div>
        {showLogs && (
          <div style={{ marginTop: '0.75rem' }}>
            <LogPanel
              description="시스템/사용자 입력과 AI 출력 흐름을 함께 보여주는 로그입니다."
              logs={mockLogs}
            />
          </div>
        )}
      </div>

      {/* Section 1: 논쟁 구조도 */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h2 className="card-title">논쟁 구조도</h2>
          <div className="grid grid-2" style={{ marginTop: '1rem' }}>
            {/* 좌측: 시민/참여자 논점 (감정/우려 기반) */}
            <div>
              <div style={{ 
                padding: '1.25rem', 
                background: '#e8f5e9', 
                borderRadius: '8px',
                border: '2px solid #4caf50',
                height: '100%'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#2e7d32', fontSize: '1.1rem', fontWeight: '700' }}>
                  시민/참여자 논점
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#2e7d32', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>지역 소외</span>
                  </li>
                  <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#2e7d32', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>생활·안전 미반영</span>
                  </li>
                  <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#2e7d32', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>"성장" 명목 희생 우려</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 우측: 전문가/정부 논점 (정책/데이터 기반) */}
            <div>
              <div style={{ 
                padding: '1.25rem', 
                background: '#e3f2fd', 
                borderRadius: '8px',
                border: '2px solid #2196f3',
                height: '100%'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1565c0', fontSize: '1.1rem', fontWeight: '700' }}>
                  전문가/정부 논점
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#1565c0', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>투자집중 필요성</span>
                  </li>
                  <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#1565c0', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>전략기술 우선</span>
                  </li>
                  <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#1565c0', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>ROI / 글로벌 경쟁</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* 아래 화살표 */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1.5rem',
            fontSize: '2rem',
            color: '#666'
          }}>
            ↓
          </div>
        </div>
      </div>

      {/* Section 2: AI Bridge (자동 번역) */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem', color: '#666' }}>
          ▼ AI Bridge (자동 번역)
        </div>
        <div className="card">
          <h2 className="card-title">MediR&D의 번역 결과</h2>
          <div className="grid grid-2" style={{ marginTop: '1rem', gap: '1.5rem' }}>
            {/* 좌측: 시민 발언 → 정부가 이해할 수 있는 언어로 */}
            <div>
              <div style={{ 
                padding: '1rem', 
                background: '#fff3e0', 
                borderRadius: '6px',
                border: '1px solid #ffb74d'
              }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: '#e65100', 
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              시민 → 정부 번역 (리스크 관리 언어)
            </h3>
                {mockTranslationExpertToOfficial.risks.map((risk, idx) => (
                  <div key={idx} style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#d32f2f' }}>
                      {risk.type}:
                    </strong>
                    <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {risk.content}
                    </p>
                  </div>
                ))}
                <div className="divider" style={{ margin: '1rem 0' }}></div>
                <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  {mockTranslationExpertToOfficial.conclusion}
                </p>
              </div>
            </div>

            {/* 우측: 정부 발언 → 시민이 받아들일 수 있는 언어로 */}
            <div>
              <div style={{ 
                padding: '1rem', 
                background: '#e8eaf6', 
                borderRadius: '6px',
                border: '1px solid #7986cb'
              }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: '#283593', 
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              정부 → 시민 번역 (전략적 전환 언어)
            </h3>
                {mockTranslationOfficialToExpert.strategy.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#1976d2' }}>
                      {item.step}:
                    </strong>
                    <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: 보조적 표현 후보 (채택/수정/폐기) */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.5rem', color: '#666' }}>
          ▼ 보조적 표현 후보
        </div>
        <div className="card">
          <h2 className="card-title">브릿지 문장 제안 & 선택</h2>
          <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            AI가 생성한 브릿지 문장 후보입니다. 각 문장에 대해 채택/수정/폐기를 선택하세요.
          </p>
              <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                양쪽이 부분적으로라도 수용할 수 있을 것 같은 브릿지 문장들입니다. 채택/수정/폐기 상태를 선택해 보여주세요.
              </p>
              <div className="grid grid-2">
                {mockBridgeSentences.map((sentence, idx) => {
                  const status = bridgeStatus[idx]
                  return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    border: status === 'adopted' ? '1px solid #4caf50' : status === 'edited' ? '1px solid #ff9800' : '1px solid #e53935',
                    background:
                      status === 'adopted'
                        ? '#f1fbf2'
                        : status === 'edited'
                        ? '#fff7ed'
                        : '#fff5f5'
                  }}
                >
                  <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                    {sentence}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={`btn ${status === 'adopted' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                      onClick={() => setBridgeStatus({ ...bridgeStatus, [idx]: 'adopted' })}
                    >
                      채택
                    </button>
                    <button
                      className={`btn ${status === 'edited' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                      onClick={() => setBridgeStatus({ ...bridgeStatus, [idx]: 'edited' })}
                    >
                      수정
                    </button>
                    <button
                      className={`btn ${status === 'dropped' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                      onClick={() => setBridgeStatus({ ...bridgeStatus, [idx]: 'dropped' })}
                    >
                      폐기
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="divider"></div>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
            <span className="tag" style={{ background: '#f1fbf2', borderColor: '#c8e6c9', color: '#2e7d32' }}>
              채택 {Object.values(bridgeStatus).filter((s) => s === 'adopted').length}
            </span>
            <span className="tag" style={{ background: '#fff7ed', borderColor: '#ffcc80', color: '#e65100' }}>
              수정 {Object.values(bridgeStatus).filter((s) => s === 'edited').length}
            </span>
            <span className="tag" style={{ background: '#fff5f5', borderColor: '#ffcdd2', color: '#c62828' }}>
              폐기 {Object.values(bridgeStatus).filter((s) => s === 'dropped').length}
            </span>
          </div>
        </div>
      </div>

      <TabletCTA onPrev={onBack} onNext={onNext} nextDisabled={false} nextLabel="다음 단계 → (Phase 3)" />
    </div>
  )
}
