// Server-only LLM client. Prefers Anthropic Claude when ANTHROPIC_API_KEY is
// set (recommended), otherwise uses OpenAI. API keys are read from env on the
// server and never sent to the client.

export interface LLMOptions {
  system: string
  user: string
  maxTokens?: number
  temperature?: number
}

export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY)
}

export async function callLLM(opts: LLMOptions): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) return callAnthropic(opts)
  if (process.env.OPENAI_API_KEY) return callOpenAI(opts)
  throw new Error('No LLM API key configured (set ANTHROPIC_API_KEY or OPENAI_API_KEY).')
}

export async function callLLMJson<T>(opts: LLMOptions): Promise<T> {
  return parseJsonLoose<T>(await callLLM(opts))
}

async function callAnthropic({ system, user, maxTokens = 2000, temperature = 0.4 }: LLMOptions): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY as string,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      temperature,
      system: `${system}\nRespond with valid JSON only — no prose, no code fences.`,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data?.content?.[0]?.text ?? ''
}

async function callOpenAI({ system, user, maxTokens = 2000, temperature = 0.4 }: LLMOptions): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY as string}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

function parseJsonLoose<T>(text: string): T {
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try {
    return JSON.parse(cleaned) as T
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1)) as T
    throw new Error('LLM did not return valid JSON.')
  }
}
