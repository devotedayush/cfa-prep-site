'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isLevel } from '@/lib/curriculum'

export async function setNoteProgress(input: {
  noteId: string
  level: string
  reviewed?: boolean
  bookmarked?: boolean
}) {
  const supabase = await createClient()
  if (!supabase) return
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isLevel(input.level)) return

  const { data: existing } = await supabase
    .from('revision_note_progress')
    .select('reviewed, bookmarked, review_count')
    .eq('user_id', user.id)
    .eq('note_id', input.noteId)
    .maybeSingle()

  await supabase.from('revision_note_progress').upsert(
    {
      user_id: user.id,
      note_id: input.noteId,
      level: input.level,
      reviewed: input.reviewed ?? existing?.reviewed ?? false,
      bookmarked: input.bookmarked ?? existing?.bookmarked ?? false,
      review_count: (existing?.review_count ?? 0) + (input.reviewed ? 1 : 0),
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,note_id' },
  )
  revalidatePath('/library')
}
