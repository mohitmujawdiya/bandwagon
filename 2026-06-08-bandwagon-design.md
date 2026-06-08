# Bandwagon — Design Spec

Date: 2026-06-08
Status: Draft for review
Author: Sahil (with Claude)
Related context: `PRODUCT.md` (brand register), memory `world-cup-2026-viral-app`, `use-impeccable-and-deepspace`

## 1. One-liner

A viral web app that gives a World Cup newcomer or diaspora fan a nation to adopt through a 60-second quiz, then hands them a cinematic, shareable Supporter Passport that becomes their home for the whole tournament.

## 2. Context and timing

- FIFA World Cup 2026 runs June 11 to July 19 (USA, Canada, Mexico; 48 teams; 104 matches). Kickoff is in 3 days; the audience peaks in the July knockout rounds.
- This is a 6-week mega-event play, not an evergreen product. The strategy: ship a minimum viral artifact before kickoff, capture the opening-weekend spike, then compound into the knockout peak. Capture emails so the audience survives the final whistle (reusable for the Club World Cup and future tournaments).
- White space (validated by research): football's obvious lanes are saturated (player/grid guessers, bracket predictors, sweepstakes, fantasy, AI match-prediction, horizontal fan social). The open lanes are identity, newcomer onboarding, and diaspora pride. Bandwagon sits squarely in identity.

## 3. Goals and success metrics

Primary goal: viral now, durable later.

- Virality: quiz completion rate, share rate, and viral coefficient (shares to new visitors). This is the headline metric.
- Durability: email and identity capture rate; size of the list at tournament end.
- Engagement: daily return through the knockout peak; passports created; passports shared.
- Non-goal for v1: revenue. Monetization surfaces exist but are light and opportunistic.

## 4. Audience

See `PRODUCT.md`. Two overlapping groups: casual American newcomers (no team, fear of looking clueless) and diaspora fans (heritage pride, want to broadcast and rally). Both are mobile-first, arrive via shared links, and decide in under a minute.

## 5. The product

### 5.1 Core viral loop (the MVP)

```
Land -> Quiz (6 questions) -> AI-assisted nation assignment -> Supporter Passport
   -> Share (Web Share API: image + caption) / Download (9:16 poster)
   -> friend opens link -> takes quiz -> repeat
                          \-> optional, non-gated email capture ("save your passport + match alerts + your Wrapped")
```

The passport is the entire growth engine. It must be an artifact people are proud to post.

### 5.2 Layered roadmap (mapped to the tournament calendar)

| Phase | Window | Adds | Concept |
|---|---|---|---|
| MVP | by Jun 11 | Quiz, nation assignment, Supporter Passport, share/download, optional email, "1 of X supporters" counter, per-nation tally | A |
| Layer B | Jun 11 to 27 (groups) | "Your team plays today", "what your team needs to advance", a daily "who do I watch tonight" curator, check-in streak | B |
| Layer C | groups into knockouts | Friend factions / private pools, AI trash-talk on busted picks, round-reset re-engagement | C |
| Off-ramp | Jul 19 | "Your World Cup Wrapped" recap (second viral share + email capture), bridge email to Club World Cup / leagues | A |

### 5.3 Scope boundary (YAGNI)

The MVP is only sections 5.1 plus the "1 of X" social-proof counter. Everything in Layers B and C is explicitly out of the MVP and built only after launch, while the wave is live. This boundary is load-bearing: it is what makes a pre-kickoff ship realistic.

## 6. Nation-assignment design (hybrid)

The single decision that makes results reliable and cheap:

- Which nation: a deterministic scoring function over a static 48-nation metadata file (vibe tags, underdog score, region, heritage map, star players, fixtures, flag colors). Guarantees a good spread (not everyone gets Brazil), respects an optional heritage answer with a strong weight, and favors a good underdog story for pure newcomers. Costs nothing and is fully controllable.
- The personality: Claude (Haiku) writes the archetype name, the "why you" paragraph, and the one-line verdict, seeded by the user's answers and the nation facts. Prompt-cached on the static nation facts.
- Reliability: a pre-generated copy bank covers all 48 nations (and a small set of archetypes) so that if the AI call fails or a spike hits, the passport always renders from the bank. AI is the seasoning, never a hard dependency. Per-session rate limits cap cost.

Quiz questions (6, playstyle and values, not football trivia, so anyone can play): optional heritage/roots, underdog vs juggernaut, playstyle vibe, region pull, a rivalry ("who do you want to beat"), and energy/personality. Heritage answered pulls hard toward that nation; pure newcomer weights toward an underdog with a story.

## 7. Design language

Register: brand (design IS the product). Governed end to end by the `impeccable` skill. Exact tokens (color, type, radii, motion curves) are committed in `DESIGN.md` via `impeccable document`, then built via `impeccable craft`. This section sets direction, not tokens.

