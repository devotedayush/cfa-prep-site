import { describe, it, expect } from 'vitest'
import { isCovered, COVERED_STATUSES } from './status'

describe('COVERED_STATUSES', () => {
  it('contains exactly the statuses that count toward coverage', () => {
    expect(COVERED_STATUSES).toEqual(['completed', 'revised', 'mastered'])
  })

  it('does not include in-progress / not-started / weak', () => {
    expect(COVERED_STATUSES).not.toContain('not_started')
    expect(COVERED_STATUSES).not.toContain('in_progress')
    expect(COVERED_STATUSES).not.toContain('weak')
  })
})

describe('isCovered', () => {
  it('returns true for each covered status', () => {
    expect(isCovered('completed')).toBe(true)
    expect(isCovered('revised')).toBe(true)
    expect(isCovered('mastered')).toBe(true)
  })

  it('returns false for non-covered statuses', () => {
    expect(isCovered('not_started')).toBe(false)
    expect(isCovered('in_progress')).toBe(false)
    expect(isCovered('weak')).toBe(false)
  })

  it('returns false for null, undefined, empty and unknown strings', () => {
    expect(isCovered(null)).toBe(false)
    expect(isCovered(undefined)).toBe(false)
    expect(isCovered('')).toBe(false)
    expect(isCovered('bogus')).toBe(false)
  })
})
