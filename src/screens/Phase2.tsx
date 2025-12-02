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
}

const mockExpert = {
  name: 'Expert',
  premise: '녹색분류체계의 목표는 그린워싱 방지와 녹색투자 활성화인데, 논란 큰 에너지원을 서둘러 포함하면 두 목표 모두 달성 어려움',
  reason: 'LNG는 전과정 기준 석탄의 70% 배출, 블루수소도 탄소중립 기여도 낮음. 국제 기준과의 정합성도 문제',
  hiddenPremise: '제도 무결성이 시장 신뢰의 기반이며, 첫 출발부터 애매하면 장기적 신뢰를 잃을 수 있음',
  conclusion: '논란 큰 에너지원은 충분한 논의와 데이터 확보 후 확장해야 함'
}

const mockOfficial = {
  name: 'Official',
  premise: '탄소중립 시나리오·NDC에서 LNG·청정수소가 과도기적으로 이미 반영되어 있고, 석탄을 줄이기 위해 현실적으로 필요',
  reason: '지금 당장 모든 전원을 재생에너지로 대체할 수 없으며, 전원믹스 전환 과정에서 LNG는 과도기적으로 필요',
  hiddenPremise: '완벽하지만 안 돌아가는 제도보다, 조금 미흡해도 실제로 돌아가고 나중에 기준을 상향할 수 있는 제도가 더 낫다',
  conclusion: 'LNG·청정수소를 녹색이 아닌 전환활동으로 한시적 인정하고, 기준을 지속적으로 상향 조정'
}

const mockTranslationExpertToOfficial = {
  title: 'Expert → Official을 위한 "리스크 관리 언어" 번역',
  risks: [
    {
      type: '정책 리스크',
      content: '국제 기준이 더 엄격해질 때, 현재 LNG·블루수소 프로젝트가 향후 규제 강화로 좌초자산이 될 가능성이 큽니다.'
    },
    {
      type: '금융 리스크',
      content: '녹색이라는 이름이 붙은 채 실제 감축효과가 낮은 자산에 자본이 배분되면, 금융기관·정부 모두 평판 리스크를 떠안게 됩니다.'
    },
    {
      type: '정책 목표 리스크',
      content: '전환 대형 프로젝트에 자본이 쏠리면, 다수의 소규모 진짜 기후 프로젝트에 대한 투자가 위축될 수 있습니다.'
    }
  ],
  conclusion: '따라서 전환활동을 포함시키더라도 녹색과 분리된 명확한 구분(전환채권/녹색채권), 엄격한 조건(한시적 인정, 기준 상향, LCA 적용 시한)이 필요합니다.'
}

const mockTranslationOfficialToExpert = {
  title: 'Official → Expert를 위한 "전략적 전환 언어" 번역',
  strategy: [
    {
      step: '최종 목표',
      content: '재생에너지·그린수소 중심의 전원믹스로 전환'
    },
    {
      step: '중간 단계',
      content: '현재 석탄 의존도가 높은 상황에서, 단기간에 석탄을 줄이기 위한 중간 경유지로 LNG·청정수소를 활용'
    },
    {
      step: '한시적 인정',
      content: '이들 활동을 녹색활동이 아닌 전환활동으로 한시적 인정하여 진녹색 기준과 혼동되지 않도록 함'
    },
    {
      step: '향후 개선 약속',
      content: '기준은 시범운영과 기술 발전에 따라 상향 조정할 계획이며, 녹색과 전환을 채권 차원에서 구분 발행하는 방안도 검토 중'
    }
  ]
}

const mockBridgeSentences = [
  'LNG·블루수소는 녹색활동이 아니라 전환활동으로만 한시 인정한다.',
  '전환활동의 기준은 LCA를 3년 유예 후 2025년부터 의무 적용하고, 국제 기준에 맞춰 지속적으로 강화한다.',
  '녹색채권과 전환채권을 상품·공시·금리 구조에서 명확히 구분한다.',
  '논란이 큰 에너지원은 시범운영 기간 동안 별도의 색상·레이블(예: 황색/적색)을 부여해 시장에 명확한 정보를 제공한다.'
]

