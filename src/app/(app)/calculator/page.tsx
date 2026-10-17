import { getSessionContext } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { LEVEL_LABELS } from '@/lib/curriculum'
import { drillsForLevel } from '@/lib/calculator/drills'
import { CalculatorDrills, type DrillStat } from '@/components/calculator/calculator-drills'

export default async function CalculatorPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const { activeLevel } = ctx
  const drills = drillsForLevel(activeLevel)

  const supabase = await createClient()
  const progress: Record<string, DrillStat> = {}
  if (supabase) {
    const { data } = await supabase
      .from('calculator_drill_progress')
      .select('drill_id, attempted_count, correct_count')
      .eq('user_id', ctx.user.id)
    for (const row of data ?? []) {
      progress[row.drill_id] = { attempted: row.attempted_count ?? 0, correct: row.correct_count ?? 0 }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[activeLevel]}</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Calculator Drills</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Build BA II Plus speed and accuracy. Enter your answer; reveal the keystrokes if you&apos;re stuck.
        </p>
      </div>
      {drills.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-white/40 text-sm">
          No drills for this level yet.
        </div>
      ) : (
        <CalculatorDrills level={activeLevel} drills={drills} progress={progress} />
      )}
    </div>
  )
}
