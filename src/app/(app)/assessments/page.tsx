import { format, parseISO } from 'date-fns'
import { AlertTriangle } from 'lucide-react'
import { getSessionContext } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { getSubjects, findSubtopic, LEVEL_LABELS } from '@/lib/curriculum'
import { aiConfigured } from '@/lib/ai/llm'
import { QuizRunner } from '@/components/assessments/quiz-runner'

export default async function AssessmentsPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const { activeLevel } = ctx
  const supabase = await createClient()
  const recent = supabase
    ? (
        await supabase
          .from('study_assessments')
          .select('id, subtopic_id, score_percentage, ai_mastery, created_at')
          .eq('user_id', ctx.user.id)
          .eq('level', activeLevel)
          .order('created_at', { ascending: false })
          .limit(8)
      ).data ?? []
    : []

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[activeLevel]}</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Assessments</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          AI-generated topic quizzes that estimate your mastery and drive revisions.
        </p>
      </div>

      {!aiConfigured() && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle size={16} /> AI is not configured — set <code>OPENAI_API_KEY</code> or <code>ANTHROPIC_API_KEY</code> to generate quizzes.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <QuizRunner level={activeLevel} subjects={getSubjects(activeLevel)} />

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-heading font-semibold mb-4">Recent results</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-white/40">No quizzes yet — generate your first on the left.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((a) => {
                const title = findSubtopic(a.subtopic_id)?.subtopic.title ?? a.subtopic_id
                const score = a.score_percentage ?? 0
                return (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{title}</p>
                      <p className="text-xs text-white/40">{a.created_at ? format(parseISO(a.created_at), 'MMM d, HH:mm') : ''}</p>
                    </div>
                    <span className={`text-lg font-heading font-bold ${score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {score}%
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
