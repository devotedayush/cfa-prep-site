import { getSessionContext } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { LEVEL_LABELS } from '@/lib/curriculum'
import { NotesManager, type NoteItem } from '@/components/notes/notes-manager'

export default async function NotesPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const supabase = await createClient()
  let notes: NoteItem[] = []
  if (supabase) {
    const { data } = await supabase
      .from('study_notes')
      .select('id, title, topic, body, tags, pinned')
      .eq('user_id', ctx.user.id)
      .eq('level', ctx.activeLevel)
      .order('updated_at', { ascending: false })
    notes = (data ?? []).map((n) => ({
      id: n.id,
      title: n.title,
      topic: n.topic ?? '',
      body: n.body ?? '',
      tags: n.tags ?? [],
      pinned: n.pinned ?? false,
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[ctx.activeLevel]}</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Notes</h1>
        <p className="text-muted-foreground text-base md:text-lg">Compact, exam-friendly summaries for quick review.</p>
      </div>
      <NotesManager level={ctx.activeLevel} notes={notes} />
    </div>
  )
}
