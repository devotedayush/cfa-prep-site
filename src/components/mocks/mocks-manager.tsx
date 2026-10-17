'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Plus, Trash2, X } from 'lucide-react'
import { logMock, deleteMock } from '@/lib/data/mocks-actions'
import type { Level } from '@/lib/curriculum'

export interface MockItem {
  id: string
  taken_at: string
  total_score: number
  time_taken_minutes: number
  felt_difficulty: string
  notes: string
}

const inputClass =
  'w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition'

export function MocksManager({ level, mocks }: { level: Level; mocks: MockItem[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const ordered = [...mocks].sort((a, b) => a.taken_at.localeCompare(b.taken_at))
  const count = mocks.length
  const avg = count ? Math.round(mocks.reduce((s, m) => s + m.total_score, 0) / count) : 0
  const best = count ? Math.max(...mocks.map((m) => m.total_score)) : 0
  const chartData = ordered.map((m) => ({ date: m.taken_at.slice(5), score: m.total_score }))

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('level', level)
    startTransition(async () => {
      await logMock(fd)
      formRef.current?.reset()
      setOpen(false)
      router.refresh()
    })
  }

  function remove(id: string) {
    const fd = new FormData()
    fd.set('id', id)
    startTransition(async () => {
      await deleteMock(fd)
      router.refresh()
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Completed mocks', value: String(count) },
          { label: 'Average score', value: `${avg}%` },
          { label: 'Best score', value: `${best}%` },
        ].map((s) => (
          <div key={s.label} className="glass-panel rounded-2xl p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-heading font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"
        >
          {open ? <X size={16} /> : <Plus size={16} />} {open ? 'Cancel' : 'Log mock'}
        </button>
      </div>

      {open && (
        <form ref={formRef} onSubmit={submit} className="glass-panel rounded-2xl p-6 grid gap-3 md:grid-cols-2">
          <label className="text-xs text-white/60">Date
            <input name="taken_at" type="date" required className={inputClass} />
          </label>
          <label className="text-xs text-white/60">Total score (%)
            <input name="total_score" type="number" min={0} max={100} required className={inputClass} />
          </label>
          <label className="text-xs text-white/60">Time taken (min)
            <input name="time_taken_minutes" type="number" min={0} className={inputClass} />
          </label>
          <label className="text-xs text-white/60">Felt difficulty
            <select name="felt_difficulty" defaultValue="steady" className={inputClass}>
              <option value="comfortable">Comfortable</option>
              <option value="steady">Steady</option>
              <option value="tough">Tough</option>
            </select>
          </label>
          <label className="text-xs text-white/60 md:col-span-2">Notes
            <textarea name="notes" rows={2} className={inputClass} placeholder="Time management, weak sections, traps…" />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="md:col-span-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/80 transition-colors disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Save mock'}
          </button>
        </form>
      )}

      {count >= 2 && (
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-heading font-semibold mb-4">Score trend</h2>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="mockScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} width={28} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fill="url(#mockScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {count === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-white/40 text-sm">
          No mocks logged yet. Add full-length practice exams to track pacing and section trends.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl divide-y divide-white/5">
          {[...mocks].sort((a, b) => b.taken_at.localeCompare(a.taken_at)).map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-semibold text-white">{m.total_score}% <span className="text-white/30 font-normal text-sm">· {m.taken_at}</span></p>
                <p className="text-xs text-white/55 mt-0.5">
                  {m.time_taken_minutes ? `${m.time_taken_minutes} min · ` : ''}{m.felt_difficulty}
                  {m.notes ? ` · ${m.notes}` : ''}
                </p>
              </div>
              <button onClick={() => remove(m.id)} aria-label={`Delete mock from ${m.taken_at}`} className="p-1.5 rounded-lg text-white/55 hover:text-rose-400 hover:bg-white/5 transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
