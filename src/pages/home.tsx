import { Link } from 'react-router-dom'
import { useQuery } from 'deepspace'
import NumberFlow from '@number-flow/react'
import { NATION_BY_CODE } from '../data/nations'
import { HeroPassport } from '../components/landing/HeroPassport'
import './home.css'

// The hero stack: a fanned pile of real, color-diverse nations (front to back).
const STACK = [
  { code: 'MEX', w: 60, x: -26, y: 8, rot: -9, z: 4 },
  { code: 'ARG', w: 58, x: 2, y: 0, rot: 4, z: 3 },
  { code: 'JPN', w: 56, x: 30, y: 12, rot: -4, z: 2 },
  { code: 'MAR', w: 56, x: 16, y: 30, rot: 12, z: 1 },
]

const STEPS = [
  { n: '1', title: 'Answer six questions', body: 'Vibe, not trivia. No wrong answers, only yours.' },
  { n: '2', title: 'Meet your nation', body: 'A real team, matched to you, drenched in its colors.' },
  { n: '3', title: 'Get your passport', body: "A poster you'll actually want to post. Then go adopt your bandwagon." },
]

// Below this, show an aspirational line instead of a small, unconvincing number.
const SOCIAL_MIN = 50

export default function Home() {
  const { records } = useQuery<{ nationCode: string; count: number }>('nationStats')
  const total = records.reduce((sum, r) => sum + (r.data.count ?? 0), 0)

  return (
    <div className="landing">
      <header className="landing__bar">
        <span className="landing__wordmark">
          <span className="landing__dot" aria-hidden />
          bandwagon
        </span>
      </header>

      <section className="hero">
        <div className="hero__text">
          <p className="hero__kicker">World Cup 2026 · 48 nations · one of them yours</p>
          <h1 className="hero__title">
            Find your
            <br />
            World Cup team
          </h1>
          <p className="hero__sub">
            Answer six quick questions and we'll hand you the nation you were always
            meant to support, plus a Supporter Passport worth posting.
          </p>
          <Link to="/quiz" className="cta">
            Find my team
          </Link>
          <p className="hero__proof" aria-live="polite">
            {total >= SOCIAL_MIN ? (
              <>
                <NumberFlow value={total} className="hero__proof-n" /> supporters and counting
              </>
            ) : (
              'Sixty seconds. No sign-up. Just your team.'
            )}
          </p>
        </div>

        <div className="hero__stage" aria-hidden>
          <div className="hero__bloom" />
          <div className="hero__stack">
            {STACK.map((s) => {
              const nation = NATION_BY_CODE[s.code]
              if (!nation) return null
              return (
                <HeroPassport
                  key={s.code}
                  nation={nation}
                  style={{
                    width: `${s.w}%`,
                    zIndex: s.z,
                    transform: `translate(${s.x}%, ${s.y}%) rotate(${s.rot}deg)`,
                  }}
                />
              )
            })}
          </div>
        </div>
      </section>

      <section className="how">
        <p className="how__eyebrow">Sixty seconds, start to share</p>
        <ol className="how__steps">
          {STEPS.map((step) => (
            <li key={step.n} className="how__step">
              <span className="how__num">{step.n}</span>
              <h3 className="how__step-title">{step.title}</h3>
              <p className="how__step-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="closing">
        <h2 className="closing__title">Your team is already in here.</h2>
        <Link to="/quiz" className="cta">
          Find my team
        </Link>
      </section>
    </div>
  )
}
