import { getSessionContext } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { LEVEL_LABELS } from '@/lib/curriculum'
import { RevisionLibrary, type LibraryNote } from '@/components/revision/library'

function toStringArray(json: unknown): string[] {
  if (!Array.isArray(json)) return []
  return json.map((v) => (typeof v === 'string' ? v : JSON.stringify(v)))
}

export default async function LibraryPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const { activeLevel } = ctx
  const supabase = await createClient()
  let notes: LibraryNote[] = []

  if (supabase) {
    const [{ data: rows }, { data: prog }] = await Promise.all([
      supabase
        .from('revision_library_notes')
        .select('id, subject, module, concept, terms, formulas, trap, quick_recall')
        .eq('level', activeLevel)
        .order('sort_order'),
      supabase
        .from('revision_note_progress')
        .select('note_id, reviewed, bookmarked')
        .eq('user_id', ctx.user.id)
        .eq('level', activeLevel),
    ])

    const progressMap = new Map((prog ?? []).map((p) => [p.note_id, p]))
    notes = (rows ?? []).map((r) => ({
      id: r.id,
      subject: r.subject,
      module: r.module,
      concept: r.concept,
      terms: toStringArray(r.terms),
      formulas: toStringArray(r.formulas),
      trap: r.trap ?? '',
      quickRecall: r.quick_recall ?? '',
      reviewed: progressMap.get(r.id)?.reviewed ?? false,
      bookmarked: progressMap.get(r.id)?.bookmarked ?? false,
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[activeLevel]}</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Revision Library</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          High-yield concepts, formulas and exam traps. Expand a card, then mark it reviewed.
        </p>
      </div>
      <RevisionLibrary level={activeLevel} notes={notes} />
    </div>
  )
}
