import { describe, test, expect } from 'vitest'
import { buildVerdict } from './verdict'
import type { QuizAnswers } from './assign'
import { NATION_BY_CODE } from '../data/nations'

const base: QuizAnswers = {
  heritage: null, underdog: 0, playstyle: null, region: null, rivalCode: null, energy: null,
}

describe('buildVerdict (templated fallback)', () => {
  test('returns a non-empty line', () => {
    expect(buildVerdict(NATION_BY_CODE.BRA, base).length).toBeGreaterThan(0)
  })

  test('is deterministic for the same nation + answers', () => {
    const answers: QuizAnswers = { ...base, heritage: 'mexico', energy: 'passionate' }
    expect(buildVerdict(NATION_BY_CODE.MEX, answers)).toBe(buildVerdict(NATION_BY_CODE.MEX, answers))
  })

  test('names the nation', () => {
    const v = buildVerdict(NATION_BY_CODE.JPN, base)
    expect(v.includes('Japan') || v.includes('Samurai Blue')).toBe(true)
  })

  test('never uses an em dash or double hyphen (brand rule)', () => {
    for (const code of ['MEX', 'CUW', 'FRA', 'SEN', 'KOR', 'ENG']) {
      const v = buildVerdict(NATION_BY_CODE[code], { ...base, underdog: 2 })
      expect(v).not.toContain('—')
      expect(v).not.toContain('--')
    }
  })

  test('stays short enough for the passport (<= 260 chars)', () => {
    for (const n of Object.values(NATION_BY_CODE)) {
      expect(buildVerdict(n, { ...base, underdog: 1, region: n.region }).length).toBeLessThanOrEqual(260)
    }
  })

  test('the answers shape the line: heritage vs underdog reasons read differently', () => {
    const heritageV = buildVerdict(NATION_BY_CODE.MAR, { ...base, heritage: 'north-africa' })
    const underdogV = buildVerdict(NATION_BY_CODE.MAR, { ...base, underdog: 2 })
    expect(heritageV).not.toBe(underdogV)
  })
})
