import { useState } from 'react'
import { FaRobot, FaFileAlt } from 'react-icons/fa'
import TabletCTA from '../components/TabletCTA'

type Meeting = {
  id: string
  name: string
  agenda: string
}

type Phase4Props = {
  meeting: Meeting | null
  onBack: () => void
  onNext: () => void
}

const mockAgreementItems = [
  {
    number: 1,
    title: '기본 원칙: 3바스켓 예산 구조 도입',
    items: [
      '국가 R&D 예산을 A(전략기술), B(중장기 응용), C(생활·안전·기초·인력) 세 바스켓으로 구분하여 관리한다.',
      '각 바스켓은 서로 다른 목표와 평가 기준을 적용한다.'
    ]
  },
  {
    number: 2,
    title: '조건 1 – 생활·안전(C) 바스켓 최소 비율 보장',
    items: [
      'Phase0 사전 인터뷰에서 드러난 "지역 생존권"과 "박탈감(소외)" 우려를 반영하여, 생활·안전·보건 및 기초 연구 예산(C)은 전체의 최소 N% 이상을 의무적으로 확보한다.',
      '이 비율은 매년 전략환경 변화와 평가 결과에 따라 재조정하되, 전년 대비 급격한 축소를 방지한다.'
    ]
  },
  {
    number: 3,
    title: '조건 2 – 평가 체계 개편 시범사업',
    items: [
      '단기 성과 지표 대신 과정과 잠재력을 보는 새로운 평가 방식을 도입한다.',
      '청년 연구자와 시민 대표가 참여하는 평가위원회 시범사업을 3년간 운영하고, 이후 제도화 여부를 검토한다.'
    ]
  },
  {
    number: 4,
    title: '조건 3 – 정보 공개 및 환류',
    items: [
      '각 바스켓별 예산 배분 결과와 성과 지표를 국민에게 투명하게 공개한다.',
      '전략기술 투자의 성과가 지역과 생활 안전으로 환류되는지 측정할 수 있는 지표를 개발한다.'
    ]
  }
]

const mockRemainingIssues = [
  '전략기술(A) 바스켓의 예산 비중 상한선 설정 여부',
  '생활·안전(C) 바스켓의 구체적인 최소 비율(%) 수치 (Phase0에서 제기된 "지역 소멸" 우려를 고려)',
  '평가위원회 시범사업의 위원 구성 비율 및 권한 범위',
  '지방 R&D 예산의 배분 방식(지자체 자율 vs 중앙 공모) - "지역 생존권" 보장을 위한 구체적 방안'
]

const mockNextSteps = [
  '각 바스켓별 구체적 예산 시나리오 시뮬레이션',
  '평가위원회 시범사업 운영 계획 수립',
  '생활·안전 R&D의 구체적 대상 사업 발굴',
  '대국민 공청회를 통한 의견 수렴'
]

export default function Phase4({ meeting, onBack, onNext }: Phase4Props) {
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
        <h1 className="page-title">Phase 4 – 조건부 합의(초안)</h1>
        <p className="phase-desc">AI 문서 생성 UI: 합의 항목 조립 + 남은 쟁점 정리</p>
        {meeting && (
          <p className="page-subtitle">{meeting.name} - {meeting.agenda}</p>
        )}
        <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          "성장 vs 분배"의 대립을 "3바스켓 구조 + 평가 개편"으로 부분적 공통 언어로 전환한 결과
        </p>
      </div>

      <div className="grid grid-2">
        {/* 좌측: 합의안 조항 */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaRobot style={{ color: '#4a90e2', fontSize: '1.2rem' }} />
              <h2 className="card-title" style={{ marginBottom: 0 }}>AI가 생성한 조건부 합의안(초안)</h2>
            </div>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              Phase 0~3의 논의를 바탕으로 AI가 자동 생성한 합의안입니다. 각 항목을 클릭하여 상세 내용을 확인하세요.
            </p>
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

        {/* 우측: 남은 쟁점 + 제안 */}
        <div className="analysis-panel">
          {/* 여전히 남은 쟁점 */}
          <div className="card" style={{ marginBottom: '1.5rem', background: '#f5f5f5', border: '1px solid #e0e0e0' }}>
            <h2 className="card-title" style={{ color: '#666' }}>여전히 남은 쟁점</h2>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              다음 쟁점들은 향후 별도 논의가 필요합니다.
            </p>
            <ul className="list">
              {mockRemainingIssues.map((issue, idx) => (
                <li key={idx} className="list-item" style={{ background: '#fafafa', borderColor: '#e0e0e0' }}>
                  <p style={{ color: '#666', fontSize: '0.95rem' }}>
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

      {/* 하단: 합의문 최종 보기 버튼 */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className="btn btn-primary" 
          style={{ 
            minWidth: '200px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem',
            padding: '1rem 2rem'
          }}
          onClick={() => {
            // 합의문 최종 보기 (새 창 또는 모달)
            alert('합의문 최종 문서를 생성합니다.\n(실제 구현에서는 PDF 다운로드 또는 새 창 표시)')
          }}
        >
          <FaFileAlt />
          합의문 최종 보기
        </button>
        <div style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={onBack} style={{ minWidth: '140px' }}>
            홈으로 돌아가기
          </button>
        </div>
      </div>

      <TabletCTA onPrev={onBack} onNext={onNext} nextDisabled={false} nextLabel="완료 (홈으로)" />
    </div>
  )
}
