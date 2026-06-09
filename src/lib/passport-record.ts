// The stored passport shape (a DeepSpace `passports` record's data) and the
// helpers that bridge it to the presentational PassportData the UI renders.

import { NATION_BY_CODE } from '../data/nations'
import { duotone } from '../data/types'
import type { QuizAnswers } from './assign'
import type { PassportData, RarityTier } from './passport'
import type { Traits } from './traits'

export interface PassportRecord {
  /** Short, url-safe public id; the /p/[id] route loads by this field. */
  shareId: string
  nationCode: string
  nickname: string
  verdict: string
  /** 'ai' once Haiku is wired; 'fallback' for the template verdict. */
  verdictSource: 'ai' | 'fallback'
  traits: Traits
  rarity: RarityTier
  group: string
  supporterNumber: number
  quizAnswers: QuizAnswers
}

/** Rebuild the presentational PassportData from a stored record. */
export function passportFromRecord(record: PassportRecord): PassportData | null {
  const nation = NATION_BY_CODE[record.nationCode]
  if (!nation) return null
  return {
    nation,
    nickname: record.nickname,
    verdict: record.verdict,
    traits: record.traits,
    group: record.group,
    supporterNumber: record.supporterNumber,
    rarity: record.rarity,
    duotone: duotone(nation.accent),
  }
}

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/** A short, url-safe, collision-resistant id for a passport's public link. */
export function shortId(length = 10): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}
