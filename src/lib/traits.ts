// Supporter traits: the five numerals that count up on the passport. Derived
// deterministically from the nation's character (energy, playstyle, pedigree)
// with a small nudge from the user's own answers, so the same nation reads
// consistently while still feeling a touch personal.

import type { Nation, Energy, Playstyle } from '../data/types'
import type { QuizAnswers } from './assign'

export const TRAIT_KEYS = ['passion', 'loyalty', 'flair', 'grit', 'banter'] as const
export type TraitKey = (typeof TRAIT_KEYS)[number]
export type Traits = Record<TraitKey, number>

const FLAIR_PLAY: Playstyle[] = ['flair', 'technical', 'total-football', 'attacking']
const GRIT_PLAY: Playstyle[] = ['physical', 'defensive', 'counter', 'direct']

const PASSION_ENERGY: Energy[] = ['passionate', 'fearless', 'joyful']
const GRIT_ENERGY: Energy[] = ['gritty', 'fearless', 'disciplined']
const BANTER_ENERGY: Energy[] = ['chaotic', 'joyful', 'fearless']

// Which trait each answerable energy / playstyle feeds, for the personal nudge.
const ENERGY_TRAIT: Partial<Record<Energy, TraitKey>> = {
  passionate: 'passion', fearless: 'passion', joyful: 'banter', chaotic: 'banter',
  disciplined: 'loyalty', romantic: 'loyalty', gritty: 'grit', cool: 'loyalty',
}

function count<T>(have: readonly T[], want: readonly T[]): number {
  return have.filter((h) => want.includes(h)).length
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

export function computeTraits(nation: Nation, answers: QuizAnswers): Traits {
  const isGiant = nation.underdogScore < 30
  const isMinnow = nation.underdogScore > 70
  const warmRegion = nation.region === 'south-america' || nation.region === 'africa'

  const traits: Traits = {
    passion: clamp(
      46 + count(nation.energy, PASSION_ENERGY) * 13 + (warmRegion ? 12 : 0),
    ),
    loyalty: clamp(
      48 + (nation.energy.includes('disciplined') ? 16 : 0)
      + (nation.energy.includes('romantic') ? 10 : 0)
      + (isGiant ? 16 : isMinnow ? 6 : 11),
    ),
    flair: clamp(
      40 + count(nation.playstyles, FLAIR_PLAY) * 12 + (nation.energy.includes('joyful') ? 8 : 0),
    ),
    grit: clamp(
      40 + count(nation.playstyles, GRIT_PLAY) * 12 + count(nation.energy, GRIT_ENERGY) * 6,
    ),
    banter: clamp(
      38 + count(nation.energy, BANTER_ENERGY) * 12
      + (isMinnow ? 14 : isGiant ? 6 : 10)
      + (nation.rivals.length > 0 ? 8 : 0),
    ),
  }

  // Personal nudge: the user's own taste lifts the trait it speaks to.
  if (answers.energy && ENERGY_TRAIT[answers.energy]) {
    const key = ENERGY_TRAIT[answers.energy]!
    traits[key] = clamp(traits[key] + 6)
  }
  if (answers.playstyle && FLAIR_PLAY.includes(answers.playstyle)) {
    traits.flair = clamp(traits.flair + 6)
  } else if (answers.playstyle && GRIT_PLAY.includes(answers.playstyle)) {
    traits.grit = clamp(traits.grit + 6)
  }

  return traits
}
