import { describe, it, expect } from 'vitest'
import { buildPlan } from './plan'
import type { ProgressRow } from './progress'

function row(partial: Partial<ProgressRow>): ProgressRow {
  return partial as ProgressRow
}

function progress(entries: Record<string, Partial<ProgressRow>>): Map<string, ProgressRow> {
  const map = new Map<string, ProgressRow>()
  for (const [id, p] of Object.entries(entries)) map.set(id, row(p))
  return map
}

const PAST = new Date(Date.now() - 86_400_000).toISOString()

describe('buildPlan', () => {
  it('returns brand-new items for an empty progress map', () => {
    const plan = buildPlan('1', new Map(), 5)
    expect(plan.length).toBe(5)
    expect(plan.every((p) => p.kind === 'new')).toBe(true)
  })

  it('respects the limit', () => {
    expect(buildPlan('1', new Map(), 3)).toHaveLength(3)
    expect(buildPlan('1', new Map(), 1)).toHaveLength(1)
    // default limit is 5
    expect(buildPlan('1', new Map())).toHaveLength(5)
  })

  it('items have the expected shape', () => {
    const [item] = buildPlan('1', new Map(), 1)
    expect(item).toMatchObject({
      subtopicId: expect.any(String),
      title: expect.any(String),
      topicTitle: expect.any(String),
      subjectTitle: expect.any(String),
      reason: expect.any(String),
      kind: expect.any(String),
      estMinutes: expect.any(Number),
    })
    expect(item.estMinutes).toBeGreaterThanOrEqual(15)
  })

  it('ranks overdue revision above weak above brand-new', () => {
    const plan = buildPlan(
      '1',
      progress({
        'l1-qm-tvm-fv': { status: 'completed', revision_due_at: PAST }, // revision
        'l1-qm-tvm-pv': { status: 'weak' }, // weak
        // everything else is brand-new
      }),
      5,
    )
    expect(plan[0].kind).toBe('revision')
    expect(plan[0].subtopicId).toBe('l1-qm-tvm-fv')
    expect(plan[1].kind).toBe('weak')
    expect(plan[1].subtopicId).toBe('l1-qm-tvm-pv')
    expect(plan.slice(2).every((p) => p.kind === 'new')).toBe(true)
  })

  it('overdue revision uses the "Revision overdue" reason', () => {
    const plan = buildPlan(
      '1',
      progress({ 'l1-qm-tvm-fv': { status: 'completed', revision_due_at: PAST } }),
      1,
    )
    expect(plan[0]).toMatchObject({ kind: 'revision', reason: 'Revision overdue' })
  })

  it('excludes covered and in-progress items from the new bucket', () => {
    const plan = buildPlan(
      '1',
      progress({
        'l1-qm-tvm-interest-rates': { status: 'mastered' },
        'l1-qm-tvm-fv': { status: 'in_progress' },
      }),
      50,
    )
    const ids = plan.map((p) => p.subtopicId)
    expect(ids).not.toContain('l1-qm-tvm-interest-rates')
    expect(ids).not.toContain('l1-qm-tvm-fv')
  })
})
