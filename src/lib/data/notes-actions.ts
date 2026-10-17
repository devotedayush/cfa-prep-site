'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel } from '@/lib/curriculum'

async function userClient() {
  const supabase = await createClient()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  return { supabase, user }
}

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12)
}

export async function createNote(formData: FormData) {
  const ctx = await userClient()
  if (!ctx) return
  const level = String(formData.get('level') ?? '1')
  const title = String(formData.get('title') ?? '').trim()
  if (!title || !isLevel(level)) return

  await ctx.supabase.from('study_notes').insert({
    user_id: ctx.user.id,
    level,
    title,
    topic: String(formData.get('topic') ?? '').trim(),
    body: String(formData.get('body') ?? ''),
    tags: parseTags(String(formData.get('tags') ?? '')),
  })
  revalidatePath('/notes')
}

export async function deleteNote(formData: FormData) {
  const ctx = await userClient()
  if (!ctx) return
  const id = String(formData.get('id') ?? '')
  if (!id) return
  await ctx.supabase.from('study_notes').delete().eq('id', id).eq('user_id', ctx.user.id)
  revalidatePath('/notes')
}

export async function togglePinNote(formData: FormData) {
  const ctx = await userClient()
  if (!ctx) return
  const id = String(formData.get('id') ?? '')
  const pinned = String(formData.get('pinned') ?? 'false') === 'true'
  if (!id) return
  await ctx.supabase.from('study_notes').update({ pinned: !pinned }).eq('id', id).eq('user_id', ctx.user.id)
  revalidatePath('/notes')
}
