'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel } from '@/lib/curriculum'

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const level = String(formData.get('level') ?? '1')
  if (!isLevel(level)) return

  const username = String(formData.get('username') ?? '').trim()
  const examDate = String(formData.get('exam_date') ?? '') || null
  const hours = Number(formData.get('target_study_hours_week') ?? 0) || null
  const sessionMinutes = Number(formData.get('preferred_session_minutes') ?? 0) || null
  const pacing = String(formData.get('pacing') ?? 'balanced')
  const restDays = formData.getAll('rest_days').map(String)

  await supabase
    .from('user_levels')
    .upsert(
      {
        user_id: user.id,
        level,
        exam_date: examDate,
        target_study_hours_week: hours,
        preferred_session_minutes: sessionMinutes,
        pacing,
        rest_days: restDays,
        is_active: true,
      },
      { onConflict: 'user_id,level' },
    )

  await supabase
    .from('profiles')
    .update({
      ...(username ? { username } : {}),
      exam_date: examDate,
      target_study_hours: hours,
      preferred_session_minutes: sessionMinutes,
      preferred_pacing: pacing,
      preferred_rest_days: restDays,
    })
    .eq('id', user.id)

  revalidatePath('/settings')
  revalidatePath('/')
}
