import type { CollectionSchema } from 'deepspace/worker'

/**
 * Passports — one per quiz result. Public-read (every passport is shareable via
 * /p/[shareId]). Clients NEVER write directly: anonymous connections get the
 * read-only 'viewer' role on the platform (no schema permission can grant a
 * tokenless client a write), so creation goes through the app-identity worker
 * route POST /api/passport/create, which writes via X-App-Action (RBAC bypass).
 * Keeping client writes off also stops supporterNumber / counter spoofing.
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
    '*': { read: true, create: false, update: false, delete: false },
    viewer: { read: true, create: false, update: false, delete: false },
    member: { read: true, create: false, update: false, delete: false },
    admin: { read: true, create: true, update: true, delete: true },
  },
}

/**
 * Per-nation supporter counter — powers the live "1 of N" social proof and each
 * passport's supporter number. Read-only for clients; incremented only by the
 * app-identity create route. One record per nation (matched by `nationCode`).
 */
export const nationStatsSchema: CollectionSchema = {
  name: 'nationStats',
  columns: [
    { name: 'nationCode', storage: 'text', interpretation: 'plain' },
    { name: 'count', storage: 'number', interpretation: 'plain' },
  ],
  permissions: {
    '*': { read: true, create: false, update: false, delete: false },
    viewer: { read: true, create: false, update: false, delete: false },
    member: { read: true, create: false, update: false, delete: false },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
