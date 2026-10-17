import Link from 'next/link'
import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import {
  AlertCircle, BookOpen, CalendarDays, ChevronRight, Clock, Flame, RefreshCcw, Target,
} from 'lucide-react'
import { getSessionContext } from '@/lib/auth/session'
import { getProgressRows, indexProgress } from '@/lib/data/progress'
import { computeLevelMetrics } from '@/lib/data/metrics'
import { buildPlan, type PlanKind } from '@/lib/data/plan'
import { assessSchedule, type ScheduleStatus } from '@/lib/data/schedule'
import { LEVEL_LABELS } from '@/lib/curriculum'

const SCHEDULE_TONE: Record<ScheduleStatus, string> = {
  on_track: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  behind: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  recovery: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  done: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
  no_date: 'border-white/10 bg-white/5 text-white/60',
}

const KIND_META: Record<PlanKind, { label: string; icon: typeof BookOpen; tone: string }> = {
  revision: { label: 'Revision', icon: RefreshCcw, tone: 'text-cyan-400' },
  weak: { label: 'Weak topic', icon: AlertCircle, tone: 'text-rose-400' },
  new: { label: 'New learning', icon: BookOpen, tone: 'text-primary' },
}

export default async function DashboardPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const { activeLevel, profile, levels } = ctx
  const levelRow = levels.find((l) => l.level === activeLevel)
  const examDate = levelRow?.exam_date ?? null
  const daysLeft = examDate ? differenceInCalendarDays(parseISO(examDate), new Date()) : null

  const progress = indexProgress(await getProgressRows(activeLevel))
  const metrics = computeLevelMetrics(activeLevel, progress)
  const plan = buildPlan(activeLevel, progress, 5)
  const riskSubjects = metrics.subjects
    .filter((s) => s.total > 0)
    .sort((a, b) => a.readiness - b.readiness)
    .slice(0, 3)

  const greetingName = profile?.username || 'there'
  const schedule = assessSchedule({
    level: activeLevel,
    coveredCount: metrics.covered,
    daysLeft,
    targetHoursWeek: levelRow?.target_study_hours_week ?? null,
  })

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[activeLevel]}</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">
            Hi {greetingName}, ready to study?
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            {daysLeft != null
              ? daysLeft >= 0
                ? "Here's where you stand and what to do next."
                : 'Your exam date has passed — update it in Settings.'
              : 'Set your exam date in Settings to unlock pacing.'}
          </p>
        </div>

        <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col items-end border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <span className="text-sm font-medium text-white/50 mb-1 flex items-center gap-2 z-10">
            <CalendarDays size={16} /> Days Left
          </span>
          <span className="text-4xl font-heading font-bold text-gradient z-10">
            {daysLeft != null ? Math.max(daysLeft, 0) : '—'}
          </span>
          <span className="text-xs text-white/40 mt-1 z-10">
            {examDate ? format(parseISO(examDate), 'MMMM do, yyyy') : 'No exam date set'}
          </span>
        </div>
      </div>

      {/* Pacing / recovery banner */}
      <div className={`flex items-start gap-3 rounded-2xl border px-5 py-3.5 text-sm ${SCHEDULE_TONE[schedule.status]}`}>
        {schedule.status === 'recovery' ? (
          <Flame size={18} className="mt-0.5 shrink-0" />
        ) : (
          <Target size={18} className="mt-0.5 shrink-0" />
        )}
        <p>{schedule.message}</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl md:col-span-2 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-heading font-semibold flex items-center gap-2 mb-1">
                <Target className="text-primary" size={20} /> Exam Readiness
              </h2>
              <p className="text-sm text-muted-foreground">
                Exam-weight-weighted mastery — not just coverage.
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-heading font-bold text-white">{metrics.readiness}%</p>
              <p className="text-sm text-white/40">{metrics.coveragePct}% covered</p>
            </div>
          </div>
          {/* Subject coverage bars */}
          <div className="space-y-2.5">
            {metrics.subjects.map((s) => (
              <div key={s.subject.id} className="flex items-center gap-3">
                <span className="text-xs text-white/60 w-24 sm:w-36 md:w-44 shrink-0 truncate">{s.subject.title}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
                    style={{ width: `${s.coveragePct}%` }}
                  />
                </div>
                <span className="text-xs text-white/40 w-10 text-right">{s.coveragePct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-orange-400" size={22} />
              <h2 className="text-lg font-heading font-semibold">Next Best Action</h2>
            </div>
            <p className="text-sm text-foreground/60 mb-5">Optimized for your weak spots & deadlines</p>
            {plan[0] ? (
              <div className="bg-primary/15 border border-primary/30 rounded-xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {KIND_META[plan[0].kind].label}
                </span>
                <h3 className="font-semibold text-white mt-1">{plan[0].title}</h3>
                <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                  <Clock size={12} /> ~{plan[0].estMinutes} mins · {plan[0].reason}
                </p>
              </div>
            ) : (
              <p className="text-sm text-white/40">You&apos;re all caught up. 🎉</p>
            )}
          </div>
          <Link
            href="/syllabus"
            className="w-full mt-4 bg-white text-black py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            Open syllabus <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* Plan + risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-heading font-semibold flex items-center gap-2 mb-6">
            <BookOpen className="text-emerald-400" size={20} /> Today&apos;s Plan
          </h2>
          {plan.length === 0 ? (
            <p className="text-sm text-white/40">Nothing queued — start a new topic from the syllabus.</p>
          ) : (
            <div className="space-y-3">
              {plan.map((item) => {
                const Icon = KIND_META[item.kind].icon
                return (
                  <div key={item.subtopicId} className="p-4 rounded-xl border border-white/10 bg-card/40 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Icon size={18} className={KIND_META[item.kind].tone} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-white truncate">{item.title}</h4>
                        <p className="text-xs text-white/40 mt-0.5 truncate">{item.subjectTitle} · {item.reason}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-white/50 shrink-0">~{item.estMinutes}m</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-heading font-semibold flex items-center gap-2 mb-1">
            <AlertCircle className="text-rose-400" size={20} /> Risk Zones
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {metrics.weakCount} weak · {metrics.overdueCount} overdue revisions
          </p>
          <div className="space-y-4">
            {riskSubjects.length === 0 ? (
              <p className="text-sm text-white/40">No risk areas yet — log some progress to see insights.</p>
            ) : (
              riskSubjects.map((s) => (
                <div key={s.subject.id} className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white mb-1">{s.subject.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span>Readiness: <span className="text-rose-300 font-bold">{s.readiness}%</span></span>
                      <span>•</span>
                      <span>Weight: <span className="text-amber-300 font-bold">{s.subject.weightMin}–{s.subject.weightMax}%</span></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
