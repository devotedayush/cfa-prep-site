'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { createQuestionSet, deleteQuestionSet } from '@/lib/data/admin-actions'

const inputClass =
  'w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition'

export interface SetRow {
  id: string
  title: string
  level: string
  scope: string
  published: boolean
  questionCount: number
}

export function QuestionSetUploader({ sets }: { sets: SetRow[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setOk(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await createQuestionSet(fd)
      if (res.ok) {
        setOk(`Imported ${res.questions} questions.`)
        formRef.current?.reset()
        router.refresh()
      } else {
        setError(res.error)
      }
    })
  }

  function remove(id: string) {
    const fd = new FormData()
    fd.set('id', id)
    startTransition(async () => {
      await deleteQuestionSet(fd)
      router.refresh()
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form ref={formRef} onSubmit={submit} className="glass-panel rounded-2xl p-6 space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold">
          <Upload size={18} className="text-primary" /> Import a question set
        </h2>
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {ok && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <CheckCircle2 size={16} /> {ok}
          </div>
        )}
        <input name="title" required aria-label="Set title" placeholder="Set title (e.g. Ethics — Standard III drill)" className={inputClass} />
        <div className="grid grid-cols-2 gap-3">
          <select name="level" defaultValue="1" aria-label="CFA level" className={inputClass}>
            <option value="1" className="bg-neutral-900">Level I</option>
            <option value="2" className="bg-neutral-900">Level II</option>
            <option value="3" className="bg-neutral-900">Level III</option>
          </select>
          <select name="scope" defaultValue="topic_quiz" aria-label="Question set scope" className={inputClass}>
            <option value="topic_quiz" className="bg-neutral-900">Topic quiz</option>
            <option value="chapter_quiz" className="bg-neutral-900">Chapter quiz</option>
            <option value="full_mock" className="bg-neutral-900">Full mock</option>
          </select>
        </div>
        <input name="subject_title" aria-label="Subject" placeholder="Subject (optional)" className={inputClass} />
        <textarea
          name="raw_text"
          required
          rows={8}
          aria-label="Raw question text to import"
          placeholder="Paste raw questions here. The AI structures them into MCQs (4 options, correct answer, rationale)."
          className={inputClass}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors disabled:opacity-60"
        >
          {pending ? 'Importing…' : 'Parse & import'}
        </button>
      </form>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-heading font-semibold mb-4">Published sets</h2>
        {sets.length === 0 ? (
          <p className="text-sm text-white/40">No question sets yet.</p>
        ) : (
          <div className="space-y-2">
            {sets.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{s.title}</p>
                  <p className="text-xs text-white/40">L{s.level} · {s.scope.replace('_', ' ')} · {s.questionCount} Qs</p>
                </div>
                <button onClick={() => remove(s.id)} aria-label={`Delete question set: ${s.title}`} className="p-1.5 rounded-lg text-white/55 hover:text-rose-400 hover:bg-white/5 transition-colors shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
