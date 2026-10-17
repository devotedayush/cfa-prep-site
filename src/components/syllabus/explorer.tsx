'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, Layers, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateSubtopicProgress } from '@/lib/data/actions'
import { STATUSES, STATUS_LABELS, statusTone, isCovered, type StudyStatus } from '@/lib/data/status'
import type { Level, Subject } from '@/lib/curriculum'

export interface SubProgress {
  status: string
  self_confidence: number | null
  ai_mastery: number | null
}
export type ProgressLookup = Record<string, SubProgress>

export function SyllabusExplorer({
  level,
  subjects,
  progress,
}: {
  level: Level
  subjects: Subject[]
  progress: ProgressLookup
}) {
  return (
    <div className="space-y-6">
      {subjects.map((subject) => {
        const all = subject.topics.flatMap((t) => t.subtopics)
        const covered = all.filter((s) => isCovered(progress[s.id]?.status)).length
        const pct = all.length ? Math.round((covered / all.length) * 100) : 0
        return (
          <div key={subject.id} className="glass-panel rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-card/80 to-background flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-white mb-1">{subject.title}</h2>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Star size={14} className="text-amber-400" /> Exam weight: {subject.weightMin}–{subject.weightMax}%
                  </span>
                </div>
              </div>
              <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/5 text-sm font-bold text-white">
                {pct}% covered
              </div>
            </div>
            <div className="flex flex-col">
              {subject.topics.map((topic) => (
                <TopicRow key={topic.id} level={level} topic={topic} progress={progress} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TopicRow({
  level,
  topic,
  progress,
}: {
  level: Level
  topic: Subject['topics'][number]
  progress: ProgressLookup
}) {
  const [open, setOpen] = useState(false)
  const done = topic.subtopics.filter((s) => isCovered(progress[s.id]?.status)).length

  return (
    <div className="border-t border-white/5 first:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 px-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-white/40">{open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
          <h3 className="font-medium text-white">{topic.title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {done}/{topic.subtopics.length} done
        </span>
      </button>
      {open && (
        <div className="bg-black/20">
          {topic.subtopics.map((sub) => (
            <SubtopicRow
              key={sub.id}
              level={level}
              id={sub.id}
              title={sub.title}
              progress={progress[sub.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SubtopicRow({
  level,
  id,
  title,
  progress,
}: {
  level: Level
  id: string
  title: string
  progress?: SubProgress
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<string>(progress?.status ?? 'not_started')
  const [confidence, setConfidence] = useState<number | null>(progress?.self_confidence ?? null)

  function submit(next: { status?: string; confidence?: number | null }) {
    const newStatus = next.status ?? status
    const newConf = next.confidence !== undefined ? next.confidence : confidence
    setStatus(newStatus)
    if (next.confidence !== undefined) setConfidence(next.confidence)

    const fd = new FormData()
    fd.set('subtopic_id', id)
    fd.set('level', level)
    fd.set('status', newStatus)
    if (newConf != null) fd.set('self_confidence', String(newConf))
    startTransition(async () => {
      await updateSubtopicProgress(fd)
      router.refresh()
    })
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 py-3 pl-12 pr-6 border-t border-white/5',
        pending && 'opacity-60',
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
        <span className="text-white/90 truncate">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Confidence dots */}
        <div className="flex items-center gap-1" role="group" aria-label={`Self-confidence for ${title}`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => submit({ confidence: n })}
              aria-label={`Set confidence to ${n} of 5`}
              aria-pressed={confidence != null && n <= confidence}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-colors',
                confidence && n <= confidence ? 'bg-primary' : 'bg-white/15 hover:bg-white/30',
              )}
            />
          ))}
        </div>
        <select
          value={status}
          onChange={(e) => submit({ status: e.target.value })}
          aria-label={`Study status for ${title}`}
          className={cn(
            'rounded-lg border px-2 py-1 text-xs font-medium outline-none bg-transparent cursor-pointer',
            statusTone(status),
          )}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-neutral-900 text-white">
              {STATUS_LABELS[s as StudyStatus]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
