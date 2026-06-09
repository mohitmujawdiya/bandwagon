import type { CollectionSchema } from 'deepspace/worker'

/**
 * Passports — one per quiz result. Public-read (every passport is shareable via
 * /p/[shareId]) and anonymously creatable (no hard sign-in gate, per the
 * product). Writes flow through the data layer, not a server action, because
 * anonymous callers have no JWT to authenticate an action with. No update/delete
 * for clients so a passport can't be tampered with after the fact.
 */
export const passportsSchema: CollectionSchema = {
  name: 'passports',
  columns: [
    { name: 'shareId', storage: 'text', interpretation: 'plain' },
    { name: 'nationCode', storage: 'text', interpretation: 'plain' },
    { name: 'nickname', storage: 'text', interpretation: 'plain' },
    { name: 'verdict', storage: 'text', interpretation: 'plain' },
    { name: 'verdictSource', storage: 'text', interpretation: { kind: 'select', options: ['ai', 'fallback'] } },
    { name: 'traits', storage: 'text', interpretation: { kind: 'json' } },
    { name: 'rarity', storage: 'text', interpretation: { kind: 'select', options: ['common', 'rare', 'legendary'] } },
    { name: 'group', storage: 'text', interpretation: 'plain' },
    { name: 'supporterNumber', storage: 'number', interpretation: 'plain' },
    { name: 'quizAnswers', storage: 'text', interpretation: { kind: 'json' } },
  ],
  permissions: {
    '*': { read: true, create: true, update: false, delete: false },
    member: { read: true, create: true, update: false, delete: false },
    admin: { read: true, create: true, update: true, delete: true },
  },
}

/**
 * Per-nation supporter counter — powers the live "1 of N" social proof and each
 * passport's supporter number. One record per nation (matched by `nationCode`).
 * Client-incremented on creation; the read-modify-write can race and the count
 * is client-writable, both acceptable for launch (cosmetic, low-stakes). Harden
 * later with a cron that recomputes counts from the passports collection.
 */
export const nationStatsSchema: CollectionSchema = {
  name: 'nationStats',
  columns: [
    { name: 'nationCode', storage: 'text', interpretation: 'plain' },
    { name: 'count', storage: 'number', interpretation: 'plain' },
  ],
  permissions: {
    '*': { read: true, create: true, update: true, delete: false },
    member: { read: true, create: true, update: true, delete: false },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
