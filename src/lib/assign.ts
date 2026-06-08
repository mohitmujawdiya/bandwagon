// Deterministic nation assignment. No AI: a pure scoring function over the
// static dataset, plus a stable tiebreak so the field spreads instead of
// funnelling everyone to Brazil. Same answers in => same nation out.

import type { Nation, Playstyle, Energy, HeritageKey, RegionPull } from '../data/types'
import { NATIONS } from '../data/nations'

export interface QuizAnswers {
  /** Roots, or null for a pure newcomer. When set, dominates the match. */
  heritage: HeritageKey | null
  /** -2 (love juggernauts) .. +2 (love underdogs). 0 = no preference. */
  underdog: number
  playstyle: Playstyle | null
  region: RegionPull | null
  /** A giant the user would love to see beaten; boosts that giant's rivals. */
  rivalCode: string | null
  energy: Energy | null
}

export interface RankedNation {
  nation: Nation
  score: number
}

export interface AssignmentResult {
  nation: Nation
  score: number
  /** Full ranking, highest first. Useful for debugging and future variety. */
  ranked: RankedNation[]
}

// Heritage is intentionally an order of magnitude above everything else: if you
// tell us your roots, that decides the nation and the rest only breaks ties
// within the matched set.
const WEIGHT = {
  heritage: 1000,
  region: 60,
  playstyle: 50,
  rival: 45,
  underdog: 40,
  energy: 30,
} as const

/** Pure preference score for one nation against one set of answers. */
export function scoreNation(nation: Nation, answers: QuizAnswers): number {
  let score = 0

  if (answers.heritage && nation.heritageTags.includes(answers.heritage)) {
    score += WEIGHT.heritage
  }

  if (answers.underdog !== 0) {
    // Both normalized to [-1, 1]; product is positive when the user's taste and
    // the nation's underdog-ness agree, negative when they clash.
    const nationNorm = (nation.underdogScore - 50) / 50
    const answerNorm = answers.underdog / 2
    score += WEIGHT.underdog * answerNorm * nationNorm
  }

  if (answers.region && nation.region === answers.region) score += WEIGHT.region
  if (answers.playstyle && nation.playstyles.includes(answers.playstyle)) score += WEIGHT.playstyle
  if (answers.energy && nation.energy.includes(answers.energy)) score += WEIGHT.energy
  if (answers.rivalCode && nation.rivals.includes(answers.rivalCode)) score += WEIGHT.rival

  return score
}

// Deterministic FNV-1a hash -> [0, 1). Seeds the tiebreak so equal-top nations
// are split by the full answer set: stable per user, varied across users.
function hash01(input: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h / 0xffffffff
}

export function assignNation(
  answers: QuizAnswers,
  nations: Nation[] = NATIONS,
): AssignmentResult {
  const seed = JSON.stringify(answers)
  const ranked = nations
    .map((nation) => ({
      nation,
      score: scoreNation(nation, answers),
      jitter: hash01(seed + nation.code),
    }))
    .sort((a, b) => {
      if (Math.abs(b.score - a.score) > 1e-9) return b.score - a.score
      return b.jitter - a.jitter
    })
    .map(({ nation, score }) => ({ nation, score }))

  return { nation: ranked[0].nation, score: ranked[0].score, ranked }
}
