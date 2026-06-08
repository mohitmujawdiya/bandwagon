---
name: Bandwagon
description: Adopt a World Cup nation in 60 seconds and get a cinematic Supporter Passport worth posting.
colors:
  # Brand accent (Bandwagon's own voice, used on the chrome, never on the passport hero)
  signal-flare: "oklch(67% 0.21 35)"
  flare-deep: "oklch(58% 0.20 32)"
  # Warm cinema-black neutrals (the Terrace Cinema base; never #000/#fff)
  cinema-black: "oklch(18% 0.012 65)"
  cinema-raise: "oklch(23% 0.013 65)"
  cinema-line: "oklch(34% 0.012 65)"
  ash: "oklch(62% 0.01 70)"
  bone: "oklch(92% 0.008 80)"
  floodlight: "oklch(97% 0.006 85)"
  # Per-nation duotone: RUNTIME tokens, overridden per nation from flag colors.
  # Values below are the Argentina sample only; the engine swaps them per result.
  nation-primary: "oklch(72% 0.13 230)"
  nation-deep: "oklch(30% 0.07 245)"
  nation-glow: "oklch(88% 0.08 215)"
typography:
  display:
    fontFamily: "'Anton', 'Arial Narrow', 'Roboto Condensed', sans-serif"
    fontSize: "clamp(4rem, 18vw, 11rem)"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Anton', 'Arial Narrow', 'Roboto Condensed', sans-serif"
    fontSize: "clamp(2.5rem, 8vw, 5rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.005em"
  title:
    fontFamily: "'Hanken Grotesk', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0"
  body:
    fontFamily: "'Hanken Grotesk', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1rem, 1.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
  label:
    fontFamily: "'Martian Mono', ui-monospace, 'SF Mono', 'Roboto Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.signal-flare}"
    textColor: "{colors.cinema-black}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "18px 36px"
  button-primary-hover:
    backgroundColor: "{colors.flare-deep}"
    textColor: "{colors.cinema-black}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "18px 36px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "18px 36px"
  chip-answer:
    backgroundColor: "{colors.cinema-raise}"
    textColor: "{colors.bone}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "20px 24px"
  chip-answer-selected:
    backgroundColor: "{colors.cinema-raise}"
    textColor: "{colors.floodlight}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "20px 24px"
  input-email:
    backgroundColor: "{colors.cinema-raise}"
    textColor: "{colors.bone}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
---

# Design System: Bandwagon

## 1. Overview

**Creative North Star: "The Terrace Cinema"**

Bandwagon is where the football terrace meets the movie poster. The terrace gives it warmth, noise, and belonging: a crowd of strangers who become your people the moment you pick a side. The cinema gives it scale, darkness, and the held breath before the reveal. The whole system lives in a warm cinema-black room, and every path through it ends on one screen: a Supporter Passport so big and so drenched in your nation's color that posting it feels less like sharing a quiz result and more like releasing a poster for the team you just joined.

The system runs on a deliberate split of register. The chrome (landing, quiz, share flow) is the dim, warm lobby: cinema-black surfaces, a single Signal Flare accent, towering condensed type, the patience of a room that knows the show is worth waiting for. The passport is the screen: a nation's duotone floods the entire surface, the country name stands monumentally tall, and the supporter data reads like the stub of a ticket you keep. Two rooms, one building. The lobby never competes with the screen.

This explicitly rejects four things named in `PRODUCT.md`. It is not a cheesy BuzzFeed quiz (no clip-art, no stock photography, no listicle chrome). It is not the sterile official FIFA app (no brand-safe bureaucracy). It is not a sportsbook (no neon-on-black odds-board sleaze, no "bet now"). And it is not generic SaaS or AI-startup (no gradient blobs, no identical icon-card grids, no big-number hero-metric template). Warmth, scale, and craft are the whole point; if it could be any AI app, it has failed.

