# DeepSpace Bottlenecks & Gotchas

Real constraints, dead-ends, and workarounds hit while building **Bandwagon** on
DeepSpace (SDK v0.4.1), most discovered the hard way. Each entry: the symptom,
the root cause, the workaround we shipped, and a suggested platform fix where one
would have saved hours. Ordered roughly by how much time each cost.

Legend: **[Platform]** = DeepSpace itself · **[Adjacent]** = a library/tooling
limit that bites DeepSpace apps · **[DX]** = developer-experience / docs gap.

---

## TL;DR

| # | Bottleneck | Cost | Workaround |
|---|---|---|---|
| 1 | Anonymous connections are **read-only** (`viewer` role); no schema perm grants a tokenless client a write | High | App-identity worker route (`X-App-Action`) does the write server-side |
| 2 | Server actions **require a signed-in JWT** | Med | Same unauthenticated worker route instead of an action |
| 3 | **Dev is permissive, prod is not** — anon writes "worked" locally, failed on prod | High | Always verify writes against a deployed instance |
| 4 | `useQuery` `where` **can't filter by `recordId`**; no load-one-by-id hook | Low | Store a `shareId` data column, query `where: { shareId }` |
| 5 | Durable Object **code/schema lifecycle on deploy** is opaque | Med | Undeploy + redeploy to force a clean DO (only safe with no real data) |
| 6 | `createConfirmed` **ack hangs** on the prod edge | Low | Optimistic `create` (but see #1 for the real fix) |
| 7 | `html-to-image` **won't embed the display font** into the export PNG | High | Fit the masthead to 88% width so it can't clip in any font |

---

## 1. Anonymous users are read-only. **[Platform] [DX]**

The single biggest time sink.

**Symptom.** An anonymous `useMutations('passports').create(...)` *succeeded
locally* (returned a recordId, e2e green) but on production the record never
persisted, every `/p/[id]` load showed the not-found state, and `createConfirmed`
simply hung. No client-side error was logged.

**Root cause.** `allowAnonymous` connects unauthenticated clients as
**read-only `viewer`s** (`ROLE_ANONYMOUS = "viewer"`; the SDK doc string literally
says "read-only viewers"). No schema permission lets a *tokenless* client write:
we tried `'*': { create: true }` **and** `viewer: { create: true }` — both
rejected on prod. `allowAnonymous` is a *read* affordance only.

**Why it cost so much.** The platform docs (`schemas.md`) say "for unauthenticated
connections use the `'*'` wildcard permission key" — which reads like `'*': {
create: true }` should enable anonymous writes. It does not. We chased a stale-DO
theory (even did a prod undeploy/redeploy) before finding `ROLE_ANONYMOUS` in the
SDK types.

**Workaround (shipped).** An **unauthenticated worker route** that writes
server-side *as the app*:

```ts
// worker.ts
app.post('/api/passport/create', async (c) => {
  const stub = c.env.RECORD_ROOMS.get(c.env.RECORD_ROOMS.idFromName(`app:${c.env.APP_NAME}`))
  // X-App-Action bypasses RBAC — the same mechanism server actions use.
  await stub.fetch(new Request('https://internal/api/tools/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': 'app', 'X-App-Action': 'true' },
    body: JSON.stringify({ tool: 'records.create', params: { collection: 'passports', data } }),
  }))
})
```

Client just `fetch`es it (no auth). Reads stay on the data layer (anon `viewer`
can read). Schemas became read-only for all client roles, writes only via the
route, which is also more secure (no client can spoof server-assigned fields).

**Suggested platform fix.** Make the constraint loud: have anon `create` **reject
with an explicit error** (not a silent no-persist / hang), and in `schemas.md`
state plainly that anonymous = `viewer` = read-only and that anon writes require a
server route or sign-in.

---

## 2. Server actions require a signed-in caller. **[Platform]**

**Symptom.** `POST /api/actions/:name` returns 401 for anonymous callers; the
clean "server action assigns the supporter number + calls the AI" design is
unavailable to signed-out users.

**Root cause.** Actions validate the Bearer JWT before running; anonymous users
have no token.

**Workaround.** The same unauthenticated worker route as #1 (a route can be
public; an action cannot). Bonus: that route is also where an **owner-billed AI
call** belongs (no caller auth needed), so it unblocks the "Haiku verdict for
anonymous users" feature that an action could never serve.

**Suggested fix.** Document the "anonymous + needs a privileged/owner-billed write
or AI call" pattern explicitly, it's common for viral/no-gate apps, and the
answer (a custom worker route reusing the `X-App-Action` tools call) is not
obvious from the actions docs.

---

## 3. Dev is permissive; prod is not. **[Platform] [DX]**

**Symptom.** The anonymous-write path passed a full Playwright e2e against
`deepspace dev` (create → persist → reload all green), then failed in production.
The most important constraint of the whole feature was **invisible in local dev**.

**Root cause.** Local dev did not enforce the anonymous `viewer` read-only role
the way the deployed platform does.

**Why it matters.** "Works on my machine / in `dev`" is actively misleading here.
We only caught #1 because we tested against the deployed URL.

**Suggested fix.** Dev should mirror prod's anon role enforcement. Until then:
**always verify any anonymous or permission-sensitive write against a deployed
instance, not just `deepspace dev`.**

---

## 4. No "load one record by id"; `where` can't match `recordId`. **[Platform]**

**Symptom.** A permalink page (`/p/[id]`) needs to load exactly one record by its
id. There is no `useRecord(collection, id)` hook, and `useQuery`'s `where` filters
**data fields only**, not the envelope `recordId`.

**Workaround.** Add a `shareId` text column, generate it at creation, route on it,
and `useQuery('passports', { where: { shareId: id }, limit: 1 })`. (It's an
unindexed scan; fine at launch volume, revisit later.)

**Suggested fix.** A `useRecord(collection, recordId)` hook, or let `where` match
`recordId`.

---

## 5. Durable Object code/schema lifecycle on deploy is opaque. **[Platform] [DX]**

**Symptom.** After adding new collections to a deployed app, it was unclear
whether the existing prod `AppRecordRoom` DO was running new code, had the new
tables, or needed a reset. Reads returned empty-but-ok; writes did nothing. (The
*actual* cause was #1, but this ambiguity sent us down a rabbit hole.)

**Root cause / uncertainty.** Cloudflare migrates a DO to new code only after it
evicts and cold-starts; a warm DO can keep running old code. `schemas.md` says
schema registration happens "at first DO boot", which reads as "once, ever," and
raises the question of whether collections added later ever register on an
existing DO.

**Workaround.** `npx deepspace undeploy && npx deepspace deploy` resets the DO
(only acceptable because there was no real data yet).

**Suggested fix.** Document the DO-on-deploy lifecycle explicitly: do new
collections auto-register on the next cold start? Is there a non-destructive
"migrate / reset room" command? (Today the only lever is undeploy, which wipes
data.)

---

## 6. `createConfirmed` ack hangs on the prod edge. **[Platform]**

**Symptom.** `createConfirmed` / `putConfirmed` resolved instantly on dev but
**never resolved** on prod (the awaiting navigation never fired). Plain `create`
returned immediately but didn't persist (because of #1).

**Root cause.** Unconfirmed, but the confirmed-write ack did not arrive over the
edge WebSocket within 25s+. Conflated with #1 during debugging.

**Workaround.** Use optimistic `create`/`put` for UX, and do persistence-critical
writes through the server route (#1), where the worker awaits the DO's response
directly instead of relying on a client-side ack.

---

## 7. `html-to-image` won't embed the display font. **[Adjacent]**

Not DeepSpace, but it's the canonical "render a shareable card to an image" path
that viral DeepSpace apps need, so it belongs here.

**Symptom.** The exported 1080×1920 passport PNG rendered the masthead in a
**fallback font (~9% wider)** instead of the loaded display font, so long nation
names ("SAUDI ARABIA", "BOSNIA & HERZEGOVINA") overflowed the image, even though
the on-screen DOM was correct (verified: live element fit exactly, font loaded).

**What didn't work.** Google Fonts CDN, self-hosting the woff2, inlining the font
as a **base64 data-URI `@font-face`**, and passing explicit `fontEmbedCSS` — all
four failed to get the display font into the rasterized PNG. Same ~9% overflow
every time. (Bundle hash + a debug overlay confirmed: not a cache issue, not a fit
bug; html-to-image just rasterizes with its fallback.)

**Workaround (shipped).** Fit the export masthead to **88% of width** so it never
clips regardless of which font html-to-image picks; on-screen stays full-width.

**Open follow-up.** Try `modern-screenshot` (better font handling) or render the
name as inline SVG `<text>` for pixel-perfect export fidelity. If DeepSpace wants
a first-class OG/share-image story, a worker-side renderer (`workers-og` /
`browser_rendering`) sidesteps client-rasterizer font issues entirely.

---

## Smaller traps (documented, but still real)

- **[Platform]** **UI primitive shadowing.** Import `useToast` / `Button` etc.
  from `../components/ui`, **not** `deepspace`, the scaffold ships its own
  `ToastProvider`, and mixing sources throws `useToast must be used within
  ToastProvider`. (Called out in the skill, easy to trip anyway.)
- **[Platform]** **Not Next.js.** No `next/og`; server OG images need `workers-og`
  / the `browser_rendering` binding.
- **[Adjacent]** **Fontshare ≠ self-host.** A font being "free on Fontshare" (e.g.
  Tusker Grotesk) can still be **paid for commercial use**; verify the license
  before shipping a commercial app. We switched the display face to Anton (OFL).

---

*Compiled 2026-06-09 during the Bandwagon build (DeepSpace SDK v0.4.1).*
