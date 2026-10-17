// Canonical per-subtopic study statuses (stored in study_progress.status).

export const STATUSES = [
  'not_started',
  'in_progress',
  'completed',
  'revised',
  'mastered',
  'weak',
] as const

export type StudyStatus = (typeof STATUSES)[number]

export const STATUS_LABELS: Record<StudyStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
  revised: 'Revised',
  mastered: 'Mastered',
  weak: 'Weak',
}

/** Statuses that count toward syllabus coverage. */
export const COVERED_STATUSES: StudyStatus[] = ['completed', 'revised', 'mastered']

export function isCovered(status: string | null | undefined): boolean {
  return COVERED_STATUSES.includes((status ?? '') as StudyStatus)
}

export function statusTone(status: string | null | undefined): string {
  switch (status) {
    case 'mastered':
      return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    case 'revised':
      return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
    case 'completed':
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    case 'in_progress':
      return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    case 'weak':
      return 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    default:
      return 'bg-white/5 border-white/10 text-white/40'
  }
}