**Key Characteristics:**
- Warm cinema-black world, dark-mode-first, never pure black or pure white.
- Two-register split: restrained Committed chrome, fully Drenched per-nation passport.
- Towering condensed display type as the dominant visual force.
- The artifact is the product: every flow ends in a screenshot-worthy poster.
- Choreographed reveal (suspense, then identity, then pride), all on ease-out-expo.
- Every nation hero-worthy: the design dignifies debutants and giants alike.

## 2. Colors

A warm, dim base that exists to make a single nation's color detonate. The palette is built in two strategies at once: **Committed** on the chrome (cinema-black plus one Signal Flare accent), and **Drenched** on the passport (the nation owns the surface).

### Primary
- **Signal Flare** (`oklch(67% 0.21 35)`): a hot stadium-flare red-orange. This is Bandwagon's own voice, the accent on the chrome only: the primary CTA, the quiz progress bar, the viral-loop moments, the confetti seed at the emotional peak. Warm and celebratory, never the cold neon of a betting app. **It never appears on the passport hero**, where the nation's color rules instead.
- **Flare Deep** (`oklch(58% 0.20 32)`): the pressed and hover state of Signal Flare.

### Secondary (per-nation duotone, runtime)
The passport's color is generated per result from the nation's flag, in OKLCH, and bound to three runtime tokens. The Argentina values in the frontmatter are a sample only; the engine swaps all three per nation.
- **Nation Primary** (`--nation-primary`): the nation's signature hue, carrying the country name and key type on the poster.
- **Nation Deep** (`--nation-deep`): a darkened, desaturated shade of the same hue. This is the drenched base the entire passport floods with.
- **Nation Glow** (`--nation-glow`): a light, lifted tint for accents, the trait numerals, and the optional foil shimmer.

### Neutral (warm cinema black, hue ~65-80)
- **Cinema Black** (`oklch(18% 0.012 65)`): the base canvas behind every chrome surface. Warm brown-black, not slate, not void.
- **Cinema Raise** (`oklch(23% 0.013 65)`): the one step up, for quiz answer tiles, the email field, the ticket-stub band. Depth by tonal layering, not shadow.
- **Cinema Line** (`oklch(34% 0.012 65)`): hairline borders and dividers. Full borders only, 1px.
- **Ash** (`oklch(62% 0.01 70)`): muted secondary text, captions, the "1 of N" sub-line, field labels.
- **Bone** (`oklch(92% 0.008 80)`): primary text on dark. A warm off-white, the "paper" of the passport data.
- **Floodlight** (`oklch(97% 0.006 85)`): reserved for maximum-emphasis type and selected states only.

### Named Rules
**The Two Rooms Rule.** The chrome is the lobby; the passport is the screen. Signal Flare lives in the lobby and is forbidden on the passport hero. The nation duotone lives on the screen and is forbidden as chrome decoration. Never let the two accent systems share a surface.

**The Drench Rule.** On the passport, the nation does not get a stripe, a badge, or a corner. It gets the whole surface. Nation Deep floods the full bleed; Nation Primary and Glow carry the type. A timid nation accent on a dark card is a failure.

**The Flare Rarity Rule.** Signal Flare covers a small fraction of any chrome screen. Its scarcity is what makes the CTA read as the one thing to do. If flare is everywhere, it is nowhere.

## 3. Typography

**Display Font:** Anton (with Arial Narrow, Roboto Condensed fallback). Chosen over Tusker Grotesk, which is paid for commercial use; Anton is free/OFL and delivers the same towering-condensed poster impact.
**Body Font:** Hanken Grotesk (with Noto Sans, Helvetica Neue fallback)
**Label / Mono Font:** Martian Mono (with ui-monospace fallback)

