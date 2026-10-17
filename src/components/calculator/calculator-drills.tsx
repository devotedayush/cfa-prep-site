'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { recordDrillAttempt } from '@/lib/data/calculator-actions'
import type { Drill } from '@/lib/calculator/drills'
import type { Level } from '@/lib/curriculum'

export interface DrillStat {
  attempted: number
  correct: number
}

function parseNum(raw: string): number {
  return parseFloat(raw.replace(/[^0-9.\-]/g, ''))
}

export function CalculatorDrills({
  level,
  drills,
  progress,
}: {
  level: Level
  drills: Drill[]
  progress: Record<string, DrillStat>
}) {
  const categories = Array.from(new Set(drills.map((d) => d.category)))
  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <div key={cat} className="glass-panel rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary/80 mb-4">{cat}</h2>
          <div className="space-y-3">
            {drills
              .filter((d) => d.category === cat)
              .map((d) => (
                <DrillRow key={d.id} level={level} drill={d} stat={progress[d.id]} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function DrillRow({ level, drill, stat }: { level: Level; drill: Drill; stat?: DrillStat }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [value, setValue] = useState('')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [showKeys, setShowKeys] = useState(false)

  function check() {
    const num = parseNum(value)
    if (Number.isNaN(num)) return
    const ok =
      Math.abs(num - drill.answer) <= drill.tolerance ||
      Math.abs(Math.abs(num) - Math.abs(drill.answer)) <= drill.tolerance
    setResult(ok ? 'correct' : 'incorrect')
    startTransition(async () => {
      await recordDrillAttempt({ drillId: drill.id, level, answer: value, correct: ok })
      router.refresh()
    })
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-white/90">{drill.prompt}</p>
        {stat && stat.attempted > 0 && (
          <span className="text-[10px] text-white/40 shrink-0">
            {stat.correct}/{stat.attempted} ✓
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <div className="relative">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setResult(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            aria-label={`Your answer for: ${drill.prompt}`}
            placeholder={drill.unit ? `Answer (${drill.unit})` : 'Your answer'}
            className="rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-sm text-white w-32 sm:w-40 outline-none focus:border-primary/50"
          />
        </div>
        <button onClick={check} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors">
          Check
        </button>
        <button
          onClick={() => setShowKeys((s) => !s)}
          aria-expanded={showKeys}
          aria-label={showKeys ? 'Hide keystrokes' : 'Show keystrokes'}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors"
        >
          {showKeys ? <EyeOff size={13} /> : <Eye size={13} />} Keystrokes
        </button>
        {result === 'correct' && (
          <span className="flex items-center gap-1 text-sm text-emerald-400"><Check size={15} /> Correct</span>
        )}
        {result === 'incorrect' && (
          <span className="flex items-center gap-1 text-sm text-rose-400">
            <X size={15} /> Answer: {drill.answer}{drill.unit ?? ''}
          </span>
        )}
      </div>
      {showKeys && (
        <p className={cn('mt-3 rounded-lg bg-white/5 px-3 py-2 text-xs font-mono text-white/60')}>{drill.keystrokes}</p>
      )}
    </div>
  )
}
