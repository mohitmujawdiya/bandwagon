import { defineConfig } from 'vitest/config'

// Scope unit tests to src/ so vitest never tries to run the Playwright specs in
// tests/ (those use @playwright/test, not vitest).
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
})