**Character:** Anton is a towering, ultra-condensed display sans built to be set enormous: it turns a country name into a monument and gives the whole system its Nike-match-poster scale. Hanken Grotesk is the warm, highly legible workhorse that keeps the "why you" copy human and the newcomer un-intimidated, with Noto Sans behind it for the diaspora audience's broader scripts. Martian Mono is the mechanical voice of the passport's data fields: wide, technical, ticket-like, used small and tracked so it reads as documentation, not body copy.

### Hierarchy
- **Display** (Anton, 400, fit-to-width masthead, line-height ~0.82, uppercase): the nation name on the passport. The single largest element on any screen, JS-sized to span the poster width on one line. (Anton is a single heavy weight; do not expect weight variation.)
- **Headline** (Anton, 400, `clamp(2.5rem, 8vw, 5rem)`, line-height 0.95): the landing hero and section openers ("FIND YOUR WORLD CUP TEAM").
- **Title** (Hanken Grotesk, 600, `clamp(1.5rem, 4vw, 2.25rem)`, line-height 1.1): quiz questions and answer-tile labels. Confident, readable, never shouty.
- **Body** (Hanken Grotesk, 400, `clamp(1rem, 1.2vw, 1.125rem)`, line-height 1.55, max 65-70ch): the "why you" paragraph and all explanatory UI. Add line-height on dark; light type reads lighter.
- **Label** (Martian Mono, 500, `0.75rem`, letter-spacing 0.12em, uppercase): the archetype kicker, passport data labels (NO. / GROUP / RANK), CTA text, and tags.

### Named Rules
**The Monument Rule.** The nation name is always the biggest thing on screen and always Anton, sized to span the poster width. It does not share the stage with another element at the same scale. Shrink everything else before you shrink the name.

**The Solid-Color Rule.** Type is one solid color, always. Gradient text (`background-clip: text`) is forbidden, every time, no exception. Emphasis comes from scale, weight, and color choice, never from a gradient fill.

## 4. Elevation

This system is flat by default and gets its depth from light, grain, and tonal layering, not from drop shadows. Surfaces step up through the neutral ramp (Cinema Black to Cinema Raise) rather than floating on gray box-shadows. The cinematic dimensionality comes from a subtle film grain over the whole base, a soft vignette pulling focus to center, and colored light: a flare bloom under the primary CTA, and a nation-glow bloom that blooms in behind the passport on reveal.

### Shadow Vocabulary
- **Flare Bloom** (`box-shadow: 0 8px 40px oklch(67% 0.21 35 / 0.35)`): a warm colored glow under the primary CTA and other Signal Flare elements on hover. A light source, not a gray shadow.
- **Nation Bloom** (`box-shadow: 0 24px 120px var(--nation-primary)` at low alpha): blooms in behind the passport at the peak of the reveal. The poster appears lit from behind, not dropped onto a surface.

### Named Rules
**The No-Box-Shadow Rule.** Gray drop shadows are forbidden. Depth is grain, vignette, tonal layering, and colored bloom. The only shadows permitted are the two colored blooms above, and only on a hero moment. If it looks like a 2014 Material card floating on `rgba(0,0,0,0.2)`, delete the shadow and step the tonal layer instead.

## 5. Components

Lead with the feel, then the spec. Components are tactile and confident, built from the warm-dark surfaces and the one flare accent.

### Buttons
- **Shape:** confident rectangle, gently softened corners (12px, `rounded.md`). Not a pill, not sharp-cornered. Poster-stock, not web-button.
- **Primary:** Signal Flare background, Cinema Black text, Martian Mono uppercase label tracked 0.12em (`18px 36px` padding). Used for short calls only ("FIND MY TEAM", "SHARE", "SAVE IT"). Hover: shifts to Flare Deep, lifts `translateY(-2px)`, gains the Flare Bloom. Transition transform and background only, 200ms ease-out.
- **Ghost:** transparent with a 1px Cinema Line full border, Bone text, same Martian Mono label. Hover: fills to Cinema Raise. Secondary actions (download, skip, back).

