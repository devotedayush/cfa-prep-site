import { describe, it, expect } from 'vitest'
import { assessSchedule } from './schedule'
import { countSubtopics } from '@/lib/curriculum'

const TOTAL = countSubtopics('1')

describe('assessSchedule', () => {
  it('null daysLeft (with material remaining) → no_date', () => {
    const a = assessSchedule({
      level: '1',
      coveredCount: 0,
      daysLeft: null,
      targetHoursWeek: 10,
    })
    expect(a.status).toBe('no_date')
    expect(a.total).toBe(TOTAL)
    expect(a.remaining).toBe(TOTAL)
    expect(a.neededHoursPerWeek).toBeNull()
  })

  it('coveredCount === total → done (regardless of date)', () => {
    const a = assessSchedule({
      level: '1',
      coveredCount: TOTAL,
      daysLeft: null,
      targetHoursWeek: 1,
    })
    expect(a.status).toBe('done')
    expect(a.remaining).toBe(0)
    expect(a.estHoursRemaining).toBe(0)
  })

  it('overshooting coveredCount still clamps remaining to 0 and reports done', () => {
    const a = assessSchedule({
      level: '1',
      coveredCount: TOTAL + 50,
      daysLeft: 30,
      targetHoursWeek: 10,
    })
    expect(a.status).toBe('done')
    expect(a.remaining).toBe(0)
  })

  it('comfortable capacity vs ample time → on_track', () => {
    const a = assessSchedule({
      level: '1',
      coveredCount: 0,
      daysLeft: 365,
      targetHoursWeek: 100,
    })
    expect(a.status).toBe('on_track')
    expect(a.neededHoursPerWeek).not.toBeNull()
    expect(a.neededHoursPerWeek!).toBeLessThanOrEqual(100)
  })

  it('no weekly target but a date set → on_track with guidance to set one', () => {
    const a = assessSchedule({
      level: '1',
      coveredCount: 0,
      daysLeft: 200,
      targetHoursWeek: null,
    })
    expect(a.status).toBe('on_track')
    // The no-capacity branch still surfaces the computed need.
    expect(a.neededHoursPerWeek).not.toBeNull()
    expect(a.message.toLowerCase()).toContain('weekly target')
  })

  it('tiny capacity vs many remaining + short daysLeft → recovery', () => {
    const a = assessSchedule({
      level: '1',
      coveredCount: 0,
      daysLeft: 7,
      targetHoursWeek: 1,
    })
    expect(a.status).toBe('recovery')
    expect(a.neededHoursPerWeek!).toBeGreaterThan(1 * 1.5)
  })

  it('a passed exam date (daysLeft <= 0) with work left → recovery', () => {
    const a = assessSchedule({
      level: '1',
      coveredCount: 0,
      daysLeft: 0,
      targetHoursWeek: 10,
    })
    expect(a.status).toBe('recovery')
    expect(a.message.toLowerCase()).toContain('passed')
  })

  it('moderately stretched capacity → behind (between 1x and 1.5x need)', () => {
    // Tune daysLeft so neededPerWeek sits just above target but within 1.5x.
    const remaining = TOTAL
    const estHours = Math.round((remaining * 35) / 60)
    const capacity = 20
    // Want neededPerWeek in (capacity, capacity*1.5]; pick ~1.25x capacity.
    const targetNeed = Math.round(capacity * 1.25)
    const weeksLeft = estHours / targetNeed
    const daysLeft = Math.round(weeksLeft * 7)
    const a = assessSchedule({
      level: '1',
      coveredCount: 0,
      daysLeft,
      targetHoursWeek: capacity,
    })
    expect(a.status).toBe('behind')
    expect(a.neededHoursPerWeek!).toBeGreaterThan(capacity)
    expect(a.neededHoursPerWeek!).toBeLessThanOrEqual(capacity * 1.5)
  })
})
