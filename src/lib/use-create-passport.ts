import { useCallback } from 'react'
import type { QuizAnswers } from './assign'

/**
 * Create and persist a passport from quiz answers.
 *
 * Anonymous users connect to the data layer as read-only 'viewers', so the
 * write happens server-side: POST /api/passport/create writes the passport (and
 * bumps the supporter counter) as the app, then returns the shareId. Because the
 * server persists before responding, /p/[shareId] finds it on the next navigation.
 */
export function useCreatePassport() {
  return useCallback(async (answers: QuizAnswers): Promise<string> => {
    const res = await fetch('/api/passport/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizAnswers: answers }),
    })
    const json = (await res.json()) as { success: boolean; shareId?: string; error?: string }
    if (!json.success || !json.shareId) {
      throw new Error(json.error ?? 'Could not create your passport. Try again.')
    }
    return json.shareId
  }, [])
}
