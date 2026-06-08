import { describe, test, expect } from 'vitest'
import { computeTraits, TRAIT_KEYS } from './traits'
import type { QuizAnswers } from './assign'
import { NATION_BY_CODE } from '../data/nations'

const base: QuizAnswers = {
  heritage: null, underdog: 0, playstyle: null, region: null, rivalCode: null, energy: null,
}

describe('computeTraits', () => {
  test('returns all five traits as integers in [0, 100]', () => {
    const t = computeTraits(NATION_BY_CODE.BRA, base)
    expect(Object.keys(t).sort()).toEqual([...TRAIT_KEYS].sort())
    for (const k of TRAIT_KEYS) {
      expect(Number.isInteger(t[k])).toBe(true)
      expect(t[k]).toBeGreaterThanOrEqual(0)
      expect(t[k]).toBeLessThanOrEqual(100)
    }
  })

  test('is deterministic', () => {
    const a: QuizAnswers = { ...base, energy: 'passionate', playstyle: 'flair' }
    expect(computeTraits(NATION_BY_CODE.ARG, a)).toEqual(computeTraits(NATION_BY_CODE.ARG, a))
  })

  test('a flair side out-scores a defensive side on flair', () => {
    expect(computeTraits(NATION_BY_CODE.BRA, base).flair)
      .toBeGreaterThan(computeTraits(NATION_BY_CODE.IRN, base).flair)
  })

  test('a defensive, gritty side scores higher on grit than on flair', () => {
    const iran = computeTraits(NATION_BY_CODE.IRN, base)
    expect(iran.grit).toBeGreaterThan(iran.flair)
  })

  test('the user energy nudges the matching trait upward', () => {
    const neutral = computeTraits(NATION_BY_CODE.MAR, base)
    const joyful = computeTraits(NATION_BY_CODE.MAR, { ...base, energy: 'joyful' })
    // 'joyful' feeds banter; the nudge should not lower it
    expect(joyful.banter).toBeGreaterThanOrEqual(neutral.banter)
    expect(joyful.banter).toBeGreaterThan(neutral.banter - 1)
  })
})
