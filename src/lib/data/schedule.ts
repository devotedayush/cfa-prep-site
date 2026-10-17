import { countSubtopics, type Level } from '@/lib/curriculum'

export type ScheduleStatus = 'no_date' | 'done' | 'on_track' | 'behind' | 'recovery'

export interface ScheduleAssessment {
  status: ScheduleStatus
  remaining: number
  total: number
  estHoursRemaining: number
  neededHoursPerWeek: number | null
  message: string
}

// Rough blended learn+revise time per subtopic, used only for pacing guidance.
const MIN_PER_SUBTOPIC = 35

/**
 * Turns exam date + coverage + weekly capacity into a single, supportive
 * pacing verdict. "Recovery" triggers when the required weekly load far
 * exceeds the user's stated capacity — the UI then nudges toward the
 * highest-weight topics instead of piling everything on.
 */
export function assessSchedule(opts: {
  level: Level
  coveredCount: number
  daysLeft: number | null
  targetHoursWeek: number | null
}): ScheduleAssessment {
  const total = countSubtopics(opts.level)
  const remaining = Math.max(0, total - opts.coveredCount)
  const estHoursRemaining = Math.round((remaining * MIN_PER_SUBTOPIC) / 60)
  const base = { remaining, total, estHoursRemaining, neededHoursPerWeek: null as number | null }

  if (remaining === 0) {
    return { ...base, status: 'done', message: 'Full syllabus covered — shift to revision and mocks.' }
  }
  if (opts.daysLeft == null) {
    return { ...base, status: 'no_date', message: 'Set your exam date in Settings to unlock pacing guidance.' }
  }
  if (opts.daysLeft <= 0) {
    return { ...base, status: 'recovery', message: 'Your exam date has passed — update it in Settings.' }
  }

  const weeksLeft = Math.max(opts.daysLeft / 7, 0.15)
  const neededPerWeek = Math.round(estHoursRemaining / weeksLeft)
  const withNeed = { ...base, neededHoursPerWeek: neededPerWeek }

  const capacity = opts.targetHoursWeek
  if (!capacity) {
    return { ...withNeed, status: 'on_track', message: `~${estHoursRemaining}h of new material left (${remaining} subtopics). Set a weekly target for pacing.` }
  }

  if (neededPerWeek <= capacity) {
    return { ...withNeed, status: 'on_track', message: `On track — about ${neededPerWeek}h/week of new material vs your ${capacity}h target.` }
  }
  if (neededPerWeek <= capacity * 1.5) {
    return { ...withNeed, status: 'behind', message: `Slightly behind — needs ~${neededPerWeek}h/week (target ${capacity}h). Tighten up or trim low-weight topics.` }
  }
  return {
    ...withNeed,
    status: 'recovery',
    message: `Recovery mode: ~${neededPerWeek}h/week needed vs ${capacity}h. Focus only on the highest-weight topics below — we'll defer the rest. Steady beats perfect.`,
  }
}
