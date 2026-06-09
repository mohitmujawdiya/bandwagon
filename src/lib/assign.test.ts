import { describe, test, expect } from 'vitest'
import { assignNation, scoreNation, type QuizAnswers } from './assign'
import { NATIONS, NATION_BY_CODE } from '../data/nations'
import type { HeritageKey } from '../data/types'

// A neutral baseline: every signal off. Spread overrides per test.
const base: QuizAnswers = {
  heritage: null,
  underdog: 0,
  playstyle: null,
  archetype: null,
  rivalCode: null,
  energy: null,
}

describe('assignNation', () => {
  test('is deterministic: same answers always return the same nation', () => {
    const answers: QuizAnswers = { ...base, heritage: ['west-africa'], underdog: 1, energy: 'joyful' }
    const a = assignNation(answers)
    const b = assignNation(answers)
    expect(a.nation.code).toBe(b.nation.code)
  })

  test('heritage dominates: Mexican roots return Mexico even against a conflicting archetype', () => {
    // MEX is a "contender", so a "champion" answer would pull elsewhere if heritage didn't dominate.
    const answers: QuizAnswers = { ...base, heritage: 'mexico', archetype: 'champion' }
    expect(assignNation(answers).nation.code).toBe('MEX')
  })

  test('heritage routes within the matched set: East Asian roots return Japan or South Korea', () => {
    const answers: QuizAnswers = { ...base, heritage: 'east-asia' }
    expect(['JPN', 'KOR']).toContain(assignNation(answers).nation.code)
  })

  test('juggernaut lovers (no heritage) get a giant', () => {
    const answers: QuizAnswers = { ...base, underdog: -2 }
    expect(assignNation(answers).nation.underdogScore).toBeLessThanOrEqual(25)
  })

  test('underdog lovers (no heritage) get an underdog', () => {
    const answers: QuizAnswers = { ...base, underdog: 2 }
    expect(assignNation(answers).nation.underdogScore).toBeGreaterThanOrEqual(75)
  })

  test('the archetype answer routes to that archetype (the prestige axis)', () => {
    // "Lifting the trophy" with no other signal lands on an actual favorite.
    expect(assignNation({ ...base, archetype: 'champion' }).nation.archetype).toBe('champion')
    expect(assignNation({ ...base, archetype: 'party' }).nation.archetype).toBe('party')
  })

  test('all-neutral answers still return a valid nation without throwing', () => {
    const result = assignNation(base)
    expect(NATION_BY_CODE[result.nation.code]).toBeDefined()
  })

  test('spreads across the field: a grid of answers reaches many distinct nations', () => {
    const heritages: (HeritageKey | null)[] = [
      null, 'mexico', 'south-america', 'caribbean', 'west-africa', 'north-africa',
      'east-asia', 'middle-east', 'balkans', 'nordic', 'central-asia', 'oceania',
    ]
    const archetypes = ['champion', 'contender', 'dark-horse', 'party'] as const
    const seen = new Set<string>()
    for (const heritage of heritages) {
      for (const archetype of archetypes) {
        for (const underdog of [-2, 0, 2]) {
          seen.add(assignNation({ ...base, heritage, archetype, underdog }).nation.code)
        }
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(30)
  })
})

describe('scoreNation mechanics', () => {
  test('wanting to beat Brazil boosts Brazil\'s rival Argentina', () => {
    const without = scoreNation(NATION_BY_CODE.ARG, { ...base })
    const withRival = scoreNation(NATION_BY_CODE.ARG, { ...base, rivalCode: 'BRA' })
    expect(withRival).toBeGreaterThan(without)
  })

  test('a matching playstyle scores higher than a non-matching one', () => {
    // Brazil is flair; Iran is not.
    const flairAnswers: QuizAnswers = { ...base, playstyle: 'flair' }
    expect(scoreNation(NATION_BY_CODE.BRA, flairAnswers)).toBeGreaterThan(
      scoreNation(NATION_BY_CODE.IRN, flairAnswers),
    )
  })
})

describe('nation dataset integrity', () => {
  test('has all 48 teams', () => {
    expect(NATIONS).toHaveLength(48)
  })

  test('codes are unique', () => {
    expect(new Set(NATIONS.map((n) => n.code)).size).toBe(48)
  })

  test('has exactly 12 groups of 4', () => {
    const byGroup = new Map<string, number>()
    for (const n of NATIONS) byGroup.set(n.group, (byGroup.get(n.group) ?? 0) + 1)
    expect(byGroup.size).toBe(12)
    for (const count of byGroup.values()) expect(count).toBe(4)
  })

  test('every rival code references a real nation', () => {
    for (const n of NATIONS) {
      for (const r of n.rivals) expect(NATION_BY_CODE[r], `${n.code} -> ${r}`).toBeDefined()
    }
  })

  test('accent and score values are in range', () => {
    for (const n of NATIONS) {
      expect(n.accent.hue).toBeGreaterThanOrEqual(0)
      expect(n.accent.hue).toBeLessThanOrEqual(360)
      expect(n.accent.chroma).toBeGreaterThanOrEqual(0)
      expect(n.accent.chroma).toBeLessThanOrEqual(0.37)
      expect(n.underdogScore).toBeGreaterThanOrEqual(0)
      expect(n.underdogScore).toBeLessThanOrEqual(100)
    }
  })
})
