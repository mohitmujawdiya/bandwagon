import { test, expect } from '@playwright/test'
import { captureConsoleErrors } from './helpers/errors'

async function waitForApp(page: import('@playwright/test').Page) {
  // app-root is always present; the nav is hidden on immersive routes (/p/).
  await page.waitForSelector('[data-testid="app-root"]', { timeout: 15000 })
}

// The visible passport (PassportActions also renders an off-screen export clone
// that shares the .passport class, so scope to the non-export instance).
const VISIBLE_PASSPORT = 'article.passport:not(.passport--export)'

test.describe('Passport persistence', () => {
  test('create a passport anonymously, persist it, and reload it at /p/[id]', async ({ page }) => {
    const errors = captureConsoleErrors(page)

    await page.goto('/preview')
    await waitForApp(page)

    // Create + persist a real passport via the data layer.
    await page.getByRole('button', { name: 'Create a real passport' }).click()

    // Navigates to the new passport's permalink and renders it.
    await page.waitForURL('**/p/**', { timeout: 20000 })
    await expect(page.locator(VISIBLE_PASSPORT)).toBeVisible()
    await expect(page.locator(`${VISIBLE_PASSPORT} .passport__name`)).not.toBeEmpty()
    await expect(page.getByText(/supporters/i)).toBeVisible()

    // Persistence: reload the bare permalink (no ?new=1) — a fresh fetch from
    // the worker. If the passport renders, it was genuinely persisted.
    const permalink = new URL(page.url()).pathname
    await page.goto(permalink)
    await waitForApp(page)
    await expect(page.locator(VISIBLE_PASSPORT)).toBeVisible()
    await expect(page.locator(`${VISIBLE_PASSPORT} .passport__name`)).not.toBeEmpty()

    expect(errors).toEqual([])
  })

  test('an unknown passport id shows the friendly not-found state', async ({ page }) => {
    await page.goto('/p/doesnotexist123')
    await waitForApp(page)
    await expect(page.getByRole('heading', { name: 'Gone' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Find my team' })).toBeVisible()
  })
})
