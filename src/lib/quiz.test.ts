import { describe, test, expect } from 'vitest'
import { QUIZ, EMPTY_ANSWERS } from './quiz'
import { assignNation, type QuizAnswers } from './assign'
import { NATIONS, NATION_BY_CODE } from '../data/nations'

const ENERGIES = new Set(NATIONS.flatMap((n) => n.energy))
const PLAYSTYLES = new Set(NATIONS.flatMap((n) => n.playstyles))
const ARCHETYPES = new Set(NATIONS.map((n) => n.archetype))
const HERITAGE = new Set(NATIONS.flatMap((n) => n.heritageTags))
const arr = <T>(v: T | T[] | null | undefined): T[] => (v == null ? [] : Array.isArray(v) ? v : [v])

/** Every option patch list per question, with the skip (no patch) where allowed. */
function optionPatches() {
  return QUIZ.map((q) => {
    const patches = q.options.map((o) => o.patch)
    if (q.skippable) patches.push({})
    return patches
  })
}

describe('quiz definition', () => {
  test('has 6 questions, each with at least 4 options', () => {
    expect(QUIZ).toHaveLength(6)
    for (const q of QUIZ) expect(q.options.length).toBeGreaterThanOrEqual(4)
  })

  test('only the roots question is skippable', () => {
    expect(QUIZ.filter((q) => q.skippable)).toHaveLength(1)
  })

  test('every option patch maps to values the engine actually recognizes', () => {
    for (const q of QUIZ) {
      for (const o of q.options) {
        if (o.patch.energy) expect(ENERGIES.has(o.patch.energy)).toBe(true)
        if (o.patch.playstyle) expect(PLAYSTYLES.has(o.patch.playstyle)).toBe(true)
        if (o.patch.archetype) expect(ARCHETYPES.has(o.patch.archetype)).toBe(true)
        for (const h of arr(o.patch.heritage)) expect(HERITAGE.has(h)).toBe(true)
        if (o.patch.rivalCode) expect(NATION_BY_CODE[o.patch.rivalCode]).toBeDefined()
        if (o.patch.underdog !== undefined) {
          expect(o.patch.underdog).toBeGreaterThanOrEqual(-2)
          expect(o.patch.underdog).toBeLessThanOrEqual(2)
        }
      }
    }
  })

  test('answering the first option of every question yields a valid nation', () => {
    let answers: QuizAnswers = { ...EMPTY_ANSWERS }
    for (const q of QUIZ) answers = { ...answers, ...q.options[0].patch }
    expect(NATION_BY_CODE[assignNation(answers).nation.code]).toBeDefined()
  })

  test('skipping roots still yields a valid nation', () => {
    let answers: QuizAnswers = { ...EMPTY_ANSWERS }
    for (const q of QUIZ) {
      if (q.skippable) continue
      answers = { ...answers, ...q.options[0].patch }
    }
    expect(assignNation(answers).nation).toBeTruthy()
  })

  // The whole point of the redesign: no nation is a dead end. Brute-force every
  // combination of answers and assert all 48 passports are reachable.
  test('every one of the 48 nations is reachable by some combination of answers', () => {
    const opts = optionPatches()
    const reached = new Set<string>()
    function walk(qi: number, acc: QuizAnswers) {
      if (qi === opts.length) {
        reached.add(assignNation(acc).nation.code)
        return
      }
      for (const p of opts[qi]) walk(qi + 1, { ...acc, ...p })
    }
    walk(0, { ...EMPTY_ANSWERS })
    const unreached = NATIONS.filter((n) => !reached.has(n.code)).map((n) => n.code)
    expect(unreached, `unreachable: ${unreached.join(', ')}`).toEqual([])
  })

  // No single nation should hoover up the field (Curaçao won ~12% pre-fix).
  test('no nation dominates the distribution', () => {
    const opts = optionPatches()
    const counts = new Map<string, number>()
    let total = 0
    function walk(qi: number, acc: QuizAnswers) {
      if (qi === opts.length) {
        const code = assignNation(acc).nation.code
        counts.set(code, (counts.get(code) ?? 0) + 1)
        total++
        return
      }
      for (const p of opts[qi]) walk(qi + 1, { ...acc, ...p })
    }
    walk(0, { ...EMPTY_ANSWERS })
    const max = Math.max(...counts.values())
    expect(max / total).toBeLessThan(0.08)
  })
})
