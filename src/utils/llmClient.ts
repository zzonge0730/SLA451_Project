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
const MOCK_RESULT: LlmResult = {
  content: '샘플 출력 (mock): {"sentiment":"concerned","key_issue":"safety_mechanism","suggestion_for_next":"안전장치 기준을 합의문에 포함"}',
  usedMock: true
}

export async function requestLLM({ apiKey, model = DEFAULT_MODEL, systemPrompt, userInput }: LlmRequest): Promise<LlmResult> {
  const body: Record<string, unknown> = { model, systemPrompt, userInput }
  if (apiKey) {
    body.apiKey = apiKey
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const text = await response.text().catch(() => '')

    if (response.status === 404) {
      return { ...MOCK_RESULT }
    }

    if (!response.ok) {
      if (response.status === 500 && text.includes('Missing OPENAI_API_KEY')) {
        return { ...MOCK_RESULT }
      }
      throw new Error(`LLM API error: ${response.status} ${text || 'unknown error'}`)
    }

    const data = text ? (JSON.parse(text) as { content?: string }) : {}
    if (!data.content) {
      throw new Error('LLM API returned no content')
    }

    return { content: data.content, raw: data }
  } catch (error) {
    if (error instanceof TypeError) {
      // Network or local dev without API route; keep demo usable.
      return { ...MOCK_RESULT }
    }
    throw error
  }
}
