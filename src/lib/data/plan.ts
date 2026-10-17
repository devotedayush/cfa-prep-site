import { getAllSubtopics, subjectWeightMid, type Level } from '@/lib/curriculum'
import { isCovered } from './status'
import type { ProgressRow } from './progress'

export type PlanKind = 'revision' | 'weak' | 'new'

export interface PlanItem {
  subtopicId: string
  title: string
  topicTitle: string
  subjectTitle: string
  reason: string
  kind: PlanKind
  estMinutes: number
}

/**
 * v1 "what should I study now" engine. Priority order: overdue revisions >
 * weak topics > not-started, with exam weight as the tiebreaker. The Phase-4
 * adaptive engine extends this with mastery, neglect, recency and recovery
 * mode.
 */
export function buildPlan(
  level: Level,
  progress: Map<string, ProgressRow>,
  limit = 5,
): PlanItem[] {
  const now = Date.now()
  const scored: Array<PlanItem & { score: number }> = []

  for (const ref of getAllSubtopics(level)) {
    const row = progress.get(ref.subtopic.id)
    const weightMid = subjectWeightMid(ref.subject)
    const est = ref.topic.estMinutes
      ? Math.max(15, Math.round(ref.topic.estMinutes / Math.max(1, ref.topic.subtopics.length)))
      : 25
    const base = {
      subtopicId: ref.subtopic.id,
      title: ref.subtopic.title,
      topicTitle: ref.topic.title,
      subjectTitle: ref.subject.title,
      estMinutes: est,
    }

    if (row?.revision_due_at && new Date(row.revision_due_at).getTime() < now) {
      scored.push({ ...base, kind: 'revision', reason: 'Revision overdue', score: 1000 + weightMid })
    } else if (row?.status === 'weak') {
      scored.push({ ...base, kind: 'weak', reason: 'Flagged as weak', score: 800 + weightMid })
    } else if (!isCovered(row?.status) && row?.status !== 'in_progress') {
      scored.push({
        ...base,
        kind: 'new',
        reason: `High exam weight (${ref.subject.weightMin}–${ref.subject.weightMax}%)`,
        score: weightMid,
      })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => ({
    subtopicId: s.subtopicId,
    title: s.title,
    topicTitle: s.topicTitle,
    subjectTitle: s.subjectTitle,
    reason: s.reason,
    kind: s.kind,
    estMinutes: s.estMinutes,
  }))
}
