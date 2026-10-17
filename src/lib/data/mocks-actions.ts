'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel } from '@/lib/curriculum'

export async function logMock(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const level = String(formData.get('level') ?? '1')
  if (!isLevel(level)) return

  await supabase.from('study_mocks').insert({
    user_id: user.id,
    level,
    taken_at: String(formData.get('taken_at') ?? '') || new Date().toISOString().slice(0, 10),
    total_score: Number(formData.get('total_score') ?? 0),
    time_taken_minutes: Number(formData.get('time_taken_minutes') ?? 0),
    felt_difficulty: String(formData.get('felt_difficulty') ?? 'steady'),
    notes: String(formData.get('notes') ?? ''),
  })
  revalidatePath('/mocks')
  revalidatePath('/')
}

export async function deleteMock(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  const id = String(formData.get('id') ?? '')
  if (!id) return
  await supabase.from('study_mocks').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/mocks')
}
