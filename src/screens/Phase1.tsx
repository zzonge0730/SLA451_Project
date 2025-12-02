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
    demoTips: [
      '같은 목표를 공유하지만 우선순위가 다른 지점을 강조',
      '"효율성(정부) vs 형평성(시민)"이라는 축을 카드/태그로 보여줌',
      '레이더 차트로 가치 프레임을 시각적으로 비교'
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
                    stroke="#1976d2"
                    fill="#1976d2"
                    fillOpacity={0.7}
                  />
                  <Radar
                    name="시민·청년 (지역)"
                    dataKey="시민·청년"
                    stroke="#d32f2f"
                    fill="#d32f2f"
                    fillOpacity={0.7}
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
          demoTips={phaseGuide.demoTips}
        />
      </div>

      <TabletCTA onPrev={onBack} onNext={onNext} nextDisabled={false} nextLabel="다음 단계 → (Phase 2)" />
    </div>
  )
}
