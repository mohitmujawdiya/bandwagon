import { test, expect } from '@playwright/test'
import { captureConsoleErrors } from './helpers/errors'

// app-root is always present; the app nav is hidden on the immersive surfaces
// (landing, quiz, passport), so wait on the shell, not the nav.
async function waitForApp(page: import('@playwright/test').Page) {
  await page.waitForSelector('[data-testid="app-root"]', { timeout: 15000 })
}

test.describe('Smoke tests', () => {
  test('landing loads without JS errors', async ({ page }) => {
    const errors = captureConsoleErrors(page)
    await page.goto('/')
    await waitForApp(page)
    await expect(page.getByRole('heading', { name: /World Cup team/i })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('the landing sells the quiz', async ({ page }) => {
    await page.goto('/')
    await waitForApp(page)
    await expect(page.locator('.landing__wordmark')).toContainText('bandwagon')
    const cta = page.getByRole('link', { name: 'Find my team' }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/quiz')
  })

  test('app chrome and sign-in are available off the landing', async ({ page }) => {
    // A non-immersive route (the 404) carries the app nav + sign-in.
    await page.goto('/nonexistent-page-xyz')
    await waitForApp(page)
    await expect(page.getByTestId('app-navigation')).toBeVisible()
    await expect(page.getByTestId('nav-sign-in-button')).toBeVisible()
    await expect(page.locator('text=404')).toBeVisible()
  })
})
