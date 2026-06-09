import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { QUIZ, EMPTY_ANSWERS } from '../lib/quiz'
import type { QuizAnswers } from '../lib/assign'
import { useCreatePassport } from '../lib/use-create-passport'
import './quiz.css'

const EASE = [0.16, 1, 0.3, 1] as const
const SUSPENSE_MS = 2500

type Phase = 'quiz' | 'suspense' | 'error'

function mergePatches(patches: Partial<QuizAnswers>[]): QuizAnswers {
  return patches.reduce<QuizAnswers>((acc, p) => ({ ...acc, ...p }), { ...EMPTY_ANSWERS })
}

export default function Quiz() {
  const navigate = useNavigate()
  const createPassport = useCreatePassport()
  const reduced = useReducedMotion()

  const [step, setStep] = useState(0)
  const [patches, setPatches] = useState<Partial<QuizAnswers>[]>([])
  const [dir, setDir] = useState(1)
  const [phase, setPhase] = useState<Phase>('quiz')

  const total = QUIZ.length

  async function runReveal(answers: QuizAnswers) {
    setPhase('suspense')
    try {
      // Run creation and the labor-illusion loader together; wait for both so the
      // wait visibly "does work" (research: a visible effort reveal feels more
      // valuable) but never drags past the real work.
      const [shareId] = await Promise.all([
        createPassport(answers),
        new Promise((r) => setTimeout(r, SUSPENSE_MS)),
      ])
      navigate(`/p/${shareId}?new=1`)
    } catch {
      setPhase('error')
    }
  }

  function pick(patch: Partial<QuizAnswers>) {
    const next = [...patches.slice(0, step), patch]
    setPatches(next)
    setDir(1)
    if (step + 1 < total) setStep(step + 1)
    else runReveal(mergePatches(next))
  }

  function back() {
    if (step === 0) return
    setDir(-1)
    setStep(step - 1)
  }

  if (phase === 'suspense') return <Suspense />
  if (phase === 'error') return <ErrorState onRetry={() => runReveal(mergePatches(patches))} />

  const q = QUIZ[step]
  const slide = reduced ? 0 : 36

  return (
    <div className="quiz">
      <header className="quiz__top">
        <button className="quiz__back" onClick={back} disabled={step === 0} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="quiz__progress" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
          <div className="quiz__progress-fill" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <span className="quiz__count">{step + 1} / {total}</span>
      </header>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          className="quiz__screen"
          custom={dir}
          initial={{ opacity: 0, x: dir * slide }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -slide }}
          transition={{ duration: 0.34, ease: EASE }}
        >
          <span className="quiz__kicker">{q.kicker}</span>
          <h1 className="quiz__prompt">{q.prompt}</h1>

          <div className="quiz__options">
            {q.options.map((o, i) => (
              <motion.button
                key={o.label}
                className="quiz__option"
                onClick={() => pick(o.patch)}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.06 + i * 0.045 }}
              >
                {o.flag && <span className="quiz__option-flag" aria-hidden>{o.flag}</span>}
                <span>{o.label}</span>
              </motion.button>
            ))}
          </div>

          {q.skippable && (
            <button className="quiz__skip" onClick={() => pick({})}>
              I'm new here, surprise me
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Labor-illusion loader: honest staged lines over a progressive poster skeleton. */
function Suspense() {
  const lines = ['Reading your answers', 'Finding your nation', 'Printing your passport']
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => Math.min(x + 1, lines.length - 1)), SUSPENSE_MS / 3)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="quiz quiz--center">
      <div className="quiz__loader">
        <div className="quiz__skeleton" aria-hidden />
        <p className="quiz__loader-line" aria-live="polite">
          {lines[i]}<span className="quiz__dots" aria-hidden />
        </p>
      </div>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="quiz quiz--center">
      <div className="quiz__error">
        <h1 className="quiz__prompt">That one got away.</h1>
        <p className="quiz__error-text">We couldn't print your passport just now. Give it another go.</p>
        <button className="quiz__retry" onClick={onRetry}>Try again</button>
      </div>
    </div>
  )
}
