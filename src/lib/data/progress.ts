import { createClient } from '@/lib/supabase/server'
import type { Level } from '@/lib/curriculum'
import type { Tables } from '@/lib/types/database'

export type ProgressRow = Tables<'study_progress'>

/** All study_progress rows for the current user at a given level. */
export async function getProgressRows(level: Level): Promise<ProgressRow[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('study_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('level', level)
  return data ?? []
}

export function indexProgress(rows: ProgressRow[]): Map<string, ProgressRow> {
  const map = new Map<string, ProgressRow>()
  for (const row of rows) map.set(row.subtopic_id, row)
  return map
}
