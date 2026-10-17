'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles, Plus, X, Trash2, Bookmark, Check, ChevronLeft, ChevronRight, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  createFlashcard, deleteFlashcard, setCardProgress, generateFlashcardsAction,
} from '@/lib/data/flashcards-actions'
import type { Level, Subject } from '@/lib/curriculum'

export interface CardItem {
  id: string
  title: string
  prompt: string
  answer: string
  memory_hook: string
  subject: string
  module: string
  known: boolean
  bookmarked: boolean
}

const inputClass =
  'w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition'

export function FlashcardsStudio({
  level,
  cards,
  subjects,
}: {
  level: Level
  cards: CardItem[]
  subjects: Subject[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [subtopicId, setSubtopicId] = useState('')
  const [error, setError] = useState<string | null>(null)

  const flat = useMemo(
    () =>
      subjects.flatMap((s) =>
        s.topics.flatMap((t) => t.subtopics.map((st) => ({ id: st.id, label: `${s.title} › ${st.title}` }))),
      ),
    [subjects],
  )

  const card = cards[idx]

  function go(delta: number) {
    setFlipped(false)
    setIdx((i) => (cards.length ? (i + delta + cards.length) % cards.length : 0))
  }

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn()
      router.refresh()
    })
  }

  function generate() {
    if (!subtopicId) return
    setError(null)
    startTransition(async () => {
      const res = await generateFlashcardsAction(subtopicId, level, 6)
      if (!res.ok) setError(res.error)
      else router.refresh()
    })
  }

  function addCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('level', level)
    const form = e.currentTarget
    startTransition(async () => {
      await createFlashcard(fd)
      form.reset()
      setShowAdd(false)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* AI generate + add */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <Sparkles size={18} className="text-primary" aria-hidden="true" />
        <select aria-label="Subtopic to generate flashcards for" value={subtopicId} onChange={(e) => setSubtopicId(e.target.value)} className="flex-1 min-w-[160px] rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-primary/50">
          <option value="">Generate cards for a subtopic…</option>
          {flat.map((f) => <option key={f.id} value={f.id} className="bg-neutral-900">{f.label}</option>)}
        </select>
        <button onClick={generate} disabled={!subtopicId || pending} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors disabled:opacity-50">
          {pending ? 'Working…' : 'AI generate'}
        </button>
        <button onClick={() => setShowAdd((s) => !s)} className="rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors flex items-center gap-1.5">
          {showAdd ? <X size={15} /> : <Plus size={15} />} Manual
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addCard} className="glass-panel rounded-2xl p-6 space-y-3">
          <input name="title" aria-label="Card title" placeholder="Title (optional)" className={inputClass} />
          <input name="prompt" required aria-label="Card front / question" placeholder="Front / question" className={inputClass} />
          <textarea name="answer" required rows={2} aria-label="Card back / answer" placeholder="Back / answer" className={inputClass} />
          <input name="memory_hook" aria-label="Memory hook" placeholder="Memory hook (optional)" className={inputClass} />
          <button type="submit" disabled={pending} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/80 transition-colors disabled:opacity-60">
            Add card
          </button>
        </form>
      )}

      {/* Study deck */}
      {card ? (
        <div>
          <div
            role="button"
            tabIndex={0}
            aria-label={flipped ? 'Show question' : 'Show answer'}
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setFlipped((f) => !f)
              }
            }}
            className="glass-panel rounded-2xl p-6 sm:p-8 min-h-[220px] flex flex-col items-center justify-center text-center cursor-pointer select-none"
          >
            <span className="text-[10px] uppercase tracking-wider text-primary/70 mb-3">
              {card.subject} · {flipped ? 'Answer' : 'Question'}
            </span>
            <p className="text-lg text-white font-medium">{flipped ? card.answer : card.prompt}</p>
            {flipped && card.memory_hook && (
              <p className="text-sm text-amber-300/80 mt-4">💡 {card.memory_hook}</p>
            )}
            <span className="text-xs text-white/30 mt-6">Click to flip · {idx + 1}/{cards.length}</span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-4">
            <button onClick={() => go(-1)} aria-label="Previous card" className="p-2 rounded-lg hover:bg-white/5 text-white/60"><ChevronLeft size={20} /></button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => run(() => setCardProgress({ cardId: card.id, level, bookmarked: !card.bookmarked }))}
                aria-pressed={card.bookmarked}
                aria-label={card.bookmarked ? 'Remove bookmark' : 'Bookmark card'}
                className={cn('flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors', card.bookmarked ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-white/60 hover:bg-white/10')}
              >
                <Bookmark size={14} fill={card.bookmarked ? 'currentColor' : 'none'} /> Bookmark
              </button>
              <button
                onClick={() => { run(() => setCardProgress({ cardId: card.id, level, known: !card.known })); go(1) }}
                aria-pressed={card.known}
                aria-label={card.known ? 'Mark as not known' : 'Mark as known'}
                className={cn('flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors', card.known ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/60 hover:bg-white/10')}
              >
                <Check size={14} /> {card.known ? 'Known' : 'Mark known'}
              </button>
            </div>
            <button onClick={() => go(1)} aria-label="Next card" className="p-2 rounded-lg hover:bg-white/5 text-white/60"><ChevronRight size={20} /></button>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-10 text-center text-white/40 text-sm">
          No flashcards yet. Generate a set with AI or add your own above.
        </div>
      )}

      {/* List */}
      {cards.length > 0 && (
        <div className="glass-panel rounded-2xl divide-y divide-white/5">
          {cards.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-3">
              <button onClick={() => { setIdx(i); setFlipped(false) }} className="min-w-0 text-left flex items-center gap-2">
                {c.known && <Check size={14} className="text-emerald-400 shrink-0" />}
                {c.bookmarked && <Bookmark size={14} className="text-amber-400 shrink-0" fill="currentColor" />}
                <span className="text-sm text-white/80 truncate">{c.prompt}</span>
              </button>
              <button onClick={() => run(() => { const fd = new FormData(); fd.set('id', c.id); return deleteFlashcard(fd) })} aria-label="Delete flashcard" className="p-1.5 rounded-lg text-white/55 hover:text-rose-400 hover:bg-white/5 transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
