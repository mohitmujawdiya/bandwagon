// Bandwagon nation dataset — shared types, controlled vocabularies, and the
// per-nation duotone color helper. Keep the vocabularies closed: the quiz
// answers and the assignment function both score against these exact tags, so
// a typo here is a silent scoring bug.

export type GroupId =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'

export type Confederation =
  | 'UEFA'       // Europe
  | 'CONMEBOL'   // South America
  | 'CONCACAF'   // North/Central America + Caribbean
  | 'CAF'        // Africa
  | 'AFC'        // Asia
  | 'OFC'        // Oceania

// Coarse "where do you feel pulled" buckets for the region question.
export type RegionPull =
  | 'europe'
  | 'south-america'
  | 'north-america'
  | 'caribbean'
  | 'africa'
  | 'asia'
  | 'middle-east'
  | 'oceania'

// How a team plays — the playstyle-vibe question maps onto these.
export type Playstyle =
  | 'attacking'
  | 'technical'
  | 'physical'
  | 'defensive'
  | 'counter'
  | 'total-football'
  | 'flair'
  | 'direct'

// Personality/energy — the match-day-feeling question maps onto these.
export type Energy =
  | 'joyful'
  | 'passionate'
  | 'cool'
  | 'chaotic'
  | 'disciplined'
  | 'romantic'
  | 'gritty'
  | 'fearless'

// Narrative archetype — the "how does your World Cup end?" question maps onto
// these. This is the prestige/expectation axis: it's the only signal that tells
// favorites from minnows, so it's what makes the giants reachable.
export type Archetype =
  | 'champion'   // lifting the trophy — the genuine title favorites
  | 'contender'  // a heroic run that ends in tears — pedigree, perennial heartbreak
  | 'dark-horse' // one impossible night — the scrappy giant-killers
  | 'party'      // dancing in the stands — debutants and minnows, here for the joy

// Heritage / roots keys. The heritage question offers friendly groupings that
// resolve to one or more of these; a nation carries every key its diaspora
// would recognize. Heritage, when answered, dominates the match.
export type HeritageKey =
  | 'mexico' | 'central-america' | 'caribbean' | 'south-america' | 'brazil'
  | 'west-africa' | 'north-africa' | 'east-africa' | 'central-africa' | 'southern-africa' | 'arab'
  | 'western-europe' | 'southern-europe' | 'eastern-europe' | 'balkans' | 'nordic'
  | 'middle-east' | 'central-asia' | 'east-asia' | 'southeast-asia' | 'south-asia'
  | 'oceania' | 'north-america'

/** OKLCH duotone derived from a single accent spec, per the DESIGN.md Drench Rule. */
export interface Accent {
  /** OKLCH hue angle (0-360). */
  hue: number
  /** OKLCH chroma for the primary (0-0.37ish). Deep/glow scale it down. */
  chroma: number
  /** Optional primary lightness override (0-1). Defaults to 0.66. */
  lightness?: number
}

export interface Duotone {
  /** The nation's signature hue — carries the country name and key type. */
  primary: string
  /** Darkened, desaturated shade — the drenched base the passport floods with. */
  deep: string
  /** Light, lifted tint — accents, trait numerals, optional foil. */
  glow: string
}

export interface Nation {
  /** Stable 3-letter key (unique). */
  code: string
  /** Display name, tuned for a US/diaspora audience (e.g. "South Korea", "DR Congo"). */
  name: string
  flagEmoji: string
  group: GroupId
  confederation: Confederation
  region: RegionPull
  /** Static football nickname — the passport's archetype kicker (Hybrid model). */
  nickname: string
  /** Single accent spec; render via duotone(). */
  accent: Accent
  /** 0-100, higher = more of an underdog. Drives the underdog-vs-juggernaut question. */
  underdogScore: number
  /** Narrative archetype — drives the "how does your World Cup end?" question. */
  archetype: Archetype
  playstyles: Playstyle[]
  energy: Energy[]
  heritageTags: HeritageKey[]
  /** Nation codes this team has a juicy rivalry with (drives the rivalry question). */
  rivals: string[]
  /** 1-3 recognizable names for passport/copy flavor. Verify squads before launch. */
  stars: string[]
}

function fmt(n: number): string {
  // Trim to 3 decimals, drop trailing zeros, keep it CSS-clean.
  return parseFloat(n.toFixed(3)).toString()
}

/**
 * Derive the three-stop duotone from a single accent, following DESIGN.md:
 * deep = darkened + desaturated base, glow = lightened + softened tint.
 * Chroma is eased down at the light/dark extremes so nothing goes garish.
 */
export function duotone(accent: Accent): Duotone {
  const { hue, chroma } = accent
  const primaryL = accent.lightness ?? 0.66
  return {
    primary: `oklch(${fmt(primaryL)} ${fmt(chroma)} ${fmt(hue)})`,
    deep: `oklch(0.3 ${fmt(chroma * 0.5)} ${fmt(hue)})`,
    glow: `oklch(0.88 ${fmt(chroma * 0.45)} ${fmt(hue)})`,
  }
}
