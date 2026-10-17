'use client'

import { useActionState, useState } from 'react'
import { AlertCircle, Rocket } from 'lucide-react'
import { completeOnboarding } from './actions'

const inputClass =
  'w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition'

const LEVELS = [
  { value: '1', label: 'Level I', blurb: 'Foundations & tools' },
  { value: '2', label: 'Level II', blurb: 'Valuation & item sets' },
  { value: '3', label: 'Level III', blurb: 'Portfolio management' },
]

const DAYS = [
  ['mon', 'Mon'], ['tue', 'Tue'], ['wed', 'Wed'], ['thu', 'Thu'],
  ['fri', 'Fri'], ['sat', 'Sat'], ['sun', 'Sun'],
] as const

export default function OnboardingPage() {
  const [state, action, pending] = useActionState(completeOnboarding, undefined)
  const [level, setLevel] = useState('1')

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-1">Set up your plan</h1>
      <p className="text-sm text-muted-foreground mb-6">
        This drives your countdown, pacing and daily recommendations. You can change it anytime.
      </p>

      {state?.error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}

      <form action={action} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/60 mb-2">Which level are you preparing for?</label>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <label
                key={l.value}
                className={`cursor-pointer rounded-xl border p-3 text-center transition ${
                  level === l.value
                    ? 'border-primary/60 bg-primary/15'
                    : 'border-white/10 bg-black/20 hover:bg-white/5'
                }`}
              >
                <input type="radio" name="level" value={l.value} checked={level === l.value} onChange={() => setLevel(l.value)} className="sr-only" />
                <span className="block text-sm font-semibold text-white">{l.label}</span>
                <span className="block text-[10px] text-white/40 mt-0.5">{l.blurb}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="exam_date" className="block text-xs font-medium text-white/60 mb-1.5">Exam date</label>
            <input id="exam_date" name="exam_date" type="date" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="pacing" className="block text-xs font-medium text-white/60 mb-1.5">Pacing</label>
            <select id="pacing" name="pacing" defaultValue="balanced" className={inputClass}>
              <option value="relaxed">Relaxed</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="target_study_hours_week" className="block text-xs font-medium text-white/60 mb-1.5">Target hours / week</label>
            <input id="target_study_hours_week" name="target_study_hours_week" type="number" min={1} max={80} defaultValue={12} className={inputClass} />
          </div>
          <div>
            <label htmlFor="preferred_session_minutes" className="block text-xs font-medium text-white/60 mb-1.5">Session length (min)</label>
            <input id="preferred_session_minutes" name="preferred_session_minutes" type="number" min={15} max={240} step={15} defaultValue={60} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/60 mb-2">Rest days (optional)</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(([value, label]) => (
              <label key={value} className="cursor-pointer">
                <input type="checkbox" name="rest_days" value={value} className="peer sr-only" />
                <span className="inline-block rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/60 peer-checked:border-primary/60 peer-checked:bg-primary/15 peer-checked:text-white transition">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Rocket size={18} /> {pending ? 'Setting up…' : 'Start studying'}
        </button>
      </form>
    </div>
  )
}
