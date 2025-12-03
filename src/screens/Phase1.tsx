import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts'
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

// 레이더 차트 데이터 (참여자 4인 세부 시각화)
const radarData = [
  { 
    value: 'ROI',
    '김국장(정부)': 85,
    '박교수(과학)': 35,
    '이상무(기업)': 95,
    '정대표(시민)': 25
  },
  { 
    value: '형평성',
    '김국장(정부)': 30,
    '박교수(과학)': 30,
    '이상무(기업)': 20,
    '정대표(시민)': 95
  },
  { 
    value: '지역생존권',
    '김국장(정부)': 25,
    '박교수(과학)': 20,
    '이상무(기업)': 15,
    '정대표(시민)': 90
  },
  { 
    value: '장기성',
    '김국장(정부)': 55,
    '박교수(과학)': 95,
    '이상무(기업)': 45,
    '정대표(시민)': 70
  },
  { 
    value: '단기성과',
    '김국장(정부)': 80,
    '박교수(과학)': 25,
    '이상무(기업)': 95,
    '정대표(시민)': 30
  }
]

export default function Phase1({ meeting, onBack, onNext }: Phase1Props) {
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
                    name="김국장(정부)"
                    dataKey="김국장(정부)"
                    stroke="#455A64"
                    strokeWidth={2.5}
                    fill="#455A64"
                    fillOpacity={0.28}
                  />
                  <Radar
                    name="박교수(과학)"
                    dataKey="박교수(과학)"
                    stroke="#1E88E5"
                    strokeWidth={2}
                    fill="#1E88E5"
                    fillOpacity={0.18}
                  />
                  <Radar
                    name="이상무(기업)"
                    dataKey="이상무(기업)"
                    stroke="#EF6C00"
                    strokeWidth={2}
                    fill="#EF6C00"
                    fillOpacity={0.18}
                  />
                  <Radar
                    name="정대표(시민)"
                    dataKey="정대표(시민)"
                    stroke="#2E7D32"
                    strokeWidth={2}
                    fill="#2E7D32"
                    fillOpacity={0.20}
                  />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: 개인별 가치 블록 (4인) */}
      <div className="grid grid-2" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        <div className="card" style={{ background: '#f9fbff', border: '1px solid #d9e4f5', borderLeft: '4px solid #455A64' }}>
          <h2 className="card-title" style={{ color: '#37474F' }}>김국장 (정부)</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#37474F' }}>효율·재정 건전성</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#37474F' }}>우수성 유지</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#37474F' }}>구조 급변 회피</strong>
            </li>
          </ul>
        </div>
        <div className="card" style={{ background: '#f9fbff', border: '1px solid #d9e4f5', borderLeft: '4px solid #1E88E5' }}>
          <h2 className="card-title" style={{ color: '#1E88E5' }}>박교수 (과학)</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#1E88E5' }}>장기성·기초 연구</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#1E88E5' }}>우수성/클러스터</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#1E88E5' }}>생태계 안정</strong>
            </li>
          </ul>
        </div>
        <div className="card" style={{ background: '#fffaf4', border: '1px solid #ffe2c6', borderLeft: '4px solid #EF6C00' }}>
          <h2 className="card-title" style={{ color: '#EF6C00' }}>이상무 (기업)</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#EF6C00' }}>ROI·단기성과</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#EF6C00' }}>시장 진입 속도</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#EF6C00' }}>글로벌 경쟁</strong>
            </li>
          </ul>
        </div>
        <div className="card" style={{ background: '#f3fbf5', border: '1px solid #d4eadc', borderLeft: '4px solid #2E7D32' }}>
          <h2 className="card-title" style={{ color: '#2E7D32' }}>정대표 (시민)</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#2E7D32' }}>형평성</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#2E7D32' }}>지역 생존권</strong>
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              <strong style={{ color: '#2E7D32' }}>생활·안전 우선</strong>
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

      <TabletCTA onPrev={onBack} onNext={onNext} nextDisabled={false} nextLabel="다음 단계 → (Phase 2)" />
    </div>
  )
}
