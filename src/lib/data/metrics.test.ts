import { describe, it, expect } from 'vitest'
import { computeLevelMetrics } from './metrics'
import type { ProgressRow } from './progress'

// Helper: build a partial ProgressRow with only the fields metrics.ts reads.
function row(partial: Partial<ProgressRow>): ProgressRow {
  return partial as ProgressRow
}

function progress(entries: Record<string, Partial<ProgressRow>>): Map<string, ProgressRow> {
  const map = new Map<string, ProgressRow>()
  for (const [id, p] of Object.entries(entries)) map.set(id, row(p))
  return map
}

describe('computeLevelMetrics', () => {
  it('an empty progress map yields zero coverage but a known total', () => {
    const m = computeLevelMetrics('1', new Map())
    expect(m.covered).toBe(0)
    expect(m.coveragePct).toBe(0)
    expect(m.weakCount).toBe(0)
    expect(m.overdueCount).toBe(0)
    expect(m.total).toBeGreaterThan(0)
    expect(m.subjects.length).toBeGreaterThan(0)
    expect(m.readiness).toBe(0)
  })

  it('a mastered subtopic raises coverage and covered count', () => {
    const empty = computeLevelMetrics('1', new Map())
    const m = computeLevelMetrics(
      '1',
      progress({ 'l1-qm-tvm-interest-rates': { status: 'mastered' } }),
    )
    expect(m.covered).toBe(1)
    expect(m.coveragePct).toBeGreaterThanOrEqual(empty.coveragePct)
  })

  it('a weak status increments weakCount', () => {
    const m = computeLevelMetrics(
      '1',
      progress({
        'l1-qm-tvm-interest-rates': { status: 'weak' },
        'l1-qm-tvm-fv': { status: 'weak' },
      }),
    )
    expect(m.weakCount).toBe(2)
    // weak is not a covered status
    expect(m.covered).toBe(0)
  })

  it('a past revision_due_at increments overdueCount; a future one does not', () => {
    const past = new Date(Date.now() - 86_400_000).toISOString()
    const future = new Date(Date.now() + 86_400_000).toISOString()
    const m = computeLevelMetrics(
      '1',
      progress({
        'l1-qm-tvm-interest-rates': { status: 'completed', revision_due_at: past },
        'l1-qm-tvm-fv': { status: 'completed', revision_due_at: future },
      }),
    )
    expect(m.overdueCount).toBe(1)
  })

  it('readiness stays within 0..100 and rewards mastery on covered topics', () => {
    const low = computeLevelMetrics(
      '1',
      progress({ 'l1-qm-tvm-interest-rates': { status: 'completed', ai_mastery: 1 } }),
    )
    const high = computeLevelMetrics(
      '1',
      progress({ 'l1-qm-tvm-interest-rates': { status: 'completed', ai_mastery: 5 } }),
    )
    for (const m of [low, high]) {
      expect(m.readiness).toBeGreaterThanOrEqual(0)
      expect(m.readiness).toBeLessThanOrEqual(100)
    }
    expect(high.readiness).toBeGreaterThanOrEqual(low.readiness)
  })

  it('computes per-subject coveragePct and avgMastery', () => {
    const m = computeLevelMetrics(
      '1',
      progress({
        'l1-qm-tvm-interest-rates': { status: 'mastered', ai_mastery: 4 },
        'l1-qm-tvm-fv': { status: 'completed', ai_mastery: 2 },
      }),
    )
    const qm = m.subjects.find((s) => s.subject.code === 'QM')
    expect(qm).toBeDefined()
    expect(qm!.covered).toBe(2)
    expect(qm!.coveragePct).toBeGreaterThan(0)
    expect(qm!.coveragePct).toBeLessThanOrEqual(100)
    expect(qm!.avgMastery).toBe(3) // (4 + 2) / 2
  })

  it('falls back to self_confidence when ai_mastery is absent', () => {
    const m = computeLevelMetrics(
      '1',
      progress({ 'l1-qm-tvm-interest-rates': { status: 'completed', self_confidence: 5 } }),
    )
    const qm = m.subjects.find((s) => s.subject.code === 'QM')!
    expect(qm.avgMastery).toBe(5)
  })
})
