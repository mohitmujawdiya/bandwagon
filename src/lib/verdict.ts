// Templated fallback verdict. Pure, deterministic, $0, and always on-brand:
// this is what renders when the Haiku call is slow, fails, or is switched off.
// Voice: cinematic, welcoming, audacious, dry. No em dashes (brand rule).

import type { Nation } from '../data/types'
import type { QuizAnswers } from './assign'

type Bank = readonly string[]

const OPENERS: Record<string, Bank> = {
  heritage: [
    'Some teams you pick. This one picked you.',
    'Blood was always going to win this one.',
    'Your roots had a flag ready.',
  ],
  underdogLover: [
    'You came for the long shot.',
    'You back the team nobody circles.',
    'Romance over odds. Always.',
  ],
  juggernautLover: [
    'You came to win, and you said so.',
    'No apologies for backing greatness.',
    'You like your football with a trophy cabinet.',
  ],
  playstyle: [
    'You wanted a team that plays your way.',
    'Style first. You were clear about that.',
    'You picked a way to play, then found a country doing it.',
  ],
  region: [
    'Your compass only pointed one way.',
    'You knew which corner of the world to face.',
    'Geography, meet destiny.',
  ],
  energy: [
    'You match their pulse.',
    'Same frequency, same noise.',
    'You move the way they do.',
  ],
  default: [
    'The draw fell, and here you are.',
    'No roots, no rules. Just a flag worth raising.',
    'Forty-eight teams. This is the one with your name on it.',
  ],
}

// Nicknames are heterogeneous (English "The Atlas Lions", foreign "La Familia"
// / "Les Bleus", bare "Samurai Blue"), so templates use the nickname as a
// standalone proper noun and never prepend "the" (which would double up).
function nationLines(n: Nation): Bank {
  if (n.underdogScore < 25) {
    return [
      `Meet ${n.nickname}. ${n.name}, and all the weight of the shirt.`,
      `${n.name}. ${n.nickname}, royalty, and they expect to be treated like it.`,
      `${n.nickname}: a team that never asks if it belongs.`,
    ]
  }
  if (n.underdogScore <= 60) {
    return [
      `${n.name}. ${n.nickname}, dangerous and they know it.`,
      `Say hello to ${n.nickname}. ${n.name} ruin tournaments for a living.`,
      `${n.nickname}: the team nobody wants to draw.`,
    ]
  }
  return [
    `${n.nickname}: the team the brackets forgot. Perfect.`,
    `${n.nickname}. ${n.name} are here to scare somebody.`,
    `${n.name}. ${n.nickname}, and the upset already has a name.`,
  ]
}

// Deterministic FNV-1a hash -> [0, 1). Local copy keeps verdict self-contained.
function hash01(input: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h / 0xffffffff
}

function pick(bank: Bank, seed: string): string {
  return bank[Math.floor(hash01(seed) * bank.length) % bank.length]
}

/** Which answer most defines this match: the opener leans into it. */
function dominantReason(answers: QuizAnswers): keyof typeof OPENERS {
  if (answers.heritage) return 'heritage'
  if (answers.underdog > 0) return 'underdogLover'
  if (answers.underdog < 0) return 'juggernautLover'
  if (answers.playstyle) return 'playstyle'
  if (answers.region) return 'region'
  if (answers.energy) return 'energy'
  return 'default'
}

/**
 * Assemble a 1-2 sentence verdict for the passport. Seeded by the full answer
 * set + nation code, so two friends with the same nation can read differently
 * while any one person's result is stable.
 */
export function buildVerdict(nation: Nation, answers: QuizAnswers): string {
  const seed = JSON.stringify(answers) + nation.code
  const opener = pick(OPENERS[dominantReason(answers)], seed + 'op')
  const nationLine = pick(nationLines(nation), seed + 'nat')

  let verdict = `${opener} ${nationLine}`

  const star = nation.stars[0]
  if (star) {
    const starTag = ` Eyes on ${star}.`
    if (verdict.length + starTag.length <= 260) verdict += starTag
  }

  return verdict
}
