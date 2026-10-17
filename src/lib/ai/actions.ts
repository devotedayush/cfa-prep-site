'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel, type Level } from '@/lib/curriculum'
import { generateQuestions, masteryFromScore, recommendedAction, type QuizQuestion } from './quiz'

export type GenerateResult =
  | { ok: true; questions: QuizQuestion[] }
  | { ok: false; error: string }

export async function generateQuizAction(subtopicId: string, count = 5): Promise<GenerateResult> {
  const supabase = await createClient()
  if (!supabase) return { ok: false, error: 'Not configured' }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }

  try {
    const { questions } = await generateQuestions(subtopicId, Math.min(Math.max(count, 1), 10))
    return { ok: true, questions }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Generation failed' }
  }
}

export interface SaveAssessmentInput {
  level: Level
  subtopicId: string
  subjectTitle: string
  topicTitle: string
  subtopicTitle: string
  questions: QuizQuestion[]
  answers: number[] // selected index per question (-1 if skipped)
}

export type SaveResult =
  | { ok: true; scorePct: number; mastery: number; recommended: string }
  | { ok: false; error: string }

function statusFor(score: number): { status: string; reviewDays: number } {
  if (score >= 85) return { status: 'mastered', reviewDays: 16 }
  if (score >= 60) return { status: 'completed', reviewDays: 6 }
  return { status: 'weak', reviewDays: 2 }
}

export async function saveAssessmentAction(input: SaveAssessmentInput): Promise<SaveResult> {
  const supabase = await createClient()
  if (!supabase) return { ok: false, error: 'Not configured' }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }
  if (!isLevel(input.level) || input.questions.length === 0) return { ok: false, error: 'Invalid input' }

  const total = input.questions.length
  const correct = input.questions.reduce(
    (n, q, i) => n + (input.answers[i] === q.correctIndex ? 1 : 0),
    0,
  )
  const scorePct = Math.round((correct / total) * 100)
  const mastery = masteryFromScore(scorePct)
  const recommended = recommendedAction(scorePct)
  const nowIso = new Date().toISOString()

  await supabase.from('study_assessments').insert({
    user_id: user.id,
    level: input.level,
    subtopic_id: input.subtopicId,
    mode: 'topic_quiz',
    score_percentage: scorePct,
    ai_mastery: mastery,
    question_count: total,
    error_categories: [],
    explanation_summary: `${correct}/${total} correct on ${input.subtopicTitle}.`,
    recommended_action: recommended,
  })

  await supabase.from('study_question_attempts').insert(
    input.questions.map((q, i) => ({
      user_id: user.id,
      level: input.level,
      subtopic_id: input.subtopicId,
      topic: input.topicTitle,
      subtopic: input.subtopicTitle,
      prompt: q.prompt,
      options: q.options,
      correct_index: q.correctIndex,
      rationale: q.rationale,
      selected_index: input.answers[i] ?? -1,
      answered_correctly: input.answers[i] === q.correctIndex,
      source: 'generated',
      scope: 'topic_quiz',
    })),
  )

  const { status, reviewDays } = statusFor(scorePct)
  const reviewDue = new Date()
  reviewDue.setDate(reviewDue.getDate() + reviewDays)

  const { data: existing } = await supabase
    .from('study_progress')
    .select('first_completed_at')
    .eq('user_id', user.id)
    .eq('subtopic_id', input.subtopicId)
    .maybeSingle()

  await supabase.from('study_progress').upsert(
    {
      user_id: user.id,
      subtopic_id: input.subtopicId,
      level: input.level,
      status,
      ai_mastery: mastery,
      last_studied_at: nowIso,
      first_completed_at: existing?.first_completed_at ?? nowIso,
      revision_due_at: reviewDue.toISOString(),
    },
    { onConflict: 'user_id,subtopic_id' },
  )

  revalidatePath('/assessments')
  revalidatePath('/')
  revalidatePath('/syllabus')
  return { ok: true, scorePct, mastery, recommended }
}
