import type { CSSProperties } from 'react'
import type { Nation } from '../../data/types'
import { duotone } from '../../data/types'

/**
 * A compact, drenched mini-poster for the landing hero stack. Shows the essence
 * of a real Supporter Passport (nation duotone, grain, the towering name) without
 * the full data band, so a fanned stack of them reads as posters, not clutter.
 * Decorative: the headline carries the meaning, so this is aria-hidden upstream.
 */
export function HeroPassport({ nation, style }: { nation: Nation; style?: CSSProperties }) {
  const d = duotone(nation.accent)
  return (
    <article
      className="herocard"
      style={
        {
          '--p': d.primary,
          '--deep': d.deep,
          '--glow': d.glow,
          ...style,
        } as CSSProperties
      }
    >
      <span className="herocard__mark">Supporter</span>
      <div className="herocard__foot">
        <span className="herocard__kicker">{nation.nickname}</span>
        <h3 className="herocard__name">{nation.name}</h3>
      </div>
    </article>
  )
}
