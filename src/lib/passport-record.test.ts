import { describe, test, expect } from 'vitest'
import { passportFromRecord, shortId, type PassportRecord } from './passport-record'
import { TRAIT_KEYS } from './traits'
import { NATION_BY_CODE } from '../data/nations'
import type { QuizAnswers } from './assign'

const answers: QuizAnswers = {
  heritage: 'mexico', underdog: 0, playstyle: null, region: null, rivalCode: null, energy: 'passionate',
}

const record: PassportRecord = {
  shareId: 'abc12345',
  nationCode: 'MEX',
  nickname: 'El Tri',
  verdict: 'Some teams you pick. This one picked you.',
  verdictSource: 'fallback',
  traits: { passion: 84, loyalty: 60, flair: 70, grit: 58, banter: 64 },
  rarity: 'common',
  group: 'A',
  supporterNumber: 4127,
  quizAnswers: answers,
}

describe('passportFromRecord', () => {
  test('reconstructs PassportData from a stored record', () => {
    const p = passportFromRecord(record)!
    expect(p).not.toBeNull()
    expect(p.nation).toBe(NATION_BY_CODE.MEX)
    expect(p.nickname).toBe('El Tri')
    expect(p.verdict).toBe(record.verdict)
    expect(p.supporterNumber).toBe(4127)
    expect(p.rarity).toBe('common')
    expect(Object.keys(p.traits).sort()).toEqual([...TRAIT_KEYS].sort())
  })

  test('derives the per-nation duotone from the nation accent', () => {
    const p = passportFromRecord(record)!
    expect(p).not.toBeNull()
    expect(p.duotone.primary).toMatch(/^oklch\(/)
    expect(p.duotone.deep).toMatch(/^oklch\(/)
    expect(p.duotone.glow).toMatch(/^oklch\(/)
  })

  test('returns null for an unknown nation code (corrupt record)', () => {
    expect(passportFromRecord({ ...record, nationCode: 'ZZZ' })).toBeNull()
  })
})

describe('shortId', () => {
  test('returns a url-safe id of reasonable length', () => {
    const id = shortId()
    expect(id).toMatch(/^[0-9A-Za-z]{8,}$/)
  })

  test('is collision-resistant across many calls', () => {
    const ids = new Set(Array.from({ length: 500 }, () => shortId()))
    expect(ids.size).toBe(500)
  })
})
