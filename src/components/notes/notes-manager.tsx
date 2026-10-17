'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pin, PinOff, Trash2, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createNote, deleteNote, togglePinNote } from '@/lib/data/notes-actions'
import type { Level } from '@/lib/curriculum'

export interface NoteItem {
  id: string
  title: string
  topic: string
  body: string
  tags: string[]
  pinned: boolean
}

const inputClass =
  'w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition'

export function NotesManager({ level, notes }: { level: Level; notes: NoteItem[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function submitCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('level', level)
    startTransition(async () => {
      await createNote(fd)
      formRef.current?.reset()
      setOpen(false)
      router.refresh()
    })
  }

  function runAction(fn: (fd: FormData) => Promise<void>, fd: FormData) {
    startTransition(async () => {
      await fn(fd)
      router.refresh()
    })
  }

  const sorted = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned))

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"
        >
          {open ? <X size={16} /> : <Plus size={16} />} {open ? 'Cancel' : 'New note'}
        </button>
      </div>

      {open && (
        <form ref={formRef} onSubmit={submitCreate} className="glass-panel rounded-2xl p-6 space-y-3">
          <input name="title" required aria-label="Note title" placeholder="Title (e.g. Duration vs Convexity)" className={inputClass} />
          <input name="topic" aria-label="Topic or tag area" placeholder="Topic / tag area (optional)" className={inputClass} />
          <textarea name="body" rows={4} aria-label="Note body" placeholder="Definition first, then the formula or rule. Add a memory hook." className={inputClass} />
          <input name="tags" aria-label="Tags" placeholder="Comma-separated tags (optional)" className={inputClass} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/80 transition-colors disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Save note'}
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-white/40 text-sm">
          No notes yet for this level. Create compact, exam-friendly summaries you can scan in under a minute.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((note) => (
            <div
              key={note.id}
              className={cn(
                'glass-panel rounded-2xl p-5 flex flex-col',
                note.pinned && 'border-primary/30',
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-white">{note.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    title={note.pinned ? 'Unpin' : 'Pin'}
                    aria-label={note.pinned ? `Unpin note: ${note.title}` : `Pin note: ${note.title}`}
                    onClick={() => {
                      const fd = new FormData()
                      fd.set('id', note.id)
                      fd.set('pinned', String(note.pinned))
                      runAction(togglePinNote, fd)
                    }}
                    className="p-1.5 rounded-lg text-white/55 hover:text-primary hover:bg-white/5 transition-colors"
                  >
                    {note.pinned ? <Pin size={14} fill="currentColor" /> : <PinOff size={14} />}
                  </button>
                  <button
                    title="Delete"
                    aria-label={`Delete note: ${note.title}`}
                    onClick={() => {
                      const fd = new FormData()
                      fd.set('id', note.id)
                      runAction(deleteNote, fd)
                    }}
                    className="p-1.5 rounded-lg text-white/55 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {note.topic && <p className="text-[11px] uppercase tracking-wider text-primary/70 mb-2">{note.topic}</p>}
              {note.body && <p className="text-sm text-white/60 whitespace-pre-wrap line-clamp-6">{note.body}</p>}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {note.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
