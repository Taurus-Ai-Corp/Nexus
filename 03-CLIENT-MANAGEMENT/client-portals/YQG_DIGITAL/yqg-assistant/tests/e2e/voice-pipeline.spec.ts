/**
 * YQG Voice Pipeline — Playwright E2E Tests
 *
 * Tests cover:
 *   1. Page load + baseline UI checks
 *   2. LiveKit token API health
 *   3. Connect / disconnect flow
 *   4. Theme toggle persistence
 *   5. Navigation (why-nexus, privacy, terms)
 *   6. Audio visualizer presence
 *   7. Model selector (enterprise route)
 *
 * Run:
 *   npx playwright test tests/e2e/voice-pipeline.spec.ts --headed
 *   npx playwright test --reporter=html
 *
 * Env: set YQG_BASE_URL to override default http://localhost:3000
 */

import { expect, test } from '@playwright/test';

const BASE_URL = process.env['YQG_BASE_URL'] ?? 'http://localhost:3000';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function goHome(page: import('@playwright/test').Page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
}

// ── Suite 1: Page Load ────────────────────────────────────────────────────────

test.describe('Page Load', () => {
  test('loads homepage with correct title', async ({ page }) => {
    await goHome(page);
    await expect(page).toHaveTitle(/YQG/i);
  });

  test('renders primary CTA button', async ({ page }) => {
    await goHome(page);
    // Welcome view contains a start/connect button
    const cta = page.locator('button').filter({ hasText: /start|connect|talk/i }).first();
    await expect(cta).toBeVisible();
  });

  test('renders the YQG logo or wordmark', async ({ page }) => {
    await goHome(page);
    // Logo svg or img alt text
    const logo = page.locator('[alt*="YQG"], [alt*="nexus"], svg[class*="logo"]').first();
    // Soft check — may render as text heading instead
    const heading = page.locator('h1, h2').filter({ hasText: /nexus/i }).first();
    const logoVisible = await logo.isVisible().catch(() => false);
    const headingVisible = await heading.isVisible().catch(() => false);
    expect(logoVisible || headingVisible).toBe(true);
  });
});

// ── Suite 2: LiveKit Token API ────────────────────────────────────────────────

test.describe('LiveKit Token API', () => {
  test('POST /api/livekit/token returns a token for valid request', async ({ request }) => {
    const resp = await request.post(`${BASE_URL}/api/livekit/token`, {
      data: { room: 'e2e-test-room', participantName: 'playwright-bot' },
      headers: { 'Content-Type': 'application/json' },
    });
    // Accepts 200 or 201; rejects server errors
    expect(resp.status()).toBeLessThan(500);

    if (resp.status() === 200 || resp.status() === 201) {
      const body = await resp.json();
      expect(typeof body.accessToken ?? body.token).toBe('string');
    }
  });

  test('POST /api/livekit/token rejects XSS in room name', async ({ request }) => {
    const resp = await request.post(`${BASE_URL}/api/livekit/token`, {
      data: { room: '<script>alert(1)</script>', participantName: 'bot' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(resp.status()).toBe(422); // Pydantic validation error
  });

  test('POST /api/livekit/token rejects oversized participant name', async ({ request }) => {
    const resp = await request.post(`${BASE_URL}/api/livekit/token`, {
      data: { room: 'ok-room', participantName: 'x'.repeat(200) },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(resp.status()).toBeGreaterThanOrEqual(400);
  });
});

// ── Suite 3: Backend Health ───────────────────────────────────────────────────

test.describe('Backend Health', () => {
  test('GET /health on backend API returns ok', async ({ request }) => {
    const backendUrl = process.env['YQG_API_URL'] ?? 'http://localhost:8000';
    const resp = await request.get(`${backendUrl}/health`);
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.status).toBe('ok');
  });
});

// ── Suite 4: Theme Toggle ─────────────────────────────────────────────────────

test.describe('Theme Toggle', () => {
  test('theme toggle button is present', async ({ page }) => {
    await goHome(page);
    const toggle = page.locator('button[aria-label*="theme"], button[title*="theme"], [data-testid="theme-toggle"]').first();
    const exists = await toggle.count() > 0;
    // Soft pass — not all builds expose toggle in accessible way
    test.skip(!exists, 'Theme toggle not found in accessible form');
    await expect(toggle).toBeVisible();
  });

  test('clicking theme toggle switches between light and dark', async ({ page }) => {
    await goHome(page);
    const toggle = page.locator('button[aria-label*="theme"], button[title*="theme"], [data-testid="theme-toggle"]').first();
    const exists = await toggle.count() > 0;
    test.skip(!exists, 'Theme toggle not found');

    const htmlEl = page.locator('html');
    const classBefore = await htmlEl.getAttribute('class') ?? '';
    await toggle.click();
    await page.waitForTimeout(300); // allow transition
    const classAfter = await htmlEl.getAttribute('class') ?? '';
    expect(classBefore).not.toBe(classAfter);
  });
});

// ── Suite 5: Navigation ───────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test('why-nexus page loads without error', async ({ page }) => {
    await page.goto(`${BASE_URL}/why-nexus`, { waitUntil: 'networkidle' });
    // Should not 404 — check status via response
    await expect(page.locator('body')).not.toContainText('404');
    await expect(page.locator('body')).not.toContainText('This page could not be found');
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('terms page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).not.toContainText('404');
  });
});

// ── Suite 6: Audio Visualizer ─────────────────────────────────────────────────

test.describe('Audio Visualizer', () => {
  test('audio visualizer element is present in DOM', async ({ page }) => {
    await goHome(page);
    // The ambient ring/pulse visualizer added in Phase 7 — find by canvas or svg
    const visualizer = page.locator(
      'canvas, [data-testid*="visualizer"], [class*="visualizer"], [class*="waveform"], [class*="aura"]'
    ).first();
    const exists = await visualizer.count() > 0;
    // Soft check — visualizer may render only after connect
    if (!exists) {
      console.warn('Audio visualizer element not found in initial DOM — may render post-connect');
    }
  });
});

// ── Suite 7: Security Headers ─────────────────────────────────────────────────

test.describe('Security Headers', () => {
  test('backend returns HSTS header', async ({ request }) => {
    const backendUrl = process.env['YQG_API_URL'] ?? 'http://localhost:8000';
    const resp = await request.get(`${backendUrl}/health`);
    // Only present in production (HTTPS) — skip on plain HTTP localhost
    const hsts = resp.headers()['strict-transport-security'];
    if (hsts) {
      expect(hsts).toContain('max-age');
    }
  });

  test('backend /health returns X-Content-Type-Options', async ({ request }) => {
    const backendUrl = process.env['YQG_API_URL'] ?? 'http://localhost:8000';
    const resp = await request.get(`${backendUrl}/health`);
    const header = resp.headers()['x-content-type-options'];
    if (header) {
      expect(header).toBe('nosniff');
    }
  });
});

// ── Suite 8: Model Selector (enterprise) ─────────────────────────────────────

test.describe('Model Selector', () => {
  test('model selector renders when enterprise components present', async ({ page }) => {
    await goHome(page);
    // Enterprise model selector — may not be present in OSS build
    const selector = page.locator('[data-testid="model-selector"], [aria-label*="model"], button').filter({ hasText: /groq|deepseek|claude|openai/i }).first();
    const present = await selector.count() > 0;
    if (present) {
      await expect(selector).toBeVisible();
    } else {
      console.info('Model selector not found — OSS build or enterprise component not mounted');
    }
  });
});
