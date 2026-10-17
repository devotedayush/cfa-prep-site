import { getSessionContext } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { LEVEL_LABELS } from '@/lib/curriculum'
import { MocksManager, type MockItem } from '@/components/mocks/mocks-manager'

export default async function MocksPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const supabase = await createClient()
  let mocks: MockItem[] = []
  if (supabase) {
    const { data } = await supabase
      .from('study_mocks')
      .select('id, taken_at, total_score, time_taken_minutes, felt_difficulty, notes')
      .eq('user_id', ctx.user.id)
      .eq('level', ctx.activeLevel)
      .order('taken_at', { ascending: false })
    mocks = (data ?? []).map((m) => ({
      id: m.id,
      taken_at: m.taken_at,
      total_score: m.total_score ?? 0,
      time_taken_minutes: m.time_taken_minutes ?? 0,
      felt_difficulty: m.felt_difficulty ?? 'steady',
      notes: m.notes ?? '',
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[ctx.activeLevel]}</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Mocks</h1>
        <p className="text-muted-foreground text-base md:text-lg">Log full-length practice exams and track the trends that matter.</p>
      </div>
      <MocksManager level={ctx.activeLevel} mocks={mocks} />
    </div>
  )
}
