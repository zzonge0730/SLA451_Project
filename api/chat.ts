export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = (req.body?.apiKey as string | undefined) || process.env.OPENAI_API_KEY
  const model = (req.body?.model as string | undefined) || 'gpt-5.1'
  const systemPrompt = req.body?.systemPrompt as string | undefined
  const userInput = req.body?.userInput as string | undefined

  if (!systemPrompt || !userInput) {
    return res.status(400).json({ error: 'Missing systemPrompt or userInput' })
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
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

    const text = await response.text()
    if (!response.ok) {
      return res.status(response.status).json({ error: text || 'OpenAI request failed' })
    }

    const data = text ? JSON.parse(text) : {}
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      return res.status(500).json({ error: 'OpenAI API returned no content' })
    }

    return res.status(200).json({ content })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error'
    return res.status(500).json({ error: message })
  }
}
