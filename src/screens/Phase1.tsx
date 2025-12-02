import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts'
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
  onNext: () => void
}

const mockStatements = [
  {
    speaker: '정부(국장)',
    text: '내년도 국가 R&D 예산 35조 중 약 60%를 AI·양자·에너지 같은 전략기술에 집중해야 합니다. 국제 경쟁이 너무 치열해서, 지금 선택과 집중을 하지 않으면 다 같이 무너집니다.',
    emotions: [
      { keyword: '압박감', example: '한정된 예산과 성과 압박' },
      { keyword: '절박함', example: '국가 경쟁력 상실 우려' }
    ],
    values: ['효율성', '국가 경쟁력', '전략기술 선점']
  },
  {
    speaker: '산업(CTO)',
    text: '기업 입장에서는 수도권 클러스터에 투자를 집중해야 파이프라인이 안 끊깁니다. R&D를 지역 안배로 나누는 순간, 세계 1등은 불가능해집니다.',
    emotions: [
      { keyword: '조급함', example: '기술 패권 경쟁의 속도' },
      { keyword: '불신', example: '나눠먹기식 투자에 대한 우려' }
    ],
    values: ['혁신 속도', '집적 효과', '글로벌 리더십']
  },
  {
    speaker: '시민(활동가)',
    text: '그 말대로라면 지방은 앞으로도 계속 "희생의 대상"이라는 뜻입니까? 응급실도 없는 지역 현실은 외면하고 수조 원을 쏟아붓는다니, 국민 세금으로 누굴 위한 잔치를 하는 겁니까?',
    emotions: [
      { keyword: '분노', example: '희생양 취급에 대한 분노' },
      { keyword: '박탈감', example: '삶의 질 격차' }
    ],
    values: ['형평성', '지역 생존권', '생활·안전']
  },
  {
    speaker: '청년(연구자)',
    text: '분야도 중요하지만 방식이 더 걱정입니다. 3년짜리 단기 성과만 요구하면 누구도 위험한 연구를 못 합니다. 예산과 함께 평가·고용 구조도 바뀌어야 합니다.',
    emotions: [
      { keyword: '피로감', example: '단기 성과 위주의 압박' },
      { keyword: '무력감', example: '불안정한 연구 환경' }
    ],
    values: ['지속가능성', '연구 생태계', '도전적 연구']
  }
]

const mockGroupSummary = {
  expert: { // 시민/청년 (비판 측) - 변수명은 expert로 유지하되 내용은 비판 측
    emotions: '분노(희생), 박탈감(소외), 피로감(단기성과)',
    values: '형평성, 지역 생존, 지속가능한 생태계'
  },
  official: { // 정부/산업 (추진 측) - 변수명은 official로 유지하되 내용은 추진 측
    emotions: '압박감(예산·성과), 조급함(경쟁), 불신',
    values: '효율성, 국가 경쟁력, 선택과 집중'
  }
}

const quickCards = [
  { label: '압박감 😣', detail: '성과/예산 한계', tone: '#eef6ff', border: '#c6ddff' },
  { label: '조급함 ⏱️', detail: '기술 경쟁 속도', tone: '#eef6ff', border: '#c6ddff' },
  { label: '분노 😠', detail: '지역 희생 강요', tone: '#fff5f5', border: '#ffcdd2' },
  { label: '박탈감 😔', detail: '삶의 질 격차', tone: '#fff5f5', border: '#ffcdd2' },
  { label: '피로감 😓', detail: '단기 성과 압박', tone: '#fff7ed', border: '#ffe0b2' },
  { label: '무력감 😶', detail: '연구 환경 불안', tone: '#fff7ed', border: '#ffe0b2' }
]

// 레이더 차트 데이터 (가치 프레임 시각화)
const radarData = [
  { 
    value: 'ROI',
    '정부·산업': 90,
    '시민·청년': 30
  },
  { 
    value: '형평성',
    '정부·산업': 25,
    '시민·청년': 95
  },
  { 
    value: '지역생존권',
    '정부·산업': 20,
    '시민·청년': 90
  },
  { 
    value: '장기성',
    '정부·산업': 50,
    '시민·청년': 85
  },
  { 
    value: '단기성과',
    '정부·산업': 95,
    '시민·청년': 25
  }
]

