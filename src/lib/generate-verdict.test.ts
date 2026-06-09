import { describe, test, expect } from 'vitest'
import { generateVerdict, isUsableVerdict, buildVerdictPrompt, type VerdictWriter } from './generate-verdict'
import { buildVerdict } from './verdict'
import type { QuizAnswers } from './assign'
import { NATION_BY_CODE } from '../data/nations'

const answers: QuizAnswers = {
  heritage: 'west-africa', underdog: 1, playstyle: 'attacking', archetype: 'dark-horse', rivalCode: null, energy: 'joyful',
}
const SEN = NATION_BY_CODE.SEN

const ok: VerdictWriter = async () => 'Senegal, the Lions of Teranga, are the team nobody wants to draw. Eyes on Sadio Mane.'
const throws: VerdictWriter = async () => { throw new Error('AI down') }
const empty: VerdictWriter = async () => '   '
const emDash: VerdictWriter = async () => 'Senegal will run you ragged — and they will enjoy it.'
const offTopic: VerdictWriter = async () => 'A fine choice for any tournament fan this summer.'
const slow: VerdictWriter = () => new Promise((res) => setTimeout(() => res('Senegal late line.'), 60))

describe('generateVerdict orchestration', () => {
  test('with no writer, returns the templated fallback', async () => {
    const r = await generateVerdict(SEN, answers)
    expect(r.source).toBe('fallback')
    expect(r.text).toBe(buildVerdict(SEN, answers))
  })

  test('with a good writer, returns the AI text', async () => {
    const r = await generateVerdict(SEN, answers, { writer: ok })
    expect(r.source).toBe('ai')
    expect(r.text).toContain('Lions of Teranga')
  })

  test('falls back when the writer throws', async () => {
    const r = await generateVerdict(SEN, answers, { writer: throws })
    expect(r.source).toBe('fallback')
  })

  test('falls back when the writer returns empty', async () => {
    expect((await generateVerdict(SEN, answers, { writer: empty })).source).toBe('fallback')
  })

  test('falls back when the AI breaks the no-em-dash rule', async () => {
    expect((await generateVerdict(SEN, answers, { writer: emDash })).source).toBe('fallback')
  })

  test('falls back when the AI never names the nation', async () => {
    expect((await generateVerdict(SEN, answers, { writer: offTopic })).source).toBe('fallback')
  })

  test('falls back when the writer is slower than the timeout', async () => {
    const r = await generateVerdict(SEN, answers, { writer: slow, timeoutMs: 10 })
    expect(r.source).toBe('fallback')
  })
})

describe('isUsableVerdict', () => {
  test('accepts an on-brand line that names the nation', () => {
    expect(isUsableVerdict('Japan, the Samurai Blue, will surprise somebody.', NATION_BY_CODE.JPN)).toBe(true)
  })
  test('rejects em dashes, emptiness, and over-length', () => {
    expect(isUsableVerdict('Japan — destiny.', NATION_BY_CODE.JPN)).toBe(false)
    expect(isUsableVerdict('   ', NATION_BY_CODE.JPN)).toBe(false)
    expect(isUsableVerdict('Japan '.repeat(60), NATION_BY_CODE.JPN)).toBe(false)
  })
})

describe('buildVerdictPrompt', () => {
  test('feeds the nation facts and the no-em-dash rule into the prompt', () => {
    const { system, user } = buildVerdictPrompt(SEN, answers)
    expect(user).toContain('Senegal')
    expect(user).toContain('Lions of Teranga')
    expect(system.toLowerCase()).toContain('em dash')
  })
})
