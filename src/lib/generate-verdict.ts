// Verdict orchestration: try the AI writer (Claude Haiku via DeepSpace), but
// treat it strictly as seasoning. Any failure, timeout, or off-brand output
// falls back to the deterministic template. The AI is never load-bearing.
//
// The writer is dependency-injected so this logic is testable without a network
// and decoupled from where it runs (server action or worker route). The real
// DeepSpace-backed writer lives in makeHaikuVerdictWriter (worker-only).

import type { Nation } from '../data/types'
import { NATION_BY_CODE } from '../data/nations'
import type { QuizAnswers } from './assign'
import { buildVerdict } from './verdict'

export type VerdictWriter = (prompt: { system: string; user: string }) => Promise<string>

export interface GenerateVerdictResult {
  text: string
  source: 'ai' | 'fallback'
}

const MAX_LEN = 280

/** Gate AI output against the brand rules before it ever reaches a passport. */
export function isUsableVerdict(text: string, nation: Nation): boolean {
  const t = text.trim()
  if (!t) return false
  if (t.length > MAX_LEN) return false
  if (t.includes('—') || t.includes('--')) return false
  return t.includes(nation.name) || t.includes(nation.nickname)
}

function describeAnswers(answers: QuizAnswers): string {
  const bits: string[] = []
  const heritage = Array.isArray(answers.heritage) ? answers.heritage : answers.heritage ? [answers.heritage] : []
  const region = Array.isArray(answers.region) ? answers.region : answers.region ? [answers.region] : []
  if (heritage.length) bits.push(`roots: ${heritage.join(', ')}`)
  if (answers.underdog > 0) bits.push('loves an underdog story')
  if (answers.underdog < 0) bits.push('wants a juggernaut')
  if (answers.playstyle) bits.push(`football taste: ${answers.playstyle}`)
  if (region.length) bits.push(`pulled toward: ${region.join(', ')}`)
  if (answers.energy) bits.push(`personality: ${answers.energy}`)
  if (answers.rivalCode && NATION_BY_CODE[answers.rivalCode]) {
    bits.push(`would love to see ${NATION_BY_CODE[answers.rivalCode].name} beaten`)
  }
  return bits.length ? bits.join('; ') : 'a curious newcomer with no strong leanings'
}

export function buildVerdictPrompt(nation: Nation, answers: QuizAnswers): { system: string; user: string } {
  const system = [
    'You are the voice of Bandwagon, a World Cup supporter-passport app.',
    'Write ONE verdict line (1 to 2 sentences, under 240 characters) telling a fan why this nation is THEIR team for the World Cup.',
    'Voice: cinematic, welcoming, audacious, with dry wit. Second person. Make a newcomer feel like an instant insider, never clueless. Every nation is hero-worthy; dignify underdogs and giants alike.',
    'Hard rules: name the nation. Do NOT use em dashes or double hyphens. No hashtags, no emoji, no surrounding quotes. Output only the line.',
  ].join(' ')

  const tier = nation.underdogScore < 25 ? 'a tournament favourite'
    : nation.underdogScore <= 60 ? 'a dangerous outsider'
    : 'a genuine underdog'

  const user = [
    `Nation: ${nation.name} (nickname: ${nation.nickname}).`,
    `Status: ${tier}. Group ${nation.group}. Star players: ${nation.stars.join(', ')}.`,
    `The fan: ${describeAnswers(answers)}.`,
    'Write their verdict line.',
  ].join('\n')

  return { system, user }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('verdict timeout')), ms)
    p.then(
      (v) => { clearTimeout(timer); resolve(v) },
      (e) => { clearTimeout(timer); reject(e) },
    )
  })
}

export async function generateVerdict(
  nation: Nation,
  answers: QuizAnswers,
  opts: { writer?: VerdictWriter; timeoutMs?: number } = {},
): Promise<GenerateVerdictResult> {
  const fallback = (): GenerateVerdictResult => ({ text: buildVerdict(nation, answers), source: 'fallback' })
  if (!opts.writer) return fallback()

  try {
    const raw = await withTimeout(opts.writer(buildVerdictPrompt(nation, answers)), opts.timeoutMs ?? 4000)
    const text = raw.trim()
    return isUsableVerdict(text, nation) ? { text, source: 'ai' } : fallback()
  } catch {
    return fallback()
  }
}
