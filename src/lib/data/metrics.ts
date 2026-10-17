import { getSubjects, subjectWeightMid, type Level, type Subject } from '@/lib/curriculum'
import { isCovered } from './status'
import type { ProgressRow } from './progress'

export interface SubjectMetric {
  subject: Subject
  total: number
  covered: number
  coveragePct: number
  avgMastery: number | null // 0..5
  readiness: number // 0..100
}

export interface LevelMetrics {
  total: number
  covered: number
  coveragePct: number
  readiness: number // 0..100, exam-weight-weighted
  weakCount: number
  overdueCount: number
  subjects: SubjectMetric[]
}

/** Best available mastery signal: AI mastery if present, else self-confidence. */
function masteryOf(row?: ProgressRow): number | null {
  if (!row) return null
  if (row.ai_mastery != null) return row.ai_mastery
  if (row.self_confidence != null) return row.self_confidence
  return null
}

/**
 * Readiness ≠ coverage. Coverage = "how much have I touched"; readiness =
 * "how prepared am I to perform", which rewards covered topics scaled by
 * mastery and weights subjects by their exam weight.
 */
export function computeLevelMetrics(
  level: Level,
  progress: Map<string, ProgressRow>,
): LevelMetrics {
  const subjects = getSubjects(level)
  const subjectMetrics: SubjectMetric[] = []
  let total = 0
  let covered = 0
  let weakCount = 0
  let overdueCount = 0
  const now = Date.now()

  for (const subject of subjects) {
    let sTotal = 0
    let sCovered = 0
    let masterySum = 0
    let masteryCount = 0
    let readinessSum = 0

    for (const topic of subject.topics) {
      for (const sub of topic.subtopics) {
        sTotal++
        const row = progress.get(sub.id)
        const cov = isCovered(row?.status)
        if (cov) sCovered++
        if (row?.status === 'weak') weakCount++
        if (row?.revision_due_at && new Date(row.revision_due_at).getTime() < now) {
          overdueCount++
        }
        const m = masteryOf(row)
        if (m != null) {
          masterySum += m
          masteryCount++
        }
        const masteryFactor = m != null ? Math.min(1, Math.max(0.3, m / 5)) : 0.5
        readinessSum += cov ? masteryFactor : 0
      }
    }

    total += sTotal
    covered += sCovered
    subjectMetrics.push({
      subject,
      total: sTotal,
      covered: sCovered,
      coveragePct: sTotal ? Math.round((sCovered / sTotal) * 100) : 0,
      avgMastery: masteryCount ? Number((masterySum / masteryCount).toFixed(1)) : null,
      readiness: sTotal ? Math.round((readinessSum / sTotal) * 100) : 0,
    })
  }

  const weightSum = subjects.reduce((a, s) => a + subjectWeightMid(s), 0)
  const readiness = weightSum
    ? Math.round(
        subjectMetrics.reduce((a, sm) => a + sm.readiness * subjectWeightMid(sm.subject), 0) /
          weightSum,
      )
    : 0

  return {
    total,
    covered,
    coveragePct: total ? Math.round((covered / total) * 100) : 0,
    readiness,
    weakCount,
    overdueCount,
    subjects: subjectMetrics,
  }
}