### 7.1 Direction: cinematic editorial "supporter poster"

Anchored to the chosen references (Spotify Wrapped / zine and Nike football posters) and the personality (cinematic, welcoming, audacious). The passport is a film-poster-meets-Wrapped-card for your nation, not a glossy collectible trading card. This deliberately avoids the saturated holographic-card lane and the category reflex impeccable warns against.

- Type-led composition. Oversized, expressive display type carries the layout: the nation name as a hero headline, the archetype as an editorial kicker. Solid colors only (no gradient text, an impeccable ban). Hierarchy via scale and weight.
- Color. Per-nation duotone derived from the flag, in OKLCH, on a tinted dark cinematic base (never pure black or white). The hero poster runs a committed-to-drenched color strategy: bold, but disciplined and legible.
- Texture and light. Subtle grain / risograph / zine texture plus cinematic lighting and vignette. This signals "designed artifact" and dodges both sterile-AI flatness and BuzzFeed-quiz cheese.
- Supporter traits rendered editorially. Traits (for example Passion, Loyalty, Flair, Grit, Banter) are woven into the poster as expressive typographic elements (a credits-roll, ticker, or oversized numerals), NOT a SaaS hero-metric grid (an impeccable ban). They count up on reveal.
- Rarity as delight, not headline. Off-meta nations earn a heightened flourish (a restrained foil or iridescent accent, a "limited edition" editorial mark) as an in-app moment. The static poster reads premium without it, because the share artifact is a screenshot.
- Glass only when purposeful (for example a translucent ticket-stub band), never as a default surface.

### 7.2 Reveal choreography (reconciled with impeccable motion laws)

Motion uses ease-out-expo curves, no bounce, no elastic. Only `transform` and `opacity` animate.

1. Quiz: full-screen, one question at a time, tap to answer auto-advances, roughly 60 seconds, thin progress indicator.
2. Suspense (about 2 seconds): a staged "labor illusion" loader cycling honest copy ("Reading your answers", "Finding your nation", "Printing your passport"), with a progressive skeleton of the poster, not a spinner.
3. Payoff: the poster assembles cinematically (type settles in, color floods, grain resolves), trait numerals count up (ease-out, no bounce), and a single restrained confetti or light-flare moment hits the emotional peak. Optional soft chime after a user gesture, with a mute control.
4. Ambient life: an optional subtle tilt or parallax on the poster (reduced-motion safe; gyro on mobile behind a tap, since iOS requires a gesture to grant motion permission).
5. No scroll-jacking anywhere.

### 7.3 Accessibility

Per `PRODUCT.md`: WCAG 2.2 AA, honor `prefers-reduced-motion` (suspense, confetti, count-ups, tilt all collapse to an instant dignified state), never rely on color alone (always pair flag color with nation name, crest, and labels), and tolerate longer or translated strings for the Spanish-first diaspora audience.

## 8. Architecture (on DeepSpace)

DeepSpace is the platform: Cloudflare Workers, SQLite-backed Durable Objects, Better Auth, RBAC, WebSocket subscriptions, streamed Claude AI, jobs, cron, Stripe, an integrations proxy, file-based React routing, deploy to `<name>.app.space`, custom domain via `deepspace domain`.

- Frontend: Vite + React + Tailwind v4 + the scaffold's primitives. Pages under `src/pages/`. Client libraries for the reveal: Motion (low-bounce ease-out), canvas-confetti, NumberFlow (trait count-up), paper-design shaders (optional generative texture), react-insta-stories or a custom full-screen flow. The cinematic poster is rendered in the DOM so it can be exported as an image.
- Nation data: a static file (48 nations: flag colors, stars, group, fixtures, vibe tags, underdog score, heritage map). All public data, pre-generated.
- Nation assignment: deterministic scoring function (client or a Worker route). Personalized copy via the AI chat route or a server action, with the pre-generated copy bank as fallback. Batch pre-generation of the 48-nation copy bank via a DeepSpace job.
- Real-time social proof: per-nation supporter counts and the "1 of X" line via real-time `useQuery` over DeepSpace collections (and a maintained `nationStats` counter updated by a server action, since live aggregate counts need a counter, not a scan).
- Share images:
  - Link-preview OG image (spoiler-free curiosity gap, "Which nation are you destined to support?") rendered on the Worker (Satori-based workers-og, or the `browser_rendering` binding / `captureScreenshot` helper). DeepSpace is not Next.js, so `next/og` is not used; the engine underneath is equivalent.
  - Downloadable 9:16 poster generated client-side from the rendered DOM (html-to-image) so the user can post to Instagram or TikTok Stories (web cannot post to IG Stories directly).