export default function Phase1({ meeting, onBack, onNext }: Phase1Props) {
  const phaseGuide = {
    purpose: '1라운드 발언을 감정·가치 지도와 집단 요약으로 바꿔 초기 마찰 지점을 드러냅니다.',
    inputs: ['회의 1라운드 발언 스크립트', '화자 정보(정부/산업/시민/청년)'],
    outputs: ['발언별 감정·가치 태깅', '집단별 감정/가치 요약', '마찰 축 한 줄 분석'],
    demoTips: [
      '같은 목표를 공유하지만 우선순위가 다른 지점을 강조',
      '"효율성(정부) vs 형평성(시민)"이라는 축을 카드/태그로 보여줌',
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
        <h1 className="page-title">Phase 1 – 가치 맥락 정렬</h1>
        <p className="phase-desc">방 안의 감정·가치를 지도화하는 단계</p>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
      </div>

      {/* Row 1: 레이더 차트 (전체 너비) */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title">가치 프레임 시각화 (레이더 차트)</h2>
        <div style={{ height: '450px', marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="value" 
                style={{ fontSize: '1rem', fontWeight: '500' }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="정부·산업 (전문가)"
                dataKey="정부·산업"
                stroke="#4a90e2"
                fill="#4a90e2"
                fillOpacity={0.6}
              />
              <Radar
                name="시민·청년 (지역)"
                dataKey="시민·청년"
                stroke="#ff9800"
                fill="#ff9800"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Value Blocks (좌우 분리) */}
      <div className="grid grid-2" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        {/* 좌측: 전문가 블록 */}
        <div className="card" style={{ background: '#e3f2fd', border: '2px solid #2196f3' }}>
          <h2 className="card-title" style={{ color: '#1565c0' }}>전문가 (정부·산업)</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#1565c0' }}>효율성 강조</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#1565c0' }}>투자집중 논리</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#1565c0' }}>글로벌 경쟁력</strong>
            </li>
          </ul>
        </div>

        {/* 우측: 시민/지역 블록 */}
        <div className="card" style={{ background: '#e8f5e9', border: '2px solid #4caf50' }}>
          <h2 className="card-title" style={{ color: '#2e7d32' }}>시민/지역 (참여자)</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#2e7d32' }}>형평성 강조</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#2e7d32' }}>지역생존권</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#2e7d32' }}>안전·생활 기반 우선</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Info: 공통 목표 + 차이점 */}
      <div className="card" style={{ background: '#fff9f0', border: '1px solid #ffd4a3', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#8b5a00' }}>가치 맥락 분석</h3>
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ color: '#8b5a00' }}>공통된 목표:</strong>
          <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '1rem', fontWeight: '500' }}>
            "국민 삶의 향상"
          </p>
        </div>
        <div>
          <strong style={{ color: '#8b5a00' }}>차이점:</strong>
          <p style={{ marginTop: '0.5rem', color: '#555', lineHeight: '1.6' }}>
            접근 방식의 우선순위가 다릅니다. 전문가는 "효율성과 경쟁력을 통한 성장 → 재원 확보 → 삶의 향상"을, 
            시민/지역은 "형평성과 안전 보장 → 지역 생존 → 삶의 향상"을 우선시합니다.
          </p>
        </div>
      </div>

      {/* PhaseGuide는 우측에 유지 */}
      <div className="analysis-panel" style={{ marginTop: '2rem' }}>
        <PhaseGuide
          title="Phase 1 시연 가이드"
          purpose={phaseGuide.purpose}
          inputs={phaseGuide.inputs}
          outputs={phaseGuide.outputs}
          demoTips={phaseGuide.demoTips}
        />
      </div>

      <TabletCTA onPrev={onBack} onNext={onNext} nextDisabled={false} nextLabel="다음 단계 → (Phase 2)" />
    </div>
  )
}
