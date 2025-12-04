type LlmRequest = {
  apiKey?: string
  model?: string
  systemPrompt: string
  userInput: string
}

export type LlmResult = {
  content: string
  raw?: unknown
  usedMock?: boolean
}

const DEFAULT_MODEL = 'gpt-5.1'

export async function requestLLM({ apiKey, model = DEFAULT_MODEL, systemPrompt, userInput }: LlmRequest): Promise<LlmResult> {
  const resolvedKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY

  // No key? Return a deterministic mock response so the demo still works.
  if (!resolvedKey) {
    return {
      content: '샘플 출력 (mock): {"sentiment":"concerned","key_issue":"safety_mechanism","suggestion_for_next":"안전장치 기준을 합의문에 포함"}',
      usedMock: true
    }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resolvedKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.3
    })
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown error')
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('OpenAI API returned no content')
  }

  return { content, raw: data }
}
