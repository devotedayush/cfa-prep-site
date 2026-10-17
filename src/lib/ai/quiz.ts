import { findSubtopic, type Level } from '@/lib/curriculum'
import { callLLMJson } from './llm'

export interface QuizQuestion {
  prompt: string
  options: string[]
  correctIndex: number
  rationale: string
}

export interface QuizContext {
  level: Level
  subjectTitle: string
  topicTitle: string
  subtopicTitle: string
}

interface RawQuestion {
  prompt?: string
  options?: unknown
  correct_index?: number
  rationale?: string
}

const SYSTEM =
  'You are a rigorous CFA exam item writer. You write ORIGINAL, exam-style ' +
  'multiple-choice questions and never copy CFA Institute curriculum text. ' +
  'Questions are precise, unambiguous, and calibrated to genuine exam difficulty.'

export async function generateQuestions(
  subtopicId: string,
  count = 5,
): Promise<{ context: QuizContext; questions: QuizQuestion[] }> {
  const ref = findSubtopic(subtopicId)
  if (!ref) throw new Error('Unknown subtopic')

  const user = [
    `Generate ${count} original multiple-choice questions for CFA Level ${ref.level}.`,
    `Subject: ${ref.subject.title}. Topic: ${ref.topic.title}. Subtopic: ${ref.subtopic.title}.`,
    'Each question must have exactly 4 options with exactly one correct answer.',
    'Mix conceptual and calculation questions where appropriate. Keep each rationale to 1–3 sentences.',
    'Return JSON of the form:',
    '{"questions":[{"prompt":"...","options":["A","B","C","D"],"correct_index":0,"rationale":"..."}]}',
  ].join('\n')

  const raw = await callLLMJson<{ questions?: RawQuestion[] }>({
    system: SYSTEM,
    user,
    maxTokens: 2800,
    temperature: 0.5,
  })

  const questions: QuizQuestion[] = (raw.questions ?? [])
    .map(normalize)
    .filter((q): q is QuizQuestion => q !== null)
    .slice(0, count)

  if (questions.length === 0) throw new Error('The model returned no valid questions. Try again.')

  return {
    context: {
      level: ref.level,
      subjectTitle: ref.subject.title,
      topicTitle: ref.topic.title,
      subtopicTitle: ref.subtopic.title,
    },
    questions,
  }
}

function normalize(q: RawQuestion): QuizQuestion | null {
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
}

/** AI mastery (0–5) derived from a quiz score percentage. */
export function masteryFromScore(scorePct: number): number {
  return Math.round((scorePct / 100) * 5 * 10) / 10
}

export function recommendedAction(scorePct: number): string {
  if (scorePct >= 85) return 'Strong — schedule a spaced revision and move on.'
  if (scorePct >= 70) return 'Solid. Review the missed items, then revisit in a few days.'
  if (scorePct >= 50) return 'Shaky. Re-study the concept and retake the quiz soon.'
  return 'Weak. Re-learn this subtopic from scratch before reattempting.'
}
