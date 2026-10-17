'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, Check, ChevronDown, ChevronRight, AlertTriangle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { setNoteProgress } from '@/lib/data/revision-actions'
import type { Level } from '@/lib/curriculum'

export interface LibraryNote {
  id: string
  subject: string
  module: string
  concept: string
  terms: string[]
  formulas: string[]
  trap: string
  quickRecall: string
  reviewed: boolean
  bookmarked: boolean
}

export function RevisionLibrary({ level, notes }: { level: Level; notes: LibraryNote[] }) {
  const subjects = Array.from(new Set(notes.map((n) => n.subject)))
  if (notes.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center text-white/40 text-sm">
        No revision notes for this level yet.
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {subjects.map((subject) => (
        <div key={subject}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary/80 mb-3">{subject}</h2>
          <div className="space-y-3">
            {notes.filter((n) => n.subject === subject).map((n) => (
              <NoteCard key={n.id} level={level} note={n} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function NoteCard({ level, note }: { level: Level; note: LibraryNote }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  function toggle(patch: { reviewed?: boolean; bookmarked?: boolean }) {
    startTransition(async () => {
      await setNoteProgress({ noteId: note.id, level, ...patch })
      router.refresh()
    })
  }

  return (
    <div className={cn('glass-panel rounded-2xl overflow-hidden', note.reviewed && 'border-emerald-500/20')}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={`${open ? 'Collapse' : 'Expand'} note: ${note.concept}`} className="w-full flex items-start justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-white/40 mt-0.5">{open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-white/40">{note.module}</p>
            <p className="text-sm text-white/90 mt-0.5">{note.concept}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {note.bookmarked && <Bookmark size={14} className="text-amber-400" fill="currentColor" />}
          {note.reviewed && <Check size={14} className="text-emerald-400" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {note.terms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.terms.map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/60">{t}</span>
              ))}
            </div>
          )}
          {note.formulas.length > 0 && (
            <div className="space-y-1.5">
              {note.formulas.map((f, i) => (
                <p key={i} className="rounded-lg bg-black/30 px-3 py-2 text-sm font-mono text-cyan-200/90">{f}</p>
              ))}
            </div>
          )}
          {note.trap && (
            <p className="flex items-start gap-2 text-sm text-rose-200/80">
              <AlertTriangle size={15} className="text-rose-400 mt-0.5 shrink-0" /> {note.trap}
            </p>
          )}
          {note.quickRecall && (
            <p className="flex items-start gap-2 text-sm text-amber-200/80">
              <Zap size={15} className="text-amber-400 mt-0.5 shrink-0" /> {note.quickRecall}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => toggle({ reviewed: !note.reviewed })}
              aria-pressed={note.reviewed}
              className={cn('flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors', note.reviewed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/60 hover:bg-white/10')}
            >
              <Check size={14} /> {note.reviewed ? 'Reviewed' : 'Mark reviewed'}
            </button>
            <button
              onClick={() => toggle({ bookmarked: !note.bookmarked })}
              aria-pressed={note.bookmarked}
              aria-label={note.bookmarked ? 'Remove bookmark' : 'Bookmark note'}
              className={cn('flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors', note.bookmarked ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-white/60 hover:bg-white/10')}
            >
              <Bookmark size={14} fill={note.bookmarked ? 'currentColor' : 'none'} /> Bookmark
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
