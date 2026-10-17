import { getSessionContext } from '@/lib/auth/session'
import { getProgressRows } from '@/lib/data/progress'
import { getSubjects, countSubtopics, LEVEL_LABELS } from '@/lib/curriculum'
import { SyllabusExplorer, type ProgressLookup } from '@/components/syllabus/explorer'
import { isCovered } from '@/lib/data/status'

export default async function SyllabusPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const { activeLevel } = ctx
  const subjects = getSubjects(activeLevel)
  const rows = await getProgressRows(activeLevel)

  const progress: ProgressLookup = {}
  for (const r of rows) {
    progress[r.subtopic_id] = {
      status: r.status,
      self_confidence: r.self_confidence,
      ai_mastery: r.ai_mastery,
    }
  }

  const total = countSubtopics(activeLevel)
  const covered = rows.filter((r) => isCovered(r.status)).length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[activeLevel]}</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Syllabus Explorer</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Track coverage, set your confidence, and pinpoint weak areas.
          </p>
        </div>
        <div className="glass-panel px-5 py-3 rounded-2xl text-right">
          <p className="text-2xl font-heading font-bold text-white">
            {covered}<span className="text-white/30">/{total}</span>
          </p>
          <p className="text-xs text-white/40">subtopics covered</p>
        </div>
      </div>

      <SyllabusExplorer level={activeLevel} subjects={subjects} progress={progress} />
    </div>
  )
}
