import { defineConfig, devices } from '@playwright/test';

/**
 * YQG Voice Pipeline — Playwright configuration
 * Run: npx playwright test tests/e2e/voice-pipeline.spec.ts --headed
 */

const BASE_URL = process.env['YQG_BASE_URL'] ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // voice tests are sequential (shared port)
  retries: 1,
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Auto-start dev server when running locally
  webServer: process.env['CI']
    ? undefined
    : {
        command: 'pnpm dev',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
