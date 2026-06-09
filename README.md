# Bandwagon

Adopt a nation for the **FIFA World Cup 2026** in ~60 seconds and get a cinematic,
shareable **Supporter Passport**. A viral, identity-first web app: land → quiz →
reveal → share.

- **Live:** https://bandwagon.app.space
- **Stack:** [DeepSpace](https://deep.space) (Cloudflare Workers + Durable Objects)
  · Vite · React · Tailwind v4

## Docs

| Doc | What it is |
|---|---|
| [PRODUCT.md](PRODUCT.md) | Product brief — users, brand, anti-references, principles (register: brand) |
| [DESIGN.md](DESIGN.md) | Design system — "The Terrace Cinema": tokens, type, motion, components |
| [2026-06-08-bandwagon-design.md](2026-06-08-bandwagon-design.md) | The full design spec / strategy |
| [**DEEPSPACE-BOTTLENECKS.md**](DEEPSPACE-BOTTLENECKS.md) | **Engineering notes** — DeepSpace constraints & gotchas hit building this, with workarounds. Read before touching auth, anonymous writes, or the image export. |

## How it works (engine)

- `src/data/` — the 48-nation dataset (`nations.ts`) + the duotone color helper.
- `src/lib/` — deterministic nation **assignment**, **verdict** copy (template +
  optional Haiku), supporter **traits**, and the passport assembler. All unit-tested.
- `src/components/passport/` — the drenched `SupporterPassport` poster, its reveal
  choreography, the share actions, and the 1080×1920 image export.
- `worker.ts` — `POST /api/passport/create` persists a passport server-side (see
  bottleneck #1: anonymous clients are read-only, so writes go through the app).
- `src/pages/p/[id].tsx` — the shareable result page.

## Develop

```bash
npx deepspace dev        # local (Vite + worker) on :5173
npx vitest run           # unit tests
npx playwright test --config tests/playwright.config.ts tests/passport.spec.ts   # e2e
npx deepspace deploy     # → bandwagon.app.space
```

> Heads-up: `deepspace dev` is more permissive than production (notably for
> anonymous writes). Verify permission-sensitive flows against a deployed
> instance, see [DEEPSPACE-BOTTLENECKS.md](DEEPSPACE-BOTTLENECKS.md) #3.
