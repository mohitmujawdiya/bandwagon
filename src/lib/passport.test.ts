import { describe, test, expect } from 'vitest'
import { buildPassport, rarityOf } from './passport'
import { TRAIT_KEYS } from './traits'
import type { QuizAnswers } from './assign'
import { NATION_BY_CODE } from '../data/nations'

const base: QuizAnswers = {
  heritage: null, underdog: 0, playstyle: null, region: null, rivalCode: null, energy: null,
}

describe('rarityOf', () => {
  test('tiers by underdog score', () => {
    expect(rarityOf(NATION_BY_CODE.CUW)).toBe('legendary') // 98
    expect(rarityOf(NATION_BY_CODE.KSA)).toBe('rare')       // 72
    expect(rarityOf(NATION_BY_CODE.BRA)).toBe('common')     // 5
  })
})

describe('buildPassport', () => {
  test('assembles a complete passport with duotone + traits', () => {
    const p = buildPassport({ ...base, heritage: 'mexico' })
    expect(p.nation.code).toBe('MEX')
    expect(p.nickname).toBe('El Tri')
    expect(p.verdict.length).toBeGreaterThan(0)
    expect(Object.keys(p.traits).sort()).toEqual([...TRAIT_KEYS].sort())
    expect(p.duotone.primary).toMatch(/^oklch\(/)
    expect(p.group).toBe('A')
    expect(p.supporterNumber).toBeGreaterThan(0)
  })

  test('a server can inject the real verdict and supporter number', () => {
    const p = buildPassport({ ...base, heritage: 'mexico' }, { verdict: 'Custom line.', supporterNumber: 4127 })
    expect(p.verdict).toBe('Custom line.')
    expect(p.supporterNumber).toBe(4127)
  })

  test('the placeholder supporter number is deterministic per answer set', () => {
    const a: QuizAnswers = { ...base, region: 'europe', underdog: -1 }
    expect(buildPassport(a).supporterNumber).toBe(buildPassport(a).supporterNumber)
  })
})
