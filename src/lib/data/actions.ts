'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel } from '@/lib/curriculum'
import { isCovered, type StudyStatus } from '@/lib/data/status'

// Days until a covered topic should resurface, by status. Refined by the
// adaptive engine in a later phase.
const REVISION_DAYS: Record<string, number> = {
  weak: 2,
  completed: 4,
  revised: 9,
  mastered: 16,
}

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export type ProgressResult = { ok: true } | { ok: false; error: string }

export async function updateSubtopicProgress(formData: FormData): Promise<ProgressResult> {
  const supabase = await createClient()
  if (!supabase) return { ok: false, error: 'Not configured' }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }

  const subtopicId = String(formData.get('subtopic_id') ?? '')
  const level = String(formData.get('level') ?? '')
  if (!subtopicId || !isLevel(level)) return { ok: false, error: 'Invalid input' }

  const status = (formData.get('status') as StudyStatus | null) ?? undefined
  const confidenceRaw = formData.get('self_confidence')
  const minutesRaw = formData.get('minutes')
  const selfConfidence = confidenceRaw != null && confidenceRaw !== '' ? Number(confidenceRaw) : undefined
  const minutes = minutesRaw != null && minutesRaw !== '' ? Number(minutesRaw) : 0

  const { data: existing } = await supabase
    .from('study_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('subtopic_id', subtopicId)
    .maybeSingle()

  const nowIso = new Date().toISOString()
  const nextStatus = status ?? (existing?.status as StudyStatus | undefined) ?? 'in_progress'
  const wasCovered = isCovered(existing?.status)
  const nowCovered = isCovered(nextStatus)

  const patch = {
    user_id: user.id,
    subtopic_id: subtopicId,
    level,
    status: nextStatus,
    minutes_spent: (existing?.minutes_spent ?? 0) + (Number.isFinite(minutes) ? minutes : 0),
    self_confidence: selfConfidence ?? existing?.self_confidence ?? null,
    last_studied_at: nowIso,
    first_completed_at: existing?.first_completed_at ?? (nowCovered ? nowIso : null),
    revision_count: (existing?.revision_count ?? 0) + (wasCovered && nextStatus === 'revised' ? 1 : 0),
    revision_due_at: nowCovered ? addDays(REVISION_DAYS[nextStatus] ?? 7) : existing?.revision_due_at ?? null,
  }

  const { error } = await supabase
    .from('study_progress')
    .upsert(patch, { onConflict: 'user_id,subtopic_id' })
  if (error) return { ok: false, error: error.message }

  revalidatePath('/')
  revalidatePath('/syllabus')
  return { ok: true }
}
