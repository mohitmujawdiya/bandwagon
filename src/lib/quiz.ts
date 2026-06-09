// The 6-question quiz. Each option carries a `patch` that merges into the
// building QuizAnswers, which the assignment engine scores. Copy is Bandwagon's
// voice: warm, confident, a little cheeky, clear over clever (per the research:
// identity not trivia, easy low-effort taps, every option a flattering vibe).

import type { QuizAnswers } from './assign'

export interface QuizOption {
  label: string
  /** Optional flag/emoji shown before the label (rivalry question). */
  flag?: string
  patch: Partial<QuizAnswers>
}

export interface QuizQuestion {
  /** Short mono kicker, e.g. "Your roots". */
  kicker: string
  prompt: string
  options: QuizOption[]
  /** Roots is the only optional one (newcomers tap "surprise me"). */
  skippable?: boolean
}

export const QUIZ: QuizQuestion[] = [
  {
    kicker: 'Match-day energy',
    prompt: "It's match day. What's the feeling in your chest?",
    options: [
      { label: 'Heart on my sleeve, screaming', patch: { energy: 'passionate' } },
      { label: 'Cool head, ice in the veins', patch: { energy: 'cool' } },
      { label: 'Here for the pure joy', patch: { energy: 'joyful' } },
      { label: 'Bring on the beautiful chaos', patch: { energy: 'chaotic' } },
    ],
  },
  {
    kicker: 'Your roots',
    prompt: 'Any roots already pulling you toward a flag?',
    skippable: true,
    options: [
      { label: 'Mexico & Latin America', patch: { heritage: ['mexico', 'central-america', 'south-america', 'brazil'] } },
      { label: 'The Caribbean', patch: { heritage: ['caribbean'] } },
      { label: 'Africa', patch: { heritage: ['west-africa', 'north-africa', 'central-africa', 'southern-africa', 'arab'] } },
      { label: 'Europe', patch: { heritage: ['western-europe', 'southern-europe', 'eastern-europe', 'balkans', 'nordic'] } },
      { label: 'Asia & the Middle East', patch: { heritage: ['east-asia', 'central-asia', 'middle-east', 'arab'] } },
    ],
  },
  {
    kicker: 'Your kind of glory',
    prompt: 'What kind of glory are you here for?',
    options: [
      { label: 'The underdog shocking the world', patch: { underdog: 2 } },
      { label: 'A dark horse with a story', patch: { underdog: 1 } },
      { label: 'A proper heavyweight', patch: { underdog: -2 } },
      { label: "Honestly, just a team that's fun", patch: { underdog: 0 } },
    ],
  },
  {
    kicker: 'Style of play',
    prompt: 'How should your team play?',
    options: [
      { label: 'Total football, all flow', patch: { playstyle: 'total-football' } },
      { label: 'Flair, flicks, and magic', patch: { playstyle: 'flair' } },
      { label: 'Fast, fearless, straight at you', patch: { playstyle: 'direct' } },
      { label: 'Lock the back, break their hearts', patch: { playstyle: 'defensive' } },
    ],
  },
  {
    kicker: 'Where your heart points',
    prompt: 'Where does your heart point?',
    options: [
      { label: 'Europe', patch: { region: 'europe' } },
      { label: 'South America', patch: { region: 'south-america' } },
      { label: 'Africa', patch: { region: 'africa' } },
      { label: 'Asia & the Middle East', patch: { region: ['asia', 'middle-east'] } },
      { label: 'The Americas', patch: { region: ['north-america', 'caribbean'] } },
      { label: 'Wherever the best story is', patch: {} },
    ],
  },
  {
    kicker: 'The villain',
    prompt: 'Last one. Be honest: who do you love to see lose?',
    options: [
      { label: 'Brazil', flag: '🇧🇷', patch: { rivalCode: 'BRA' } },
      { label: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', patch: { rivalCode: 'ENG' } },
      { label: 'France', flag: '🇫🇷', patch: { rivalCode: 'FRA' } },
      { label: 'Germany', flag: '🇩🇪', patch: { rivalCode: 'GER' } },
      { label: 'Argentina', flag: '🇦🇷', patch: { rivalCode: 'ARG' } },
      { label: "I'm a lover, not a hater", patch: {} },
    ],
  },
]

/** A fresh, unanswered set. */
export const EMPTY_ANSWERS: QuizAnswers = {
  heritage: null,
  underdog: 0,
  playstyle: null,
  region: null,
  rivalCode: null,
  energy: null,
}
