import { useMemo, useState } from 'react'
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
}

const mockExpertSummary = `Expert는 K-택소노미가 그린워싱 방지, 녹색투자 활성화라는 두 가지 목표를 모두 달성하려면 
논란 큰 에너지원(LNG·블루수소)을 서둘러 포함시키지 말고, 충분한 논의와 데이터(LCA 등)를 확보한 뒤에 
확장하는 것이 맞다고 본다. 포함하더라도 전환·녹색 구분, 엄격한 조건, 금융상품 구조의 차별화가 없으면 
정책 목표를 오히려 훼손할 수 있다고 우려한다. 자발적 지침일수록 더 엄격해야 한다는 점도 강조한다.`

const mockOfficialSummary = `Official은 K-택소노미가 현재 석탄 의존도가 높은 전원 구조에서 
실제 석탄 감축과 친환경 전원믹스 전환을 유인하는 도구가 되어야 한다고 본다. 
이 과정에서 LNG·청정수소는 진녹색이 아닌 전환활동으로 한시 인정하며, 
기준(340→250)은 기술 발전을 촉진하는 신호로 사용하고, 1년 시범운영과 사회적 논의를 거쳐 
기준을 계속 업그레이드하겠다는 전략이다.`

const mockBridgeSentences = [
  'LNG·블루수소는 녹색활동이 아니라 전환활동으로만 한시 인정한다.',
  '전환활동의 기준은 LCA를 3년 유예 후 2025년부터 의무 적용하고, 국제 기준에 맞춰 지속적으로 강화한다.',
  '녹색채권과 전환채권을 상품·공시·금리 구조에서 명확히 구분한다.',
  '논란이 큰 에너지원은 시범운영 기간 동안 별도의 색상·레이블(예: 황색/적색)을 부여해 시장에 명확한 정보를 제공한다.'
]

const mockVerifyQuestionsExpert = [
  `제가 Expert의 입장을 "${mockExpertSummary.substring(0, 50)}..."로 요약했습니다. 
이 요약에서 가장 잘 담긴 부분과, 덜 정확하거나 빠진 부분은 어디인가요?`,
  `당신의 '환경적 무결성'에 대한 우려를 제가 '정책 리스크·금융 리스크'로 번역했는데, 
이렇게 바꾸면 원래 메시지가 약해진 느낌이 드시나요?`,
  `이 요약에서 당신의 입장에서 꼭 추가되었으면 하는 내용은 무엇인가요?`
]

const mockVerifyQuestionsOfficial = [
  `제가 Official의 입장을 "${mockOfficialSummary.substring(0, 50)}..."로 요약했습니다. 
이 요약이 당신들의 실제 의도를 잘 반영하는가요?`,
  `당신들의 '실행 가능성' 논리를 제가 '전략적 전환 언어'로 번역했는데, 
이 번역이 너무 공손하거나 예쁘게 포장된 느낌이면 '너무 미화됨'이라고 표시해 주세요.`,
  `이 요약에서 정부 입장에서 보완이 필요한 부분은 무엇인가요?`
]

const mockCritiqueQuestions = [
  {
    target: 'Expert에게',
    questions: [
      `AI가 Official의 입장을 정리할 때, "전환활동의 전략적 역할"보다 "리스크"만 강조되는 느낌이 있습니다. 
      석탄 감축 속도에 대한 우려도 일부 위원은 갖고 있는데, 이 부분이 빠진 것 같습니다. 
      이렇게 느끼시나요?`
    ]
  },
  {
    target: 'Official에게',
    questions: [
      `AI가 Expert의 입장을 요약할 때, "전환활동 한시 인정" 프레이밍을 반복하다 보면 
      '포함이 전제'인 것처럼 들릴 위험도 있는 것 같습니다. 
      "일단 빼고 가는 옵션"도 동등하게 제시되면 좋겠다는 의견이 있습니다. 
      이에 대해 어떻게 생각하시나요?`
    ]
  }
]

