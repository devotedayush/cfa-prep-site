'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel } from '@/lib/curriculum'

export async function recordDrillAttempt(input: {
  drillId: string
  level: string
  answer: string
  correct: boolean
}) {
  const supabase = await createClient()
  if (!supabase) return
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isLevel(input.level)) return

  const { data: existing } = await supabase
    .from('calculator_drill_progress')
    .select('attempted_count, correct_count')
    .eq('user_id', user.id)
    .eq('drill_id', input.drillId)
    .maybeSingle()

  await supabase.from('calculator_drill_progress').upsert(
    {
      user_id: user.id,
      drill_id: input.drillId,
      level: input.level,
      attempted_count: (existing?.attempted_count ?? 0) + 1,
      correct_count: (existing?.correct_count ?? 0) + (input.correct ? 1 : 0),
      last_answer: input.answer,
      last_attempted_at: new Date().toISOString(),
      status: input.correct ? 'correct' : 'attempted',
    },
    { onConflict: 'user_id,drill_id' },
  )
  revalidatePath('/calculator')
}
