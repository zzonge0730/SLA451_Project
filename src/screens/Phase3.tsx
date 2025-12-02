import { useMemo, useState } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaRobot } from 'react-icons/fa'
import PhaseGuide from '../components/PhaseGuide'
import TabletCTA from '../components/TabletCTA'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase3Props = {
  meeting: Meeting | null
  onBack: () => void
  onNext: () => void
}

const mockExpertSummary = `시민과 청년은 현재의 R&D 예산 구조가 지방과 취약 계층을 희생시키고, 연구 생태계의 지속가능성을 해친다고 본다. 
Phase0 사전 인터뷰에서 드러난 "지역 생존권"과 "박탈감(소외)" 우려는, 전략기술 몰빵이 "지역 소멸"로 이어질 수 있다는 불안으로 이어졌다. 
"희생양"이라는 표현이 강하게 나타났듯이, 최소한의 생활·안전 R&D 비율 보장과 평가·고용 구조의 개선을 요구한다.`

const mockOfficialSummary = `정부와 산업계는 글로벌 경쟁 생존을 위해 전략기술에 대한 집중 투자가 필수적이라고 본다. 
예산 분산은 경쟁력 약화로 이어질 것을 우려한다. 
다만, 이것이 생활·안전이나 인력 양성을 부정하는 것은 아니며, 성장을 통해 확보된 재원으로 이를 해결하려는 단계적 접근을 취하고 있다.`

const mockVerifyQuestionsExpert = [
  `제가 시민·청년 측의 입장을 요약했습니다. Phase0에서 나온 "지역 생존권", "박탈감(소외)", "희생양"이라는 키워드가 중심인데, 이 요약이 여러분의 절박함을 충분히 담고 있나요?`,
  `"전략기술 필요성 인정"이라는 부분을 넣었는데, 혹시 이것이 여러분의 반대 논리("지역 소멸" 우려)를 너무 약화시킨 것은 아닌가요?`
]

const mockVerifyQuestionsOfficial = [
  `정부·산업 측 입장을 "성장을 통한 단계적 해결"로 요약했습니다. 이것이 여러분의 의도(선순환)를 잘 설명하고 있나요?`,
  `"예산 분산 우려"를 강조했는데, 이것이 자칫 "지역 무시"로 비칠 오해의 소지는 없을까요?`
]

const mockCritiqueQuestions = [
  {
    target: '시민·청년에게',
    questions: [
      `AI가 정부의 입장을 정리할 때, "성장을 통한 재원 확보"라는 논리가 너무 이상적으로(현실성 없게) 들리지는 않나요?`,
      `정부의 "선택과 집중" 논리가 "지방 소멸"을 정당화하는 논리로 들리지는 않는지, 그렇다면 어떤 부분을 더 지적하고 싶으신가요?`
    ]
  },
  {
    target: '정부·산업에게',
    questions: [
      `AI가 시민 측 입장을 요약할 때, "지역 생존권"이나 "연구 생태계 붕괴" 같은 리스크가 충분히 무겁게 다뤄졌나요?`,
      `시민들의 "희생양"이라는 표현이 단순한 감정적 호소가 아니라 "정책 정당성 위기"로 번역된 것에 동의하시나요?`
    ]
  }
]

const mockReflectionQuestions = [
  {
    target: '시민·청년에게',
    questions: [
      `처음에는 "전략기술 몰빵 결사반대"였지만, 지금은 "비율 조정 + 평가 구조 개선"이라는 타협안에 대해 어느 정도 수용 가능성을 느끼시나요?`,
      `정부 측도 "재원 한계" 때문에 압박감을 느끼고 있다는 점을 이해하게 되셨나요?`
    ]
  },
  {
    target: '정부·산업에게',
    questions: [
      `처음엔 "지역 안배는 비효율"이라고 생각했지만, 이것이 "사회적 갈등 비용"을 줄이는 투자라고 생각을 바꾸실 의향이 있나요?`,
      `단기 성과 압박이 오히려 장기 경쟁력을 해칠 수 있다는 청년 연구자의 우려에 공감하시나요?`
    ]
  }
]

