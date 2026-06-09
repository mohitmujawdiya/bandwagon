// The 6-question quiz. Each option carries a `patch` that merges into the
// building QuizAnswers, which the assignment engine scores. Copy is Bandwagon's
// voice: warm, confident, a little cheeky, clear over clever (per the research:
// identity not trivia, easy low-effort taps, every option a flattering vibe).
//
// Six distinct signals, one per question: energy · geography · underdog ·
// playstyle · archetype ("how it ends") · rivalry. The geography question is the
// single roots/origin pick (covers all six confederations, including Oceania);
// the archetype question is the prestige axis that makes the favorites reachable.

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
  /** Geography is the only optional one (newcomers tap "surprise me"). */
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
    prompt: 'Where are you, or your people, from?',
    skippable: true,
    options: [
      { label: 'Mexico & Central America', patch: { heritage: ['mexico', 'central-america'] } },
      { label: 'USA, Canada & the Caribbean', patch: { heritage: ['north-america', 'caribbean'] } },
      { label: 'South America', patch: { heritage: ['south-america', 'brazil'] } },
      { label: 'Europe', patch: { heritage: ['western-europe', 'southern-europe', 'eastern-europe', 'balkans', 'nordic'] } },
      { label: 'Africa', patch: { heritage: ['west-africa', 'north-africa', 'central-africa', 'southern-africa'] } },
      { label: 'Asia, the Middle East & the Pacific', patch: { heritage: ['east-asia', 'central-asia', 'middle-east', 'oceania'] } },
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
    kicker: 'How it ends',
    prompt: 'How does your World Cup end?',
    options: [
      { label: 'Lifting the trophy. Obviously.', patch: { archetype: 'champion' } },
      { label: 'A heroic run that ends in tears', patch: { archetype: 'contender' } },
      { label: 'One impossible night that becomes a legend', patch: { archetype: 'dark-horse' } },
      { label: 'Dancing in the stands, result optional', patch: { archetype: 'party' } },
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
  archetype: null,
  rivalCode: null,
  energy: null,
}
