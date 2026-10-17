// The CFA curriculum is shipped as static, code-resident data keyed by stable
// TEXT ids. The database stores only per-user PROGRESS against these ids
// (see study_progress.subtopic_id etc.). Never renumber an existing id — that
// would orphan a user's progress. Ids are level-prefixed kebab-case, e.g.
// `l1-quant-tvm-interest-rates`.

export type Level = '1' | '2' | '3'

export interface Subtopic {
  id: string
  title: string
}

export interface Topic {
  id: string
  title: string
  /** Rough study-time estimate in minutes (drives the planner). */
  estMinutes?: number
  subtopics: Subtopic[]
}

export interface Subject {
  id: string
  /** Short code shared across levels, e.g. ETH, QM, FSA. */
  code: string
  title: string
  /** Published exam-weight range (%). Verify per exam year. */
  weightMin: number
  weightMax: number
  topics: Topic[]
}

export interface LevelCurriculum {
  level: Level
  subjects: Subject[]
}

export const LEVELS: Level[] = ['1', '2', '3']

export const LEVEL_LABELS: Record<Level, string> = {
  '1': 'Level I',
  '2': 'Level II',
  '3': 'Level III',
}
