export type ScenarioTurn = {
  speaker: string
  original: string
  without: string
  withAI: string
  reactionBefore: string
  reactionAfter: string
  aiTags: string[]
  step: string
}

export const turns: ScenarioTurn[] = [
  {
    speaker: '박교수(과학)',
    original: '“PIM 반도체와 엑사스케일 확보가 시급합니다.”',
    without: '전문용어만 반복 → 시민: “또 어려운 말… 우리 지역은 왜 배제되죠?”',
    withAI: 'AI가 “돌봄 로봇·재난예측을 위한 기반 기술”로 번역 + ROI 대신 “안전 인프라” 프레이밍',
    reactionBefore: '반응(시민): 방어적 태도, 갈등 지수 상승',
    reactionAfter: '반응(시민): “아, 생활·안전에 직접 닿는 거네요.” 공감 형성',
    aiTags: ['전문용어', '긴급성 프레이밍', '가치: 안전'],
    step: 'Step1-2'
  },
  {
    speaker: '시민 패널',
    original: '“지역은 늘 뒷순위예요. 실질적 혜택이 없잖아요.”',
    without: '감정적 표현 그대로 전달 → 정부: “지역 나눠주기는 비효율적입니다.”',
    withAI: 'AI가 감정 태깅(불안/형평) 후 “생활·안전 R&D 비중 명시”로 재작성',
    reactionBefore: '반응(정부): 방어적, 논점 이탈',
    reactionAfter: '반응(정부): “C바스켓 최소 비율을 명시하겠습니다.” 조건부 합의',
    aiTags: ['감정: 불안', '가치: 형평', '정책 조건'],
    step: 'Step2-3'
  },
  {
    speaker: '김국장(정부)',
    original: '“전략기술에 선투자해야 세수를 확보합니다.”',
    without: '시민: “결국 성장만 보고 복지는 나중?” → 갈등 심화',
    withAI: 'AI가 “선투자 후 지역 환류” 시나리오 제시 + 평가위원회 공동 설계 제안',
    reactionBefore: '반응(시민): 합의 지점 없음',
    reactionAfter: '반응(시민): “지역 환류 로드맵을 넣으면 동의합니다.”',
    aiTags: ['재프레이밍', '조건부 합의', '프로세스 제안'],
    step: 'Step3-5'
  }
]

export const bridgeSentences = [
  '예산을 3바스켓(A:전략기술 / B:응용 / C:생활·안전·기초)으로 구분하여 관리한다.',
  '전략기술(A)에 집중하되, 생활·안전·기초(C) 바스켓은 전체의 최소 N% 이상 의무 배정한다.',
  '청년 연구자·시민이 참여하는 평가위원회 시범사업을 도입한다.',
  '지역 R&D는 나눠주기가 아니라 “지역 특화형 전략산업”과 연계한다.'
]

export const mockLogs = [
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
    label: 'AI 출력 – 가치/감정 태깅',
    content: '[전문용어][긴급성][형평성][불안] 태깅 → 재프레이밍 제안',
    type: 'output' as const
  },
  {
    label: 'AI 출력 – 브릿지 문장',
    content: '예산 3바스켓, C바스켓 최소 비율, 평가위원회 시범사업...',
    type: 'output' as const
  }
]
