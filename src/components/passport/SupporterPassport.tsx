import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import type { PassportData } from '../../lib/passport'
import { TRAIT_KEYS, type TraitKey } from '../../lib/traits'
import './passport.css'

/**
 * Size the nation name to span its container on one line, masthead-style, so
 * every name (short or long) fills the poster width with the same presence.
 * Re-fits on container resize and once the display font has loaded.
 */
function useFitText(text: string) {
  const ref = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      const parent = el.parentElement
      if (!parent) return
      const cs = getComputedStyle(parent)
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      if (avail <= 0) return
      el.style.fontSize = '240px'
      const natural = el.scrollWidth
      if (natural > 0) el.style.fontSize = `${Math.min(240, (avail / natural) * 240)}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement ?? el)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready.then(fit).catch(() => {})
    return () => ro.disconnect()
  }, [text])
  return ref
}

const TRAIT_LABEL: Record<TraitKey, string> = {
  passion: 'Passion',
  loyalty: 'Loyalty',
  flair: 'Flair',
  grit: 'Grit',
  banter: 'Banter',
}

const RARITY_LABEL = {
  common: 'Supporter',
  rare: 'Rare Pick',
  legendary: 'Legendary Pick',
} as const

interface Props {
  passport: PassportData
  className?: string
}

/**
 * The drenched 9:16 Supporter Passport. Presentational and self-contained: it
 * reads only PassportData and sets the per-nation duotone vars inline. Static
 * here; the reveal choreography wraps this in a later pass.
 */
export function SupporterPassport({ passport, className }: Props) {
  const { nation, nickname, verdict, traits, group, supporterNumber, rarity, duotone } = passport
  const nameRef = useFitText(nation.name)

  const style = {
    '--nation-primary': duotone.primary,
    '--nation-deep': duotone.deep,
    '--nation-glow': duotone.glow,
  } as CSSProperties

  return (
    <article
      className={`passport passport--${rarity}${className ? ` ${className}` : ''}`}
      style={style}
      data-rarity={rarity}
      aria-label={`Supporter passport: ${nation.name}, the ${nickname}`}
    >
      <div className="passport__bg" aria-hidden />
      <div className="passport__grain" aria-hidden />
      <div className="passport__vignette" aria-hidden />
      {rarity !== 'common' && <div className="passport__foil" aria-hidden />}

      <div className="passport__content">
        <header className="passport__top">
          <span className="passport__brand">Bandwagon</span>
          <span className="passport__rarity">{RARITY_LABEL[rarity]}</span>
        </header>

        <div className="passport__hero">
          <span className="passport__kicker">{nickname}</span>
          <h1 className="passport__name" ref={nameRef}>{nation.name}</h1>
          <p className="passport__verdict">{verdict}</p>
        </div>

        <div className="passport__traits" role="list" aria-label="Supporter traits">
          {TRAIT_KEYS.map((k) => (
            <span className="trait" role="listitem" key={k}>
              <span className="trait__val">{traits[k]}</span>
              <span className="trait__label">{TRAIT_LABEL[k]}</span>
            </span>
          ))}
        </div>

        <footer className="passport__stub">
          <span className="passport__flag" aria-hidden>{nation.flagEmoji}</span>
          <span className="stub__field"><b>No.</b>{supporterNumber.toLocaleString()}</span>
          <span className="stub__field"><b>Grp</b>{group}</span>
          <span className="passport__url">bandwagon.app</span>
        </footer>
      </div>
    </article>
  )
}
