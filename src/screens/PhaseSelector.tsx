type Meeting = {
  id: string
  name: string
  agenda: string
}

type PhaseSelectorProps = {
  meeting: Meeting
  onPhaseSelect: (phase: number) => void
  onBack: () => void
  userRole: 'moderator' | 'participant'
}

import TabletCTA from '../components/TabletCTA'

const phases = [
  {
    id: 0,
    title: 'Phase 0 – 사전 프로필 입력',
    description: '참여자 프로필 및 가치 키워드 입력',
    inputs: ['참여자 사전 인터뷰 응답', '감정·가치 키워드'],
    outputs: ['프로필 요약', 'AI 메모(질문 방향, 주의점)'],
    demo: '대화 인터페이스에서 프로필을 정리하는 흐름 시연'
  },
  {
    id: 1,
    title: 'Phase 1 – 감정·가치 매핑',
    description: '발언 내용의 감정과 가치 분석',
    inputs: ['1라운드 발언 스크립트'],
    outputs: ['발언별 감정/가치', '집단별 요약', '마찰 축 한 줄 분석'],
    demo: '같은 목표를 두고 우선순위만 다른 점을 시각화'
  },
  {
    id: 2,
    title: 'Phase 2 – 논증 구조화 & 가치 번역',
    description: '논리 구조 분석 및 가치 번역',
    inputs: ['양측 발언(논점)'],
    outputs: ['전제-이유-결론-숨은 전제', '리스크 관리/전략적 전환 언어 번역', '브릿지 문장 3~5개'],
    demo: '한 문장씩 리스크/전환 언어로 어떻게 바뀌는지 비교'
  },
  {
    id: 3,
    title: 'Phase 3 – 검증·비평·성찰 질문',
    description: '검증 및 비평 질문 생성',
    inputs: ['집단 요약', '브릿지 문장'],
    outputs: ['Verify/Critique/Reflection 질문 세트'],
    demo: '참여자 응답을 받아 합의안 전에 검증하는 흐름 강조'
  },
  {
    id: 4,
    title: 'Phase 4 – 조건부 합의안 초안',
    description: '합의안 초안 작성',
    inputs: ['공통 원칙', '레드라인', '남은 쟁점'],
    outputs: ['조건부 합의 조항', '운영·평가·재검토 절차', '소수 의견 표기'],
    demo: '완전 합의가 아닌 마지못한 타협임을 명시'
  }
]

export default function PhaseSelector({
  meeting,
  onPhaseSelect,
  onBack,
  userRole
}: PhaseSelectorProps) {
  return (
    <div>
      <div className="page-header">
        <button
          className="btn"
          onClick={onBack}
          style={{ marginBottom: '1rem' }}
        >
          ← 홈으로
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>{meeting.name}</h1>
          <span className="tag" style={{ 
            background: userRole === 'moderator' ? '#e8f4f8' : '#fff4e6',
            borderColor: userRole === 'moderator' ? '#b8dce8' : '#ffd4a3',
            color: userRole === 'moderator' ? '#2c5f7c' : '#8b5a00'
          }}>
            {userRole === 'moderator' ? '주관자 모드' : '참가자 모드'}
          </span>
        </div>
        <p className="page-subtitle">{meeting.agenda}</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>데모 시나리오 개요</h3>
        <p className="text-muted" style={{ marginBottom: '0.75rem' }}>
          K-택소노미 안건 2(녹색분류체계) 논쟁을 바탕으로, "무결성 vs 실행 가능성" 갈등을 5단계로 번역·브릿징하는 흐름을 시연합니다.
        </p>
        <ul style={{ paddingLeft: '1.25rem', color: '#555', lineHeight: '1.6' }}>
          <li><strong>Phase 0</strong>: 사전 인터뷰로 감정·가치·프로필을 정리</li>
          <li><strong>Phase 1</strong>: 1라운드 발언을 감정/가치 맵으로 시각화</li>
          <li><strong>Phase 2</strong>: 논증을 구조화하고 상호 번역 + 브릿지 문장 제안</li>
          <li><strong>Phase 3</strong>: Verify/Critique/Reflection 질문을 생성해 편향 검증</li>
          <li><strong>Phase 4</strong>: 조건부 합의안 초안과 남은 쟁점을 명시</li>
        </ul>
      </div>

      <div>
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Phase 선택</h2>
        <div className="grid grid-2">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="card"
              style={{
                minHeight: '220px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                  {phase.title}
                </h3>
                <p className="text-muted" style={{ marginBottom: '0.75rem' }}>
                  {phase.description}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="tag" style={{ background: '#eef6ff', borderColor: '#c6ddff', color: '#225ea8' }}>
                    입력 {phase.inputs.length}
                  </span>
                  <span className="tag" style={{ background: '#eefaf2', borderColor: '#c8e6c9', color: '#2e7d32' }}>
                    출력 {phase.outputs.length}
                  </span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  데모 포인트: {phase.demo}
                </p>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => onPhaseSelect(phase.id)}
              >
                실행
              </button>
            </div>
          ))}
        </div>
      </div>

      <TabletCTA
        onPrev={onBack}
        onNext={() => onPhaseSelect(0)}
        prevLabel="← 홈으로"
        nextLabel="Phase 0 시작"
      />
    </div>
  )
}
