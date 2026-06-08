import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion, type Transition } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import type { PassportData } from '../../lib/passport'
import { TRAIT_KEYS, type TraitKey, type Traits } from '../../lib/traits'
import { fitNameToWidth, whenDisplayFontReady } from './exportPassport'
import './passport.css'

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

// ease-out-expo — confident deceleration, no bounce (DESIGN.md motion law).
const EASE = [0.16, 1, 0.3, 1] as const
const ZERO_TRAITS = Object.fromEntries(TRAIT_KEYS.map((k) => [k, 0])) as Traits

// Choreography beats (seconds): flood, then the hero settles, then the data
// band, then the trait count-up, then the peak bloom.
const T = { flood: 0.05, kicker: 0.5, name: 0.62, verdict: 0.84, traits: 1.0, stub: 1.2, peak: 1.4 }

/**
 * Size the nation name to span its container on one line, masthead-style.
 * Re-fits on container resize and once the display font has loaded.
 */
function useFitText(text: string) {
  const ref = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => fitNameToWidth(el)
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement ?? el)
    // Re-fit once Anton is actually loaded (fonts.ready alone can fire early).
    whenDisplayFontReady().then(fit)
    return () => ro.disconnect()
  }, [text])
  return ref
}

/** Sparse gold-foil burst, reserved for rare/legendary picks. */
async function fireFoil(legendary: boolean) {
  const confetti = (await import('canvas-confetti')).default
  const colors = ['#e8c87a', '#f4efe6', '#d4af6a']
  const base = {
    colors,
    disableForReducedMotion: true,
    scalar: 0.9,
    gravity: 1,
    ticks: 130,
    startVelocity: 26,
  }
  confetti({ ...base, particleCount: legendary ? 48 : 30, spread: 58, origin: { y: 0.52 } })
  if (legendary) {
    confetti({ ...base, particleCount: 18, angle: 60, spread: 50, origin: { x: 0.1, y: 0.6 } })
    confetti({ ...base, particleCount: 18, angle: 120, spread: 50, origin: { x: 0.9, y: 0.6 } })
  }
}

interface Props {
  passport: PassportData
  /** Play the cinematic reveal on mount. Off = static (revisit / export). */
  reveal?: boolean
  className?: string
}

export function SupporterPassport({ passport, reveal = false, className }: Props) {
  const { nation, nickname, verdict, traits, group, supporterNumber, rarity, duotone } = passport
  const nameRef = useFitText(nation.name)
  const reducedMotion = useReducedMotion()
  const animate = reveal && !reducedMotion

  // Traits count up from zero on reveal; otherwise show final values at once.
  const [shownTraits, setShownTraits] = useState<Traits>(animate ? ZERO_TRAITS : traits)
  useEffect(() => {
    if (!animate) { setShownTraits(traits); return }
    const id = setTimeout(() => setShownTraits(traits), T.traits * 1000)
    return () => clearTimeout(id)
  }, [animate, traits])

  // Foil confetti at the peak, rare/legendary only.
  useEffect(() => {
    if (!animate || rarity === 'common') return
    const id = setTimeout(() => fireFoil(rarity === 'legendary'), T.peak * 1000)
    return () => clearTimeout(id)
  }, [animate, rarity])

  const style = {
    '--nation-primary': duotone.primary,
    '--nation-deep': duotone.deep,
    '--nation-glow': duotone.glow,
  } as CSSProperties

  // initial={false} mounts at the target state with no animation (static path).
  const rise = (delay: number): Transition | undefined =>
    animate ? { duration: 0.7, ease: EASE, delay } : undefined
  const from = (y = 18) => (animate ? { opacity: 0, y } : false)

  return (
    <article
      className={`passport passport--${rarity}${className ? ` ${className}` : ''}`}
      style={style}
      data-rarity={rarity}
      aria-label={`Supporter passport: ${nation.name}, the ${nickname}`}
    >
      <motion.div
        className="passport__bg"
        aria-hidden
        initial={animate ? { opacity: 0, scale: 1.08 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={animate ? { duration: 0.7, ease: EASE, delay: T.flood } : undefined}
      />
      <div className="passport__grain" aria-hidden />
      <div className="passport__vignette" aria-hidden />
      <motion.div
        className="passport__bloom"
        aria-hidden
        initial={false}
        animate={animate ? { opacity: [0, 0.7, 0], scale: [0.6, 1.35] } : { opacity: 0 }}
        transition={animate ? { duration: 1.2, ease: EASE, delay: T.peak } : undefined}
      />
      {rarity !== 'common' && <div className="passport__foil" aria-hidden />}

      <div className="passport__content">
        <motion.header
          className="passport__top"
          initial={from(8)}
          animate={{ opacity: 1, y: 0 }}
          transition={rise(0.15)}
        >
          <span className="passport__brand">Bandwagon</span>
          <span className="passport__rarity">{RARITY_LABEL[rarity]}</span>
        </motion.header>

        <div className="passport__hero">
          <motion.span
            className="passport__kicker"
            initial={from(12)}
            animate={{ opacity: 1, y: 0 }}
            transition={rise(T.kicker)}
          >
            {nickname}
          </motion.span>
          <motion.h1
            className="passport__name"
            ref={nameRef}
            initial={from(20)}
            animate={{ opacity: 1, y: 0 }}
            transition={rise(T.name)}
          >
            {nation.name}
          </motion.h1>
          <motion.p
            className="passport__verdict"
            initial={from(14)}
            animate={{ opacity: 1, y: 0 }}
            transition={rise(T.verdict)}
          >
            {verdict}
          </motion.p>
        </div>

        <motion.div
          className="passport__traits"
          role="list"
          aria-label="Supporter traits"
          initial={from(14)}
          animate={{ opacity: 1, y: 0 }}
          transition={rise(T.traits)}
        >
          {TRAIT_KEYS.map((k) => (
            <span className="trait" role="listitem" key={k}>
              <span className="trait__val">
                <NumberFlow value={shownTraits[k]} />
              </span>
              <span className="trait__label">{TRAIT_LABEL[k]}</span>
            </span>
          ))}
        </motion.div>

        <motion.footer
          className="passport__stub"
          initial={from(14)}
          animate={{ opacity: 1, y: 0 }}
          transition={rise(T.stub)}
        >
          <span className="passport__flag" aria-hidden>{nation.flagEmoji}</span>
          <span className="stub__field"><b>No.</b>{supporterNumber.toLocaleString()}</span>
          <span className="stub__field"><b>Grp</b>{group}</span>
          <span className="passport__url">bandwagon.app</span>
        </motion.footer>
      </div>
    </article>
  )
}
