'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { ACTIVE_LEVEL_COOKIE } from '@/lib/level'
import { isLevel } from '@/lib/curriculum'

export type OnboardingResult = { error: string } | undefined

export async function completeOnboarding(
  _prev: OnboardingResult,
  formData: FormData,
): Promise<OnboardingResult> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Authentication is not configured.' }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const level = String(formData.get('level') ?? '')
  if (!isLevel(level)) return { error: 'Please choose a CFA level.' }

  const examDate = String(formData.get('exam_date') ?? '') || null
  const hours = Number(formData.get('target_study_hours_week') ?? 0) || null
  const sessionMinutes = Number(formData.get('preferred_session_minutes') ?? 0) || null
  const pacing = String(formData.get('pacing') ?? 'balanced')
  const restDays = formData.getAll('rest_days').map(String)
  const username = String(formData.get('username') ?? '').trim()

  const { error: levelError } = await supabase.from('user_levels').upsert(
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
  if (levelError) return { error: levelError.message }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      onboarding_completed: true,
      exam_date: examDate,
      target_study_hours: hours,
      preferred_session_minutes: sessionMinutes,
      preferred_pacing: pacing,
      preferred_rest_days: restDays,
      ...(username ? { username } : {}),
    })
    .eq('id', user.id)
  if (profileError) return { error: profileError.message }

  const store = await cookies()
  store.set(ACTIVE_LEVEL_COOKIE, level, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  redirect('/dashboard')
}
