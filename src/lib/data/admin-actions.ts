'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel } from '@/lib/curriculum'
import { structureQuestions } from '@/lib/ai/parse-questions'

async function adminClient() {
  const supabase = await createClient()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profile?.is_admin) return null
  return { supabase, user }
}

export type CreateSetResult = { ok: true; questions: number } | { ok: false; error: string }

export async function createQuestionSet(formData: FormData): Promise<CreateSetResult> {
  const ctx = await adminClient()
  if (!ctx) return { ok: false, error: 'Admins only.' }

  const level = String(formData.get('level') ?? '1')
  const title = String(formData.get('title') ?? '').trim()
  const scope = String(formData.get('scope') ?? 'topic_quiz')
  const rawText = String(formData.get('raw_text') ?? '').trim()
  if (!isLevel(level) || !title || !rawText) return { ok: false, error: 'Title, level and question text are required.' }

  let parsed
  try {
    parsed = await structureQuestions(rawText)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Parsing failed' }
  }
  if (parsed.length === 0) return { ok: false, error: 'No valid questions could be parsed from that text.' }

  const { data: set, error: setError } = await ctx.supabase
    .from('assessment_sets')
    .insert({
      created_by: ctx.user.id,
      source: 'admin_upload',
      scope,
      level,
      title,
      subject_title: String(formData.get('subject_title') ?? '') || null,
      topic_title: String(formData.get('topic_title') ?? '') || null,
      subtopic_title: String(formData.get('subtopic_title') ?? '') || null,
      raw_text: rawText,
      published: true,
    })
    .select('id')
    .single()
  if (setError || !set) return { ok: false, error: setError?.message ?? 'Failed to create set' }

  const { error: qError } = await ctx.supabase.from('assessment_questions').insert(
    parsed.map((q, i) => ({
      set_id: set.id,
      ordinal: i,
      prompt: q.prompt,
      options: q.options,
      correct_index: q.correctIndex,
      rationale: q.rationale,
    })),
  )
  if (qError) return { ok: false, error: qError.message }

  revalidatePath('/admin')
  return { ok: true, questions: parsed.length }
}

export async function deleteQuestionSet(formData: FormData) {
  const ctx = await adminClient()
  if (!ctx) return
  const id = String(formData.get('id') ?? '')
  if (!id) return
  await ctx.supabase.from('assessment_sets').delete().eq('id', id)
  revalidatePath('/admin')
}
