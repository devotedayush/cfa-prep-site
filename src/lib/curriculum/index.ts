import type { Level, LevelCurriculum, Subject, Topic, Subtopic } from './types'
import { LEVELS } from './types'
import { level1 } from './level-1'
import { level2 } from './level-2'
import { level3 } from './level-3'

export type { Level, LevelCurriculum, Subject, Topic, Subtopic } from './types'
export { LEVELS, LEVEL_LABELS } from './types'

export const CURRICULA: Record<Level, LevelCurriculum> = {
  '1': level1,
  '2': level2,
  '3': level3,
}

export function isLevel(value: unknown): value is Level {
  return value === '1' || value === '2' || value === '3'
}

export function getCurriculum(level: Level): LevelCurriculum {
  return CURRICULA[level]
}

export function getSubjects(level: Level): Subject[] {
  return CURRICULA[level].subjects
}

export interface SubtopicRef {
  level: Level
  subject: Subject
  topic: Topic
  subtopic: Subtopic
}

/** Every subtopic in a level, flattened with its parent topic & subject. */
export function getAllSubtopics(level: Level): SubtopicRef[] {
  const refs: SubtopicRef[] = []
  for (const subject of CURRICULA[level].subjects) {
    for (const topic of subject.topics) {
      for (const subtopic of topic.subtopics) {
        refs.push({ level, subject, topic, subtopic })
      }
    }
  }
  return refs
}

// Index every subtopic id once for O(1) lookup across all levels.
const subtopicIndex: Map<string, SubtopicRef> = (() => {
  const map = new Map<string, SubtopicRef>()
  for (const level of LEVELS) {
    for (const ref of getAllSubtopics(level)) map.set(ref.subtopic.id, ref)
  }
  return map
})()

export function findSubtopic(id: string): SubtopicRef | null {
  return subtopicIndex.get(id) ?? null
}

export function countSubtopics(level: Level): number {
  return getAllSubtopics(level).length
}

export function countTopics(level: Level): number {
  return CURRICULA[level].subjects.reduce((n, s) => n + s.topics.length, 0)
}

/** Midpoint of a subject's published exam-weight range (for planning math). */
export function subjectWeightMid(subject: Subject): number {
  return (subject.weightMin + subject.weightMax) / 2
}
