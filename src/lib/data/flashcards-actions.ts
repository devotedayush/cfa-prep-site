'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel } from '@/lib/curriculum'
import { generateFlashcards } from '@/lib/ai/flashcards'

async function userClient() {
  const supabase = await createClient()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  return { supabase, user }
}

export async function createFlashcard(formData: FormData) {
  const ctx = await userClient()
  if (!ctx) return
  const level = String(formData.get('level') ?? '1')
  const prompt = String(formData.get('prompt') ?? '').trim()
  const answer = String(formData.get('answer') ?? '').trim()
  if (!isLevel(level) || !prompt || !answer) return

  await ctx.supabase.from('custom_flashcards').insert({
    user_id: ctx.user.id,
    level,
    subject: String(formData.get('subject') ?? 'Custom'),
    module: String(formData.get('module') ?? 'Custom'),
    title: String(formData.get('title') ?? prompt.slice(0, 80)),
    prompt,
    answer,
    memory_hook: String(formData.get('memory_hook') ?? ''),
  })
  revalidatePath('/flashcards')
}

export async function deleteFlashcard(formData: FormData) {
  const ctx = await userClient()
  if (!ctx) return
  const id = String(formData.get('id') ?? '')
  if (!id) return
  await ctx.supabase.from('custom_flashcards').delete().eq('id', id).eq('user_id', ctx.user.id)
  revalidatePath('/flashcards')
}

export async function setCardProgress(input: {
  cardId: string
  level: string
  known?: boolean
  bookmarked?: boolean
}) {
  const ctx = await userClient()
  if (!ctx || !isLevel(input.level)) return
  const { data: existing } = await ctx.supabase
    .from('flashcard_progress')
    .select('known, bookmarked, review_count')
    .eq('user_id', ctx.user.id)
    .eq('card_id', input.cardId)
    .maybeSingle()

  await ctx.supabase.from('flashcard_progress').upsert(
    {
      user_id: ctx.user.id,
      card_id: input.cardId,
      level: input.level,
      known: input.known ?? existing?.known ?? false,
      bookmarked: input.bookmarked ?? existing?.bookmarked ?? false,
      review_count: (existing?.review_count ?? 0) + 1,
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,card_id' },
  )
  revalidatePath('/flashcards')
}

export type GenerateCardsResult = { ok: true; created: number } | { ok: false; error: string }

export async function generateFlashcardsAction(
  subtopicId: string,
  level: string,
  count = 6,
): Promise<GenerateCardsResult> {
  const ctx = await userClient()
  if (!ctx) return { ok: false, error: 'Not signed in' }
  if (!isLevel(level)) return { ok: false, error: 'Invalid level' }
  try {
    const { subjectTitle, topicTitle, cards } = await generateFlashcards(subtopicId, count)
    const { error } = await ctx.supabase.from('custom_flashcards').insert(
      cards.map((c) => ({
        user_id: ctx.user.id,
        level,
        subject: subjectTitle,
        module: topicTitle,
        title: c.title,
        prompt: c.prompt,
        answer: c.answer,
        memory_hook: c.memoryHook,
      })),
    )
    if (error) return { ok: false, error: error.message }
    revalidatePath('/flashcards')
    return { ok: true, created: cards.length }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Generation failed' }
  }
}