const mockReflectionQuestions = [
  {
    target: 'Expert에게',
    questions: [
      `초기에는 "LNG·블루수소는 어떤 형태로든 포함하면 안 된다"에 가까운 입장이셨던 것 같습니다. 
      지금은 "전환으로 한시 인정 + 강한 조건·차등 인센티브"라는 옵션에 대해 
      어느 정도 수용 가능하다고 느끼시나요?`,
      `오늘 토론과 번역 과정을 통해, 이 이슈에 대한 자신의 입장이 어디까지 이동했는지 
      스스로 정리해보실 수 있나요?`
    ]
  },
  {
    target: 'Official에게',
    questions: [
      `처음에 "전환 포함이 필수"라는 입장이 강하셨습니다. 지금은 논란이 큰 에너지원에 대해 
      "전환 영역 내에서도 색깔·등급을 나누는 방식" 또는 "일부 보류 옵션"에 대해 
      어느 정도 열려 있으신가요?`,
      `상대 집단(Expert)의 논리·우려를 새롭게 이해하게 된 점이 있나요?`
    ]
  }
]

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

export default function Phase3({ meeting, onBack }: Phase3Props) {
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

  const handleChange = (key: string, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: value }))
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
            <h3 className="card-title" style={{ fontSize: '1rem' }}>Expert 요약</h3>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {mockExpertSummary}
            </p>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '1rem' }}>Official 요약</h3>
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
            {['정확함', '다소 틀림', '완전 틀림'].map((label) => (
              <button
                key={label}
                className="btn"
                style={{ flex: '1 1 30%', minWidth: '120px', background: '#eef6ff', borderColor: '#c6ddff' }}
              >
                {label}
              </button>
            ))}
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

      {/* Verify 질문 */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>1. Verify 질문</h2>
        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '1rem' }}>Expert용 Verify 질문</h3>
            <ul className="list">
              {mockVerifyQuestionsExpert.map((question, idx) => (
                <li key={idx} className="list-item">
                  <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {question}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ fontSize: '1rem' }}>Official용 Verify 질문</h3>
            <ul className="list">
              {mockVerifyQuestionsOfficial.map((question, idx) => (
                <li key={idx} className="list-item">
                  <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {question}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 응답 입력 */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '0.75rem' }}>참여자 응답 캡처 (Verify/Critique/Reflection)</h2>
        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          생성된 질문에 대한 샘플 응답을 입력해 이후 합의안(Phase 4)로 넘기는 흐름을 시연할 수 있습니다.
        </p>
        <div className="grid grid-2">
          <div>
            <strong style={{ display: 'block', marginBottom: '0.35rem' }}>Verify 응답</strong>
            {allVerifyQuestions.map((q, idx) => {
              const key = `verify-${idx}`
              return (
                <div key={key} style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.35rem' }}>{q}</p>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '80px' }}
                    placeholder="응답을 입력하세요"
                    value={responses[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              )
            })}
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: '0.35rem' }}>Critique/Reflection 응답</strong>
            {[...allCritiqueQuestions, ...allReflectionQuestions].map((q, idx) => {
              const key = `crit-ref-${idx}`
              return (
                <div key={key} style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.35rem' }}>{q}</p>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '80px' }}
                    placeholder="응답을 입력하세요"
                    value={responses[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Critique 질문 */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>2. Critique 질문 (AI 프레이밍 비판)</h2>
        <div className="grid grid-2">
          {mockCritiqueQuestions.map((critique, idx) => (
            <div key={idx} className="card">
              <h3 className="card-title" style={{ fontSize: '1rem' }}>{critique.target}</h3>
              <ul className="list">
                {critique.questions.map((question, qIdx) => (
                  <li key={qIdx} className="list-item">
                    <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {question}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Reflection 질문 */}
      <div>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>3. Reflection 질문 (입장 변화 성찰)</h2>
        <div className="grid grid-2">
          {mockReflectionQuestions.map((reflection, idx) => (
            <div key={idx} className="card">
              <h3 className="card-title" style={{ fontSize: '1rem' }}>{reflection.target}</h3>
              <ul className="list">
                {reflection.questions.map((question, qIdx) => (
                  <li key={qIdx} className="list-item">
                    <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {question}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>

      <TabletCTA onPrev={onBack} nextDisabled nextLabel="다음 단계 → (Phase 선택에서 이동)" />
  )
}