export default function Phase3({ meeting, onBack, onNext }: Phase3Props) {
  const [responses, setResponses] = useState<Record<string, string>>({})

  const allVerifyQuestions = [...mockVerifyQuestionsExpert, ...mockVerifyQuestionsOfficial]
  const allCritiqueQuestions = mockCritiqueQuestions.flatMap((group) => group.questions)
  const allReflectionQuestions = mockReflectionQuestions.flatMap((group) => group.questions)
  const quickQueue = useMemo(
    () => [
      ...allVerifyQuestions.map((q) => ({ type: 'Verify', text: q })),
      ...allCritiqueQuestions.map((q) => ({ type: 'Critique', text: q })),
      ...allReflectionQuestions.map((q) => ({ type: 'Reflection', text: q }))
    ],
    [allVerifyQuestions, allCritiqueQuestions, allReflectionQuestions]
  )
  const [quickIdx, setQuickIdx] = useState(0)
  const quickCurrent = quickQueue[quickIdx]
  const quickAnswerLabels = ['정확함', '다소 틀림', '완전 틀림']

  const handleChange = (key: string, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: value }))
  }

  const phaseGuide = {
    purpose: '브릿지 문장과 요약이 원 의도를 잘 담았는지 검증·비평하고, 입장 변화를 성찰하도록 질문 세트를 자동 생성합니다.',
    inputs: ['집단 A/B 요약', '브릿지 문장 리스트'],
    outputs: ['Verify 질문(정확성 검증)', 'Critique 질문(AI 프레이밍 비판)', 'Reflection 질문(입장 변화 성찰)'],
    demoTips: [
      '질문이 요약/번역에서 무엇이 희석됐는지 직접 묻도록 구성되었음을 강조',
      '"너무 미화됨" 같은 선택지를 넣어 편향 감지 흐름 시연',
      '생성된 질문을 바탕으로 실제 참여자 응답을 입력해 다음 단계로 연결 가능함을 설명'
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
        <h1 className="page-title">Phase 3 – 검증·비평·성찰 질문</h1>
        <p className="phase-desc">AI가 제안하는 검증·비평·성찰 질문</p>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      <PhaseGuide
        title="Phase 3 시연 가이드"
        purpose={phaseGuide.purpose}
        inputs={phaseGuide.inputs}
        outputs={phaseGuide.outputs}
        demoTips={phaseGuide.demoTips}
      />

      {/* 요약 정보 */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '1rem' }}>시민·청년 요약 (비판적 입장)</h3>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {mockExpertSummary}
            </p>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '1rem' }}>정부·산업 요약 (추진 입장)</h3>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {mockOfficialSummary}
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>태블릿용 빠른 질문 진행</h2>
        <p className="text-muted" style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          질문을 한 개씩 크게 보여주고, 선택형 응답으로 빠르게 진행합니다.
        </p>
        <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 700, color: '#333' }}>
            {quickCurrent?.type} 질문 ({quickIdx + 1}/{quickQueue.length})
          </div>
          <div style={{ fontSize: '1rem', color: '#444', lineHeight: '1.6', marginBottom: '1rem' }}>
            {quickCurrent?.text}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {quickAnswerLabels.map((label) => {
              return (
                <button
                  key={label}
                  className="btn"
                  style={{ flex: '1 1 30%', minWidth: '120px', background: '#eef6ff', borderColor: '#c6ddff' }}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <textarea
            className="form-textarea"
            style={{ minHeight: '80px' }}
            placeholder="추가 메모 (선택)"
            value={responses[`quick-${quickIdx}`] || ''}
            onChange={(e) => handleChange(`quick-${quickIdx}`, e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <button
              className="btn"
              style={{ minWidth: '140px' }}
              onClick={() => setQuickIdx((idx) => Math.max(idx - 1, 0))}
              disabled={quickIdx === 0}
            >
              ← 이전 질문
            </button>
            <button
              className="btn btn-primary"
              style={{ minWidth: '140px' }}
              onClick={() => setQuickIdx((idx) => Math.min(idx + 1, quickQueue.length - 1))}
              disabled={quickIdx >= quickQueue.length - 1}
            >
              다음 질문 →
            </button>
          </div>
        </div>
      </div>

      {/* 좌우 분리 레이아웃: 내 논증 확인 vs 비평·성찰 질문 */}
      <div className="grid grid-2" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        {/* 좌측: 내 논증 검증 질문 */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaCheckCircle style={{ color: '#4caf50', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>내 논증 검증 질문</h2>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', color: '#2e7d32' }}>
                시민·청년 측 요약
              </h3>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', padding: '0.75rem', background: '#f1fbf2', borderRadius: '4px' }}>
                {mockExpertSummary}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1565c0' }}>
                정부·산업 측 요약
              </h3>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', padding: '0.75rem', background: '#e3f2fd', borderRadius: '4px' }}>
                {mockOfficialSummary}
              </p>
            </div>
          </div>
        </div>

        {/* 우측: 비평·성찰 질문 (AI 자동 생성) */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaRobot style={{ color: '#4a90e2', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>AI가 생성한 질문</h2>
            </div>
            
            {/* Verify 질문 카드 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FaCheckCircle style={{ color: '#4caf50', fontSize: '1rem' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>Verify (검증)</h3>
              </div>
              {[...mockVerifyQuestionsExpert, ...mockVerifyQuestionsOfficial].map((question, idx) => (
                <div 
                  key={idx} 
                  className="card" 
                  style={{ 
                    marginBottom: '0.75rem',
                    background: '#f9f9f9',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    {question}
                  </p>
                </div>
              ))}
            </div>

            {/* Critique 질문 카드 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FaExclamationTriangle style={{ color: '#ff9800', fontSize: '1rem' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>Critique (비평)</h3>
              </div>
              {mockCritiqueQuestions.flatMap((critique) => 
                critique.questions.map((question, qIdx) => (
                  <div 
                    key={`crit-${qIdx}`} 
                    className="card" 
                    style={{ 
                      marginBottom: '0.75rem',
                      background: '#fff3e0',
                      border: '1px solid #ffb74d'
                    }}
                  >
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                      {question}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Reflection 질문 카드 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FaLightbulb style={{ color: '#9c27b0', fontSize: '1rem' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>Reflection (성찰)</h3>
              </div>
              {mockReflectionQuestions.flatMap((reflection) => 
                reflection.questions.map((question, qIdx) => (
                  <div 
                    key={`ref-${qIdx}`} 
                    className="card" 
                    style={{ 
                      marginBottom: '0.75rem',
                      background: '#f3e5f5',
                      border: '1px solid #ba68c8'
                    }}
                  >
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                      {question}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <TabletCTA onPrev={onBack} onNext={onNext} nextDisabled={false} nextLabel="다음 단계 → (Phase 4)" />
    </div>
  )
}