- Auth and identity: Better Auth. No hard email gate. Anonymous users still get a passport (anon identity); email is an optional "save and claim" upgrade that also unlocks match alerts and the end-of-tournament Wrapped. Passport claim-on-signup links the anon passport to the account.
- Layer B (cron): "your team plays today" and match-day updates via `AppCronRoom`.
- Layer C (real-time): friend factions / pools via Durable Objects (collections or game rooms), presence, and AI trash-talk via the AI route.
- Payments (later): Stripe via `useSubscription` / `useCheckout` for any premium pool features or tips. Never hand-rolled.
- Deploy: `npx deepspace deploy` to `<name>.app.space`; attach a custom domain (for example bandwagon.app) via `deepspace domain` if available.

## 9. Data model (DeepSpace collections, app-scoped)

- `users` (ships with scaffold; required shape): account identity, email, claimed passport reference.
- `passports`: one per result. Fields: ownerId (anon or user), nation, archetype, traits (scores), rarityTier, supporterNumber, quizAnswers, createdAt. Drives the result page and the OG image route (`/p/[id]` or `/r/[id]`).
- `nationStats`: per-nation counters (supporterCount), updated via a server action on passport creation, to power the live "1 of X" and per-nation leaderboard cheaply.
- `pools` (Layer C): friend factions. Members, invite code, picks, standings.
- `picks` (Layers B and C): per-user daily predictions for streaks and pools.
- `settings` (ships): admin key/value.

## 10. Viral and share mechanics

- No hard email gate before the reveal. Shares beat leads for a viral product; email is an optional post-reveal upgrade.
- Web Share API sharing the actual poster image file (lands intact in WhatsApp and DMs) plus a "Download image" fallback, with a pre-filled caption (for example "I am adopting [flag] [nation] for the World Cup. Find your team:").
- Spoiler-free OG link previews (curiosity gap) so shared links drive clicks rather than spoiling.
- Social proof on the result: "You are 1 of N [nation] supporters" and a rarity line for off-meta picks.
- Share-to-unlock a "Founding Supporter" mark and a per-nation supporter leaderboard that updates, giving a reason to revisit and re-post.

## 11. Monetization (light, deferred)

A single sponsor slot on the poster ("presented by"), nation-specific jersey and flag affiliate links (Amazon Associates), and an optional, tasteful, state-gated legal US sportsbook call to action (US betting is legal in many states; kept non-intrusive and never sleazy, per the anti-references). The email list is the durable asset. None of this is in the MVP.

## 12. Cost and rate-limiting

AI is not the cost constraint: pre-generating all 48-nation copy on Haiku with batching is cents; per-result personalization is a fraction of a cent and prompt-cached. The real risk is an un-rate-limited viral spike, so we cap per-session generations from day one and fall back to the copy bank. Confirm DeepSpace's owner-pays AI/integration billing fits the budget during scaffold.

## 13. Risks and mitigations

- Time: 3 days to kickoff. Mitigation: the strict MVP boundary (section 5.3); layers ship during the tournament.
- Low retention of a pure toy: expected. Mitigation: convert the viral burst into a returning ritual via Layer B (daily "your team" hooks) and capture emails for the off-ramp.
- Saturated football space: mitigation: we deliberately avoid every saturated lane and occupy identity / newcomer onboarding, with a distinctive cinematic-editorial look (not another holo card).
- Design slop: mitigation: every UI surface goes through `impeccable`, grounded in `PRODUCT.md` and `DESIGN.md`.
- Platform lock-in to DeepSpace: acceptable trade for the real-time + auth + AI backend a solo dev gets for free; the layered community features are exactly its strength.

## 14. Open decisions (resolve in planning / build)

- App and deploy name, and whether to buy bandwagon.app (or the nearest available) via `deepspace domain`.
- Exact final list and wording of the 6 quiz questions (drafted in build, copy through impeccable).
- The archetype taxonomy (how many archetypes, how they map to traits).
- Anonymous-to-account passport claim flow specifics.
- DESIGN.md tokens (color strategy per nation, display and UI typefaces, motion curves) via `impeccable document`.

## 15. Build sequence (high level; detailed plan via writing-plans next)

1. Seed `DESIGN.md` (`impeccable document`, seed mode).
2. Scaffold the DeepSpace app; `deepspace login`; pick a non-default theme; run `deepspace add --list`.
3. Static nation dataset + deterministic assignment function + pre-generated copy bank (job).
4. Quiz flow and the cinematic Supporter Passport (via `impeccable shape` then `craft`).
5. Share: client poster export + Worker OG route + Web Share wiring.
6. Social proof: `passports` + `nationStats` collections + real-time "1 of X".
7. Optional email capture (claim flow).
8. Test (DeepSpace Playwright specs), then `deepspace deploy`, attach domain.
9. Post-launch: Layers B and C, then the Wrapped off-ramp.
