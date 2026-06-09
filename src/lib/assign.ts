// Deterministic nation assignment. No AI: a pure scoring function over the
// static dataset, plus a stable tiebreak so the field spreads instead of
// funnelling everyone to Brazil. Same answers in => same nation out.

import type { Nation, Playstyle, Energy, HeritageKey, Archetype } from '../data/types'
import { NATIONS } from '../data/nations'

export interface QuizAnswers {
  /** Geography/roots, or null for a pure newcomer. When set, dominates the match.
   * A geography option can cover several keys (e.g. all of Europe), hence the array. */
  heritage: HeritageKey | HeritageKey[] | null
  /** -2 (love juggernauts) .. +2 (love underdogs). 0 = no preference. */
  underdog: number
  playstyle: Playstyle | null
  /** Narrative archetype from "how does your World Cup end?" — the prestige axis
   * that tells favorites from minnows (so it's what makes the giants reachable). */
  archetype: Archetype | null
  /** A giant the user would love to see beaten; boosts that giant's rivals. */
  rivalCode: string | null
  energy: Energy | null
}

/** Normalize a "value | value[] | null" answer to a plain array. */
function asArray<T>(v: T | T[] | null | undefined): T[] {
  return v == null ? [] : Array.isArray(v) ? v : [v]
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

// Heritage/geography is intentionally an order of magnitude above everything
// else: if you tell us where you're from, that decides the pool and the rest
// only spreads within it. Archetype is the next-strongest because it's the only
// signal that tells a favorite from a minnow. `jitter` is a small continuous
// term (not just an exact-tie break) so near-equal nations split across users
// instead of one always winning — that's what gives the field its spread.
const WEIGHT = {
  heritage: 1000,
  archetype: 75,
  playstyle: 45,
  rival: 40,
  underdog: 30,
  energy: 25,
  jitter: 12,
} as const

/** Pure preference score for one nation against one set of answers. */
export function scoreNation(nation: Nation, answers: QuizAnswers): number {
  let score = 0

  const heritageKeys = asArray(answers.heritage)
  if (heritageKeys.length && nation.heritageTags.some((t) => heritageKeys.includes(t))) {
    score += WEIGHT.heritage
  }

  if (answers.underdog !== 0) {
    // Both normalized to [-1, 1]; product is positive when the user's taste and
    // the nation's underdog-ness agree, negative when they clash.
    const nationNorm = (nation.underdogScore - 50) / 50
    const answerNorm = answers.underdog / 2
    score += WEIGHT.underdog * answerNorm * nationNorm
  }

  if (answers.archetype && nation.archetype === answers.archetype) score += WEIGHT.archetype
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
    .map((nation) => {
      const score = scoreNation(nation, answers)
      // Jitter is added to the ranking key (not the reported score) so near-equal
      // nations split across users; the winner stays stable for a given answer set.
      const sortKey = score + WEIGHT.jitter * hash01(seed + nation.code)
      return { nation, score, sortKey }
    })
    .sort((a, b) => b.sortKey - a.sortKey)
    .map(({ nation, score }) => ({ nation, score }))

  return { nation: ranked[0].nation, score: ranked[0].score, ranked }
}
