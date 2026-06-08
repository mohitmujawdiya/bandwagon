// Worker-only: the real Claude Haiku verdict writer, routed through DeepSpace's
// AI proxy and billed to the app owner (Anthropic at $3/M, ~$0.002 per call).
// Pair with generateVerdict(), which times it out and falls back to the template
// on any failure, so this is never load-bearing.
//
// Not unit-tested (needs the worker env + network); exercised when passport
// creation is wired. Keep the import surface worker-only so it never reaches the
// client bundle.

import { generateText } from 'ai'
import { createDeepSpaceAI, type DeepSpaceAIEnv } from 'deepspace/worker'
import type { VerdictWriter } from './generate-verdict'

const HAIKU = 'claude-haiku-4-5'

/**
 * Build an owner-billed Haiku writer. `authToken` is intentionally omitted so
 * createDeepSpaceAI falls back to APP_OWNER_JWT (the developer pays, not the
 * anonymous fan). Keep output short: the verdict is one line.
 */
export function makeHaikuVerdictWriter(env: DeepSpaceAIEnv): VerdictWriter {
  const anthropic = createDeepSpaceAI(env, 'anthropic')
  return async ({ system, user }) => {
    const { text } = await generateText({
      model: anthropic(HAIKU),
      system,
      prompt: user,
      maxOutputTokens: 160,
      temperature: 0.8,
    })
    return text
  }
}
