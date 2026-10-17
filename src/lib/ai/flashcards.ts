import { findSubtopic } from '@/lib/curriculum'
import { callLLMJson } from './llm'

export interface GeneratedCard {
  title: string
  prompt: string
  answer: string
  memoryHook: string
}

interface RawCard {
  title?: string
  prompt?: string
  answer?: string
  memory_hook?: string
}

const SYSTEM =
  'You write concise, original CFA study flashcards. Never copy CFA Institute ' +
  'curriculum text. Each card has a crisp prompt and an exam-precise answer.'

export async function generateFlashcards(
  subtopicId: string,
  count = 6,
): Promise<{ subjectTitle: string; topicTitle: string; cards: GeneratedCard[] }> {
  const ref = findSubtopic(subtopicId)
  if (!ref) throw new Error('Unknown subtopic')

  const user = [
    `Create ${count} original flashcards for CFA Level ${ref.level}.`,
    `Subject: ${ref.subject.title}. Topic: ${ref.topic.title}. Subtopic: ${ref.subtopic.title}.`,
    'Favor definitions, formulas, and common traps. Keep each answer to 1–3 sentences.',
    'Return JSON: {"cards":[{"title":"...","prompt":"...","answer":"...","memory_hook":"..."}]}',
  ].join('\n')

  const raw = await callLLMJson<{ cards?: RawCard[] }>({
    system: SYSTEM,
    user,
    maxTokens: 2000,
    temperature: 0.5,
  })

  const cards: GeneratedCard[] = (raw.cards ?? [])
    .filter((c): c is RawCard => Boolean(c && c.prompt && c.answer))
    .map((c) => ({
      title: String(c.title ?? ref.subtopic.title).slice(0, 120),
      prompt: String(c.prompt).trim(),
      answer: String(c.answer).trim(),
      memoryHook: String(c.memory_hook ?? '').trim(),
    }))
    .slice(0, count)

  if (cards.length === 0) throw new Error('No valid flashcards returned. Try again.')
  return { subjectTitle: ref.subject.title, topicTitle: ref.topic.title, cards }
}
