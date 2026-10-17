import { UserCog } from 'lucide-react'
import { getSessionContext } from '@/lib/auth/session'
import { updateSettings } from '@/lib/data/settings-actions'
import { LEVEL_LABELS } from '@/lib/curriculum'

const inputClass =
  'w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition'

const DAYS = [
  ['mon', 'Mon'], ['tue', 'Tue'], ['wed', 'Wed'], ['thu', 'Thu'],
  ['fri', 'Fri'], ['sat', 'Sat'], ['sun', 'Sun'],
] as const

export default async function SettingsPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const { activeLevel, profile, levels } = ctx
  const levelRow = levels.find((l) => l.level === activeLevel)
  const restDays = levelRow?.rest_days ?? profile?.preferred_rest_days ?? []
  const restSet = new Set(Array.isArray(restDays) ? restDays.map(String) : [])

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Editing your <span className="text-white font-medium">{LEVEL_LABELS[activeLevel]}</span> plan.
          Switch levels from the sidebar to edit another.
        </p>
      </div>

      <form action={updateSettings} className="glass-panel rounded-2xl p-6 space-y-5">
        <input type="hidden" name="level" value={activeLevel} />

        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold">
          <UserCog className="text-primary" size={18} /> Study profile
        </h2>

        <label className="block text-xs text-white/60">Display name
          <input name="username" defaultValue={profile?.username ?? ''} className={inputClass} placeholder="Your name" />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-xs text-white/60">Exam date
            <input name="exam_date" type="date" defaultValue={levelRow?.exam_date ?? ''} className={inputClass} />
          </label>
          <label className="block text-xs text-white/60">Pacing
            <select name="pacing" defaultValue={levelRow?.pacing ?? 'balanced'} className={inputClass}>
              <option value="relaxed">Relaxed</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </label>
          <label className="block text-xs text-white/60">Target hours / week
            <input name="target_study_hours_week" type="number" min={1} max={80} defaultValue={levelRow?.target_study_hours_week ?? 12} className={inputClass} />
          </label>
          <label className="block text-xs text-white/60">Session length (min)
            <input name="preferred_session_minutes" type="number" min={15} max={240} step={15} defaultValue={levelRow?.preferred_session_minutes ?? 60} className={inputClass} />
          </label>
        </div>

        <div>
          <p className="text-xs text-white/60 mb-2">Rest days</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(([value, label]) => (
              <label key={value} className="cursor-pointer">
                <input type="checkbox" name="rest_days" value={value} defaultChecked={restSet.has(value)} className="peer sr-only" />
                <span className="inline-block rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/60 peer-checked:border-primary/60 peer-checked:bg-primary/15 peer-checked:text-white transition">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors">
          Save changes
        </button>
      </form>
    </div>
  )
}