const mockLogs = [
  {
    label: 'System prompt',
    content: '당신의 이름은 "AI Agent"이며... 감정·가치 번역과 조건부 합의를 설계합니다.',
    type: 'input' as const
  },
  {
    label: 'User(Phase2) 입력',
    content: '집단 A: LNG 포함 반대 논리 / 집단 B: 과도기적 포함 필요 논리',
    type: 'input' as const
  },
  {
    label: 'AI 출력 – 리스크 관리 번역',
    content: '국제 기준 강화 시 좌초자산 리스크, 평판 리스크, 정책 목표 리스크...',
    type: 'output' as const
  },
  {
    label: 'AI 출력 – 전략적 전환 번역',
    content: '최종 목표는 재생에너지, 중간 경유지로 LNG 한시 활용, 기준 상향 약속...',
    type: 'output' as const
  },
  {
    label: 'AI 출력 – 브릿지 문장',
    content: '녹색활동이 아닌 전환활동으로 한시 인정한다 / LCA 2025 적용 / 채권 구분...',
    type: 'output' as const
  }
]

export default function Phase2({ meeting, onBack }: Phase2Props) {
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

      <div style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h2 className="card-title">논증 구조화</h2>
          <div className="grid grid-2" style={{ marginTop: '1rem' }}>
            {/* Expert 논리 구조 */}
            <div>
              <div style={{ 
                padding: '1rem', 
                background: '#f0f7ff', 
                borderRadius: '6px',
                border: '1px solid #b8dce8'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#2c5f7c' }}>{mockExpert.name} 논리 구조</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>전제:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                    {mockExpert.premise}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>이유:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                    {mockExpert.reason}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>숨은 전제:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                    {mockExpert.hiddenPremise}
                  </p>
                </div>

                <div>
                  <strong>결론:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                    {mockExpert.conclusion}
                  </p>
                </div>
              </div>
            </div>

            {/* Official 논리 구조 */}
            <div>
              <div style={{ 
                padding: '1rem', 
                background: '#fff9f0', 
                borderRadius: '6px',
                border: '1px solid #ffd4a3'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#8b5a00' }}>{mockOfficial.name} 논리 구조</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>전제:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                    {mockOfficial.premise}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>이유:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                    {mockOfficial.reason}
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>숨은 전제:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                    {mockOfficial.hiddenPremise}
                  </p>
                </div>

                <div>
                  <strong>결론:</strong>
                  <p style={{ marginTop: '0.25rem', color: '#555', fontSize: '0.9rem' }}>
                    {mockOfficial.conclusion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            className={`btn ${activeTab === 'expert' ? 'btn-primary' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setActiveTab('expert')}
          >
            Expert → Official (리스크 관리)
          </button>
          <button
            className={`btn ${activeTab === 'official' ? 'btn-primary' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setActiveTab('official')}
          >
            Official → Expert (전략적 전환)
          </button>
        </div>

        {activeTab === 'expert' && (
          <div>
            <h2 className="card-title">{mockTranslationExpertToOfficial.title}</h2>
            {mockTranslationExpertToOfficial.risks.map((risk, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.95rem', color: '#d32f2f' }}>
                  {risk.type}:
                </strong>
                <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {risk.content}
                </p>
              </div>
            ))}
            <div className="divider"></div>
            <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>
              {mockTranslationExpertToOfficial.conclusion}
            </p>
          </div>
        )}

        {activeTab === 'official' && (
          <div>
            <h2 className="card-title">{mockTranslationOfficialToExpert.title}</h2>
            {mockTranslationOfficialToExpert.strategy.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.95rem', color: '#1976d2' }}>
                  {item.step}:
                </strong>
                <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 브릿지 문장 */}
          <div style={{ marginTop: '2rem' }}>
            <div className="card">
              <h2 className="card-title">브릿지 문장 제안 & 선택</h2>
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

      <TabletCTA onPrev={onBack} nextDisabled nextLabel="다음 단계 → (Phase 선택에서 이동)" />
    </div>
  )
}
