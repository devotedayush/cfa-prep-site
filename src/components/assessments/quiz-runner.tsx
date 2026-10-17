'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { BrainCircuit, CheckCircle2, XCircle, Sparkles, RotateCcw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateQuizAction, saveAssessmentAction } from '@/lib/ai/actions'
import type { QuizQuestion } from '@/lib/ai/quiz'
import type { Level, Subject } from '@/lib/curriculum'

type Phase = 'pick' | 'loading' | 'quiz' | 'result'

interface FlatSub {
  id: string
  label: string
  subjectTitle: string
  topicTitle: string
  subtopicTitle: string
}

export function QuizRunner({ level, subjects }: { level: Level; subjects: Subject[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [phase, setPhase] = useState<Phase>('pick')
  const [subtopicId, setSubtopicId] = useState('')
  const [count, setCount] = useState(5)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ scorePct: number; recommended: string } | null>(null)

  const flat = useMemo<FlatSub[]>(
    () =>
      subjects.flatMap((s) =>
        s.topics.flatMap((t) =>
          t.subtopics.map((st) => ({
            id: st.id,
            label: `${s.title} › ${st.title}`,
            subjectTitle: s.title,
            topicTitle: t.title,
            subtopicTitle: st.title,
          })),
        ),
      ),
    [subjects],
  )
  const selected = flat.find((f) => f.id === subtopicId)

  function generate() {
    if (!subtopicId) return
    setError(null)
    setPhase('loading')
    startTransition(async () => {
      const res = await generateQuizAction(subtopicId, count)
      if (!res.ok) {
        setError(res.error)
        setPhase('pick')
        return
      }
      setQuestions(res.questions)
      setAnswers(new Array(res.questions.length).fill(-1))
      setPhase('quiz')
    })
  }

  function submit() {
    if (!selected) return
    startTransition(async () => {
      const res = await saveAssessmentAction({
        level,
        subtopicId,
        subjectTitle: selected.subjectTitle,
        topicTitle: selected.topicTitle,
        subtopicTitle: selected.subtopicTitle,
        questions,
        answers,
      })
      if (res.ok) {
        setResult({ scorePct: res.scorePct, recommended: res.recommended })
        setPhase('result')
        router.refresh()
      } else {
        setError(res.error)
      }
    })
  }

  function reset() {
    setPhase('pick')
    setQuestions([])
    setAnswers([])
    setResult(null)
    setError(null)
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <BrainCircuit className="text-primary" size={20} />
        <h2 className="text-lg font-heading font-semibold">AI topic quiz</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Original, AI-generated practice questions. Scores feed your mastery & revision schedule.
      </p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {phase === 'pick' && (
        <div className="space-y-3">
          <select
            value={subtopicId}
            onChange={(e) => setSubtopicId(e.target.value)}
            aria-label="Subtopic to quiz on"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50"
          >
            <option value="">Choose a subtopic…</option>
            {flat.map((f) => (
              <option key={f.id} value={f.id} className="bg-neutral-900">
                {f.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <label className="text-xs text-white/60">Questions
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="ml-2 rounded-lg bg-black/30 border border-white/10 px-2 py-1.5 text-sm text-white">
                {[3, 5, 8, 10].map((n) => <option key={n} value={n} className="bg-neutral-900">{n}</option>)}
              </select>
            </label>
            <button
              onClick={generate}
              disabled={!subtopicId || pending}
              className="ml-auto flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              <Sparkles size={16} /> Generate quiz
            </button>
          </div>
        </div>
      )}

      {phase === 'loading' && (
        <div className="py-10 text-center text-white/50 text-sm animate-pulse">Generating your questions…</div>
      )}

      {phase === 'quiz' && (
        <div className="space-y-6">
          {questions.map((q, qi) => (
            <div key={qi}>
              <p className="font-medium text-white mb-3">{qi + 1}. {q.prompt}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                    className={cn(
                      'w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors',
                      answers[qi] === oi ? 'border-primary/60 bg-primary/15 text-white' : 'border-white/10 bg-black/20 text-white/70 hover:bg-white/5',
                    )}
                  >
                    {String.fromCharCode(65 + oi)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={submit}
            disabled={pending || answers.some((a) => a < 0)}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {pending ? 'Scoring…' : answers.some((a) => a < 0) ? 'Answer all questions' : 'Submit quiz'}
          </button>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="space-y-6">
          <div className="text-center py-4">
            <p className="text-5xl font-heading font-bold text-gradient">{result.scorePct}%</p>
            <p className="text-sm text-white/60 mt-2">{result.recommended}</p>
          </div>
          <div className="space-y-4">
            {questions.map((q, qi) => {
              const picked = answers[qi]
              const correct = picked === q.correctIndex
              return (
                <div key={qi} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start gap-2">
                    {correct ? <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" /> : <XCircle size={18} className="text-rose-400 mt-0.5 shrink-0" />}
                    <div>
                      <p className="font-medium text-white">{q.prompt}</p>
                      <p className="text-xs text-white/50 mt-1">
                        Correct: <span className="text-emerald-300">{String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}</span>
                        {!correct && picked >= 0 && (
                          <> · You chose <span className="text-rose-300">{String.fromCharCode(65 + picked)}</span></>
                        )}
                      </p>
                      {q.rationale && <p className="text-sm text-white/60 mt-2">{q.rationale}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <button onClick={reset} className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors">
            <RotateCcw size={16} /> New quiz
          </button>
        </div>
      )}
    </div>
  )
}
