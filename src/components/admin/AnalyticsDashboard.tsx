import { useQuery } from 'deepspace'
import { NATION_BY_CODE } from '../../data/nations'
import { duotone } from '../../data/types'
import { rarityOf, type RarityTier } from '../../lib/passport'
import type { PassportRecord } from '../../lib/passport-record'

interface NationStat {
  nationCode: string
  count: number
}

const RARITY_LABEL: Record<RarityTier, string> = {
  common: 'Common',
  rare: 'Rare',
  legendary: 'Legendary',
}

function timeAgo(iso: string | number | undefined): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000))
  if (secs < 60) return 'just now'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

/**
 * Admin analytics, derived entirely from `nationStats` (one row per nation, so
 * cheap) plus a small recent-passports query. No need to read every passport.
 */
export function AnalyticsDashboard() {
  const stats = useQuery<NationStat>('nationStats')
  const recent = useQuery<PassportRecord>('passports', {
    orderBy: 'createdAt',
    orderDir: 'desc',
    limit: 12,
  })

  const rows = stats.records
    .map((r) => ({ count: r.data.count ?? 0, nation: NATION_BY_CODE[r.data.nationCode] }))
    .filter((r) => r.nation && r.count > 0)

  const total = rows.reduce((sum, r) => sum + r.count, 0)
  const leaderboard = [...rows].sort((a, b) => b.count - a.count)
  const max = leaderboard[0]?.count ?? 1
  const nationsAdopted = rows.length

  const rarity: Record<RarityTier, number> = { common: 0, rare: 0, legendary: 0 }
  for (const r of rows) rarity[rarityOf(r.nation)] += r.count

  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0)

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <header className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bandwagon · Admin
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-tight sm:text-6xl">
            The Numbers
          </h1>
        </header>

        {/* Headline stat */}
        <section className="mb-16 border-b border-border pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Total supporters
          </p>
          <p className="mt-3 font-display text-7xl leading-none tabular-nums sm:text-8xl">
            {total.toLocaleString()}
          </p>
          <p className="mt-4 text-muted-foreground">
            across <span className="text-foreground">{nationsAdopted}</span> of 48 nations
            {rarity.legendary > 0 && (
              <>
                {' · '}
                <span className="text-foreground">{rarity.legendary.toLocaleString()}</span> legendary
              </>
            )}
          </p>
        </section>

        {total === 0 ? (
          <p className="text-muted-foreground">No supporters yet. The bandwagon is empty, for now.</p>
        ) : (
          <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr]">
            {/* Leaderboard */}
            <section>
              <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                The bandwagons
              </h2>
              <ol className="space-y-3.5">
                {leaderboard.map((r, i) => {
                  const color = duotone(r.nation.accent).primary
                  return (
                    <li key={r.nation.code} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                      <div>
                        <div className="mb-1.5 flex items-baseline justify-between gap-3">
                          <span className="truncate text-sm font-semibold">{r.nation.name}</span>
                          <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                            {r.count.toLocaleString()} · {pct(r.count)}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-card">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.max(3, (r.count / max) * 100)}%`, background: color }}
                          />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>

            {/* Side: rarity + recent */}
            <div className="space-y-14">
              <section>
                <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  By rarity
                </h2>
                <dl className="space-y-3">
                  {(['legendary', 'rare', 'common'] as RarityTier[]).map((tier) => (
                    <div key={tier} className="flex items-baseline justify-between border-b border-border pb-2">
                      <dt className="text-sm text-muted-foreground">{RARITY_LABEL[tier]}</dt>
                      <dd className="font-mono text-sm tabular-nums">
                        {rarity[tier].toLocaleString()}{' '}
                        <span className="text-muted-foreground">· {pct(rarity[tier])}%</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Just joined
                </h2>
                <ul className="space-y-3">
                  {recent.records.map((r) => {
                    const nation = NATION_BY_CODE[r.data.nationCode]
                    if (!nation) return null
                    return (
                      <li key={r.recordId} className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="truncate">
                          <span aria-hidden>{nation.flagEmoji}</span>{' '}
                          <span className="font-semibold">{nation.name}</span>
                          <span className="text-muted-foreground"> · No. {r.data.supporterNumber}</span>
                        </span>
                        <span className="shrink-0 font-mono text-xs text-muted-foreground">
                          {timeAgo(r.createdAt)}
                        </span>
                      </li>
                    )
                  })}
                  {recent.records.length === 0 && (
                    <li className="text-sm text-muted-foreground">Nothing yet.</li>
                  )}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
