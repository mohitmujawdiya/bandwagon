// The PassportData assembler: combines the engine (assignment, verdict, traits,
// duotone) into the single object the SupporterPassport component renders.
// A server can inject the Haiku verdict and the real supporter number; without
// them, it falls back to the template verdict and a deterministic placeholder.

import type { Nation, Duotone } from '../data/types'
import { duotone } from '../data/types'
import { assignNation, type QuizAnswers } from './assign'
import { buildVerdict } from './verdict'
import { computeTraits, type Traits } from './traits'

export type RarityTier = 'common' | 'rare' | 'legendary'

export interface PassportData {
  nation: Nation
  nickname: string
  verdict: string
  traits: Traits
  group: string
  supporterNumber: number
  rarity: RarityTier
  duotone: Duotone
}

export function rarityOf(nation: Nation): RarityTier {
  if (nation.underdogScore >= 90) return 'legendary'
  if (nation.underdogScore >= 70) return 'rare'
  return 'common'
}

function placeholderNumber(seed: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return (h % 48000) + 1
}

/** Assemble a passport for an already-chosen nation (preview, tests, server). */
export function assemblePassport(
  nation: Nation,
  answers: QuizAnswers,
  opts: { verdict?: string; supporterNumber?: number } = {},
): PassportData {
  return {
    nation,
    nickname: nation.nickname,
    verdict: opts.verdict ?? buildVerdict(nation, answers),
    traits: computeTraits(nation, answers),
    group: nation.group,
    supporterNumber: opts.supporterNumber ?? placeholderNumber(nation.code + JSON.stringify(answers)),
    rarity: rarityOf(nation),
    duotone: duotone(nation.accent),
  }
}

export function buildPassport(
  answers: QuizAnswers,
  opts: { verdict?: string; supporterNumber?: number } = {},
): PassportData {
  return assemblePassport(assignNation(answers).nation, answers, opts)
}
