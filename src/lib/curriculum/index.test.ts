import { describe, it, expect } from 'vitest'
import {
  findSubtopic,
  countSubtopics,
  countTopics,
  getAllSubtopics,
  isLevel,
  subjectWeightMid,
  LEVELS,
} from './index'

const REAL_ID = 'l1-qm-tvm-interest-rates'

describe('isLevel', () => {
  it('accepts the three valid level strings', () => {
    expect(isLevel('1')).toBe(true)
    expect(isLevel('2')).toBe(true)
    expect(isLevel('3')).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isLevel('4')).toBe(false)
    expect(isLevel(1)).toBe(false)
    expect(isLevel(null)).toBe(false)
    expect(isLevel(undefined)).toBe(false)
    expect(isLevel('')).toBe(false)
  })
})

describe('findSubtopic', () => {
  it('resolves a known real subtopic id with full ref shape', () => {
    const ref = findSubtopic(REAL_ID)
    expect(ref).not.toBeNull()
    expect(ref!.subtopic.id).toBe(REAL_ID)
    expect(ref!.subtopic.title).toBe('Interest Rates & Required Returns')
    expect(ref!.level).toBe('1')
    expect(ref!.topic.id).toBe('l1-qm-tvm')
    expect(ref!.subject.code).toBe('QM')
  })

  it('returns null for an unknown id', () => {
    expect(findSubtopic('does-not-exist')).toBeNull()
    expect(findSubtopic('')).toBeNull()
  })

  it('can resolve ids across all levels', () => {
    for (const level of LEVELS) {
      const subs = getAllSubtopics(level)
      const first = subs[0]
      const found = findSubtopic(first.subtopic.id)
      expect(found).not.toBeNull()
      expect(found!.level).toBe(level)
    }
  })
})

describe('countSubtopics / countTopics / getAllSubtopics', () => {
  it('returns positive counts for every level', () => {
    for (const level of LEVELS) {
      expect(countSubtopics(level)).toBeGreaterThan(0)
      expect(countTopics(level)).toBeGreaterThan(0)
    }
  })

  it('getAllSubtopics length matches countSubtopics', () => {
    for (const level of LEVELS) {
      expect(getAllSubtopics(level).length).toBe(countSubtopics(level))
    }
  })

  it('every subtopic ref carries unique ids and intact parent links', () => {
    const refs = getAllSubtopics('1')
    const ids = refs.map((r) => r.subtopic.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const r of refs) {
      expect(r.level).toBe('1')
      expect(typeof r.subtopic.title).toBe('string')
      expect(r.subject.topics).toContain(r.topic)
      expect(r.topic.subtopics).toContain(r.subtopic)
    }
  })
})

describe('subjectWeightMid', () => {
  it('returns the midpoint of the weight range', () => {
    const subject = findSubtopic(REAL_ID)!.subject
    expect(subjectWeightMid(subject)).toBe((subject.weightMin + subject.weightMax) / 2)
  })

  it('computes a simple midpoint correctly', () => {
    const fake = { weightMin: 10, weightMax: 20 } as Parameters<typeof subjectWeightMid>[0]
    expect(subjectWeightMid(fake)).toBe(15)
  })
})
