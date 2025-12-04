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

export type ScenarioLog = {
  label: string
  content: string
  type: 'input' | 'output'
}

export type ScenarioMode = 'scripted' | 'llm'

export type ScenarioDefinition = {
  id: ScenarioMode
  label: string
  description: string
  turns: ScenarioTurn[]
  bridgeSentences: string[]
  bridgeDefaults: Array<'adopted' | 'edited' | 'dropped'>
  logs: ScenarioLog[]
  metrics: {
    conflictWithout: number
    conflictWithAI: number
    consensusWithout: number
    consensusWithAI: number
  }
}

const scriptedScenario: ScenarioDefinition = {
  id: 'scripted',
  label: '기존 데모 (하드코딩)',
  description: '자료에 맞춰 사전 작성된 시나리오를 그대로 보여주는 모드입니다.',
  metrics: {
    conflictWithout: 82,
    conflictWithAI: 41,
    consensusWithout: 24,
    consensusWithAI: 68
  },
  bridgeDefaults: ['adopted', 'edited', 'adopted', 'dropped'],
  turns: [
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
  ],
  bridgeSentences: [
    '예산을 3바스켓(A:전략기술 / B:응용 / C:생활·안전·기초)으로 구분하여 관리한다.',
    '전략기술(A)에 집중하되, 생활·안전·기초(C) 바스켓은 전체의 최소 N% 이상 의무 배정한다.',
    '청년 연구자·시민이 참여하는 평가위원회 시범사업을 도입한다.',
    '지역 R&D는 나눠주기가 아니라 “지역 특화형 전략산업”과 연계한다.'
  ],
  logs: [
    {
      label: 'System prompt',
      content: '당신의 이름은 "AI Agent"이며... 감정·가치 번역과 조건부 합의를 설계합니다.',
      type: 'input'
    },
    {
      label: 'User(Phase2) 입력',
      content: '집단 A: 전략기술 집중 투자 / 집단 B: 지역 소외 및 단기 성과 비판',
      type: 'input'
    },
    {
      label: 'AI 출력 – 가치/감정 태깅',
      content: '[전문용어][긴급성][형평성][불안] 태깅 → 재프레이밍 제안',
      type: 'output'
    },
    {
      label: 'AI 출력 – 브릿지 문장',
      content: '예산 3바스켓, C바스켓 최소 비율, 평가위원회 시범사업...',
      type: 'output'
    }
  ]
}

const llmScenario: ScenarioDefinition = {
  id: 'llm',
  label: 'LLM 연결 (프롬프트 실시간 주입)',
  description: '하드코딩 대신 프롬프트 파라미터를 실시간 변경하며 LLM이 만든 샘플 응답을 보여주는 모드입니다.',
  metrics: {
    conflictWithout: 78,
    conflictWithAI: 32,
    consensusWithout: 30,
    consensusWithAI: 74
  },
  bridgeDefaults: ['adopted', 'adopted', 'edited'],
  turns: [
    {
      speaker: '사회자',
      original: '“시간이 없으니 빨리 결론 냅시다.”',
      without: '압박만 강조 → 시민: “제 말은 묻히는 건가요?”',
      withAI: 'LLM이 긴장 완화 멘트 + 핵심 쟁점 3줄 요약을 즉시 제시',
      reactionBefore: '반응(시민): 방어적, 발언 위축',
      reactionAfter: '반응(시민): “핵심이 보이니 의견을 더 보태고 싶어요.”',
      aiTags: ['요약', '톤 조절', '발언 촉진'],
      step: 'Live Safety Loop'
    },
    {
      speaker: '정부 실무자',
      original: '“전략투자 없이는 세수가 줄어듭니다.”',
      without: '성장 프레임만 반복 → 시민: “복지는 또 후순위군요.”',
      withAI: 'LLM이 JSON으로 가치 태깅 {형평, 안정} 후 “선투자+지역환류” 문장 자동 생성',
      reactionBefore: '반응(시민): 논점 불신',
      reactionAfter: '반응(시민): “환류 로드맵 포함이면 동의”',
      aiTags: ['가치 태깅', '조건부 합의', 'JSON 모듈화'],
      step: 'Bridge Proposal'
    },
    {
      speaker: '청년 연구자',
      original: '“청년 몫을 숫자로 명시해야 합니다.”',
      without: '정부: “비율 강제는 어렵습니다.” → 교착',
      withAI: 'LLM이 “시범구간 15%”와 “성과 평가 후 확장” 패키지 제안',
      reactionBefore: '반응(정부): 경직',
      reactionAfter: '반응(정부): “시범구간은 가능, 평가 조건 추가”',
      aiTags: ['수치 제안', '조건부 합의', '성장-형평 균형'],
      step: 'Negotiation Detail'
    }
  ],
  bridgeSentences: [
    'LLM이 감정/가치 태깅 결과를 JSON으로 축약 → 참가자 확인 후 승인',
    '“선투자 후 환류” 시나리오를 표로 제시하고, 지역 몫 N% 시범구간 명시',
    '청년 몫 15% 시범 적용 후 평가/확장 로드맵 합의'
  ],
  logs: [
    {
      label: 'System prompt (LLM 모드)',
      content: 'You are an AI Mediator. Tone=${tone}, Audience=${audience}. Output JSON with sentiment, key_issue, suggestion.',
      type: 'input'
    },
    {
      label: 'User 입력',
      content: '“지역은 또 뒷순위네요. 안전장치가 없어요.”',
      type: 'input'
    },
    {
      label: 'LLM 출력 – JSON 추출',
      content: '{ "sentiment": "concerned", "key_issue": "safety_mechanism", "unresolved_point": "지역 환류 로드맵 부재" }',
      type: 'output'
    },
    {
      label: 'LLM 출력 – 재작성',
      content: '“선투자하되 지역 환류 로드맵과 안전장치 기준을 합의문에 넣겠습니다.”',
      type: 'output'
    }
  ]
}

export const scenarioVariants: Record<ScenarioMode, ScenarioDefinition> = {
  scripted: scriptedScenario,
  llm: llmScenario
}

// 하위 호환용 개별 export (기존 코드 사용 시)
export const turns = scriptedScenario.turns
export const bridgeSentences = scriptedScenario.bridgeSentences
export const mockLogs = scriptedScenario.logs
