import { callLLMJson } from './llm'

export interface ParsedQuestion {
  prompt: string
  options: string[]
  correctIndex: number
  rationale: string
}

interface RawQ {
  prompt?: string
  options?: unknown
  correct_index?: number
  rationale?: string
}

const SYSTEM =
  'You convert pasted exam-question text into structured multiple-choice ' +
  'questions. Preserve the original wording faithfully. Each question must have ' +
  'exactly 4 options; if fewer are given, add plausible distractors. Identify the ' +
  'correct answer and write a brief rationale.'

export async function structureQuestions(rawText: string, max = 40): Promise<ParsedQuestion[]> {
  const user = [
    'Convert the following into JSON:',
    '{"questions":[{"prompt":"...","options":["A","B","C","D"],"correct_index":0,"rationale":"..."}]}',
    'Text to convert:',
    rawText.slice(0, 12000),
  ].join('\n')

  const raw = await callLLMJson<{ questions?: RawQ[] }>({
    system: SYSTEM,
    user,
    maxTokens: 4000,
    temperature: 0.2,
  })

  return (raw.questions ?? [])
    .map((q): ParsedQuestion | null => {
      if (!q || typeof q.prompt !== 'string') return null
      const options = Array.isArray(q.options) ? q.options.map(String) : []
      if (options.length !== 4) return null
      const correctIndex = Number(q.correct_index)
      if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) return null
      return {
        prompt: q.prompt.trim(),
        options,
        correctIndex,
        rationale: typeof q.rationale === 'string' ? q.rationale.trim() : '',
      }
    })
    .filter((q): q is ParsedQuestion => q !== null)
    .slice(0, max)
}
