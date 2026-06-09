import { useCallback, useRef } from 'react'
import { useMutations, useQuery } from 'deepspace'
import { assignNation, type QuizAnswers } from './assign'
import { buildVerdict } from './verdict'
import { computeTraits } from './traits'
import { rarityOf } from './passport'
import { shortId, type PassportRecord } from './passport-record'

interface NationStat {
  nationCode: string
  count: number
}

/**
 * Create and persist a passport from quiz answers (client-side, so anonymous
 * users can do it). Bumps the per-nation supporter counter, then writes the
 * passport, and returns its shareId for navigation to /p/[shareId].
 *
 * MVP verdict is the deterministic template (verdictSource 'fallback'); the
 * Haiku upgrade is a later drop-in (it needs an unauthenticated owner-billed
 * route, decided separately).
 */
export function useCreatePassport() {
  const passports = useMutations<PassportRecord>('passports')
  const stats = useMutations<NationStat>('nationStats')
  const { records: statRecords } = useQuery<NationStat>('nationStats')

  // Read the latest counters inside the async handler without re-creating it.
  const statsRef = useRef(statRecords)
  statsRef.current = statRecords

  return useCallback(
    async (answers: QuizAnswers): Promise<string> => {
      const { nation } = assignNation(answers)

      // *Confirmed: wait for the server to persist before we navigate, so the
      // /p/[id] page (even on a fresh load) finds the passport. The suspense
      // loader hides this round-trip.
      const existing = statsRef.current.find((r) => r.data.nationCode === nation.code)
      const supporterNumber = (existing?.data.count ?? 0) + 1
      if (existing) await stats.putConfirmed(existing.recordId, { count: supporterNumber })
      else await stats.createConfirmed({ nationCode: nation.code, count: supporterNumber })

      const shareId = shortId()
      await passports.createConfirmed({
        shareId,
        nationCode: nation.code,
        nickname: nation.nickname,
        verdict: buildVerdict(nation, answers),
        verdictSource: 'fallback',
        traits: computeTraits(nation, answers),
        rarity: rarityOf(nation),
        group: nation.group,
        supporterNumber,
        quizAnswers: answers,
      })
      return shareId
    },
    [passports, stats],
  )
}
