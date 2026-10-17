'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCcw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateSubtopicProgress } from '@/lib/data/actions'
import type { Level } from '@/lib/curriculum'

export interface RevisionItem {
  subtopicId: string
  title: string
  subjectTitle: string
  dueLabel: string
  bucket: 'overdue' | 'today' | 'upcoming'
}

const BUCKETS: { key: RevisionItem['bucket']; label: string; tone: string }[] = [
  { key: 'overdue', label: 'Overdue', tone: 'text-rose-400' },
  { key: 'today', label: 'Due today', tone: 'text-amber-400' },
  { key: 'upcoming', label: 'Upcoming', tone: 'text-cyan-400' },
]

export function RevisionQueue({ level, items }: { level: Level; items: RevisionItem[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function markRevised(subtopicId: string) {
    const fd = new FormData()
    fd.set('subtopic_id', subtopicId)
    fd.set('level', level)
    fd.set('status', 'revised')
    startTransition(async () => {
      await updateSubtopicProgress(fd)
      router.refresh()
    })
  }

  if (items.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center text-white/40 text-sm">
        Nothing scheduled for revision yet. Complete topics in the syllabus or take quizzes to build your queue.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {BUCKETS.map(({ key, label, tone }) => {
        const group = items.filter((i) => i.bucket === key)
        if (group.length === 0) return null
        return (
          <div key={key} className="glass-panel rounded-2xl p-6">
            <h2 className={cn('text-sm font-bold uppercase tracking-wider mb-4', tone)}>
              {label} · {group.length}
            </h2>
            <div className="space-y-2">
              {group.map((item) => (
                <div key={item.subtopicId} className={cn('flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3', pending && 'opacity-60')}>
                  <div className="min-w-0 flex items-center gap-3">
                    <RefreshCcw size={16} className="text-primary/70 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-white/55 truncate">{item.subjectTitle} · {item.dueLabel}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => markRevised(item.subtopicId)}
                    className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors shrink-0"
                  >
                    <CheckCircle2 size={14} /> Mark revised
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
