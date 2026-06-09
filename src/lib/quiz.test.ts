import { describe, test, expect } from 'vitest'
import { QUIZ, EMPTY_ANSWERS } from './quiz'
import { assignNation, type QuizAnswers } from './assign'
import { NATIONS, NATION_BY_CODE } from '../data/nations'

const ENERGIES = new Set(NATIONS.flatMap((n) => n.energy))
const PLAYSTYLES = new Set(NATIONS.flatMap((n) => n.playstyles))
const REGIONS = new Set(NATIONS.map((n) => n.region))
const HERITAGE = new Set(NATIONS.flatMap((n) => n.heritageTags))
const arr = <T>(v: T | T[] | null | undefined): T[] => (v == null ? [] : Array.isArray(v) ? v : [v])

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
        for (const r of arr(o.patch.region)) expect(REGIONS.has(r)).toBe(true)
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
})
