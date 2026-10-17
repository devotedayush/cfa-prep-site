import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { getSessionContext } from '@/lib/auth/session'
import { getProgressRows } from '@/lib/data/progress'
import { findSubtopic, LEVEL_LABELS } from '@/lib/curriculum'
import { RevisionQueue, type RevisionItem } from '@/components/revisions/revision-queue'

export default async function RevisionsPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const { activeLevel } = ctx
  const rows = await getProgressRows(activeLevel)

  const items: RevisionItem[] = rows
    .filter((r) => r.revision_due_at)
    .map((r) => {
      const ref = findSubtopic(r.subtopic_id)
      const due = parseISO(r.revision_due_at as string)
      const diff = differenceInCalendarDays(due, new Date())
      const bucket: RevisionItem['bucket'] = diff < 0 ? 'overdue' : diff === 0 ? 'today' : 'upcoming'
      const dueLabel =
        diff < 0 ? `${Math.abs(diff)}d overdue` : diff === 0 ? 'due today' : `due ${format(due, 'MMM d')}`
      return {
        subtopicId: r.subtopic_id,
        title: ref?.subtopic.title ?? r.subtopic_id,
        subjectTitle: ref?.subject.title ?? '',
        dueLabel,
        bucket,
      }
    })
    .sort((a, b) => {
      const order = { overdue: 0, today: 1, upcoming: 2 }
      return order[a.bucket] - order[b.bucket]
    })

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[activeLevel]}</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Revisions</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Spaced review scheduled from your mastery — weak topics resurface sooner.
        </p>
      </div>
      <RevisionQueue level={activeLevel} items={items} />
    </div>
  )
}
