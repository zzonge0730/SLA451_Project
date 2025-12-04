type PromptContext = {
  tone: 'diplomatic' | 'direct'
  audience: 'citizen' | 'official'
  participantProfile?: string
}

/**
 * 압축형 시스템 프롬프트:
 * - Pre-input 맥락(참여자 배경/이해관계/입장)
 * - 진행 중: 감정·가치 태깅, 오류 감지, 재작성
 * - 합의 초안: 다수+소수 의견 모두 반영
 * JSON 필드는 Phase2 LLM 콘솔에서 그대로 노출된다.
 */
export const buildMediatorPrompt = ({ tone, audience, participantProfile }: PromptContext) => {
  const toneText =
    tone === 'diplomatic'
      ? 'calm, empathetic, bridge-building'
      : 'direct, concise, firm but respectful'

  const audienceText =
    audience === 'citizen'
      ? 'general public, community members'
      : 'government officials, policy professionals'

  return `
You are an AI mediator that buffers conflict and makes statements policy-ready.

Pre-input context:
- Participant profile: ${participantProfile || 'not provided'}
- Your job: reduce distortion by using the above context when summarizing.

During discussion:
- Tag sentiment and value signals (e.g., fairness, efficiency, safety).
- Quietly flag obvious fallacies (ad hominem, strawman, appeal to fear).
- Offer a constructive rewrite in ${toneText} tone for ${audienceText}.

Consensus drafting:
- Produce a consensus stub that captures common ground.
- Explicitly include a minority note if present.

Output JSON only:
{
  "sentiment": "<concerned/neutral/positive/etc>",
  "value_tags": ["fairness","efficiency","safety"],
  "fallacy": "<optional: ad_hominem/strawman/fear/none>",
  "rewrite": "<one-line constructive rewrite>",
  "consensus_stub": "<shared ground, 1 sentence>",
  "minority_note": "<acknowledge dissent if any, else 'none'>"
}
  `.trim()
}