### Chips / Answer Tiles
- **Style:** large editorial choice rows on Cinema Raise, Bone text in Hanken Grotesk Title size, 12px radius, generous `20px 24px` padding. Big tap targets (min height 56px) for one-thumb mobile play.
- **State:** selected floods text to Floodlight and adds a 2px inset Signal Flare ring (during the quiz the nation is still unknown, so flare carries selection). Never a 2x2 grid of identical icon cards: these are stacked, full-width, text-led choices.

### Inputs / Fields
- **Style:** Cinema Raise fill, Bone text, 1px Cinema Line border, 12px radius, `16px 18px` padding. Quiet by default; the email field is an optional upgrade, never a gate.
- **Focus:** border shifts to Signal Flare with a 2px flare focus ring. No glow-on-everything.
- **Error / Disabled:** error border in a desaturated flare, message in Ash; disabled drops to 50% and removes the border.

### Navigation
- **Style:** minimal. A wordmark left, at most one ghost action right. Quiz uses a thin top progress bar in Signal Flare over Cinema Line, not a nav. Mobile-first; the chrome gets out of the way of the show.

### The Supporter Passport (signature component)
The entire product compresses into this artifact, so it carries the most craft.
- **Format:** 9:16 poster by default (Stories-native), exportable to image for sharing and download.
- **Color:** Nation Deep drenches the full bleed; Nation Primary and Glow carry the type. Grain and vignette overlay the whole surface.
- **Type:** the nation name in Tusker Display, monumental and edge-bleeding. The archetype as a Martian Mono kicker above or below it ("THE STREET POETS").
- **Data band:** a translucent ticket-stub band (the one sanctioned glass surface) carrying Martian Mono data, supporter number, group, rank, with a subtle perforated edge.
- **Traits:** rendered as editorial, oversized numerals that count up on reveal (NumberFlow), woven into the composition like a credits roll. Never a SaaS hero-metric grid.
- **Rarity:** off-meta nations earn a restrained foil or iridescent accent and a "limited edition" editorial mark, as an in-app delight. The static export reads premium without it.

## 6. Do's and Don'ts

### Do:
- **Do** drench the passport in the nation's duotone (Nation Deep full bleed, Nation Primary and Glow type). The whole surface, never a stripe or a corner.
- **Do** set the nation name monumentally in Tusker Grotesk as the largest element on screen.
- **Do** keep Signal Flare to the chrome and scarce (the One CTA), and keep the nation duotone to the passport.
- **Do** render supporter traits as editorial count-up numerals woven into the poster.
- **Do** use OKLCH and tint every neutral warm; pair every flag color with the nation name, crest, and a text label so meaning never rests on color alone (WCAG 2.2 AA).
- **Do** honor `prefers-reduced-motion`: the suspense loader, confetti, count-ups, and tilt all collapse to a dignified instant state.
- **Do** animate only `transform` and `opacity`, on ease-out-expo / quint, no bounce.

### Don't:
- **Don't** make a cheesy BuzzFeed quiz: no clip-art, no stock photography, no low-rent quiz-site chrome. The result is a designed artifact, not a listicle.
- **Don't** drift into the corporate, sterile official-FIFA-app register.
- **Don't** borrow sportsbook sleaze: no neon-on-black odds-board energy, no aggressive "bet now".
- **Don't** ship generic SaaS or AI-startup tropes: no gradient blobs, no identical icon-card grids, no big-number hero-metric template.
- **Don't** use gradient text (`background-clip: text`), ever. One solid color.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe. Full borders, tints, or leading data instead.
- **Don't** use glassmorphism as a default surface. The only sanctioned glass is the passport's ticket-stub data band.
- **Don't** use gray drop shadows. Depth is grain, vignette, tonal layering, and colored bloom only.
- **Don't** use `#000`, `#fff`, or Inter. Warm cinema-black neutrals and the Stadium type system instead.
- **Don't** use em dashes (or `--`) in any UI copy.
