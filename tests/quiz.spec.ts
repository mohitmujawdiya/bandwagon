import { test, expect } from '@playwright/test'

const VISIBLE_PASSPORT = 'article.passport:not(.passport--export)'

async function waitForApp(page: import('@playwright/test').Page) {
  await page.waitForSelector('[data-testid="app-root"]', { timeout: 15000 })
}

test.describe('Quiz funnel', () => {
  test('answer all six, see the suspense, land on a persisted passport', async ({ page }) => {
    await page.goto('/quiz')
    await waitForApp(page)

    for (let i = 0; i < 6; i++) {
      await page.locator('.quiz__option').first().click()
      if (i < 5) await page.waitForTimeout(450) // let the question transition settle
    }

    // The labor-illusion loader, then the real passport at its permalink.
    await expect(page.locator('.quiz__skeleton')).toBeVisible()
    await page.waitForURL('**/p/**', { timeout: 20000 })
    await expect(page.locator(VISIBLE_PASSPORT)).toBeVisible({ timeout: 12000 })
    await expect(page.locator(`${VISIBLE_PASSPORT} .passport__name`)).not.toBeEmpty()
  })

  test('the roots question can be skipped', async ({ page }) => {
    await page.goto('/quiz')
    await waitForApp(page)
    await page.locator('.quiz__option').first().click() // answer Q1 → Q2 (roots)
    await expect(page.getByRole('button', { name: /surprise me/i })).toBeVisible()
  })
})
