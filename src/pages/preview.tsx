import { useMemo } from 'react'
import { NATION_BY_CODE } from '../data/nations'
import { assemblePassport } from '../lib/passport'
import { SupporterPassport } from '../components/passport/SupporterPassport'
import type { QuizAnswers } from '../lib/assign'

const NEUTRAL: QuizAnswers = {
  heritage: null, underdog: 0, playstyle: null, region: null, rivalCode: null, energy: null,
}

// Hue spread + rarity + the longest names, to validate duotone and name fitting.
const CODES = ['ARG', 'BRA', 'MEX', 'MAR', 'FRA', 'CIV', 'GHA', 'CUW', 'SUI', 'NED', 'KSA', 'BIH']

/** Dev-only gallery for iterating the passport visual. Real /p/[id] comes later. */
export default function Preview() {
  const single = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('code')?.toUpperCase()
    : null

  const passports = useMemo(
    () => CODES.map((c) => assemblePassport(NATION_BY_CODE[c], NEUTRAL)),
    [],
  )

  if (single && NATION_BY_CODE[single]) {
    return (
      <div className="flex justify-center px-4 py-4">
        <div className="w-[368px] max-w-full">
          <SupporterPassport passport={assemblePassport(NATION_BY_CODE[single], NEUTRAL)} />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10">
      <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Supporter Passport / preview
      </p>
      <div className="flex flex-wrap justify-center gap-7">
        {passports.map((p) => (
          <div key={p.nation.code} className="w-[360px]">
            <SupporterPassport passport={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
