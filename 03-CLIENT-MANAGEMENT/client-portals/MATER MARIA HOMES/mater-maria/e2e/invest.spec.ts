import { test, expect } from "@playwright/test";

test.describe("Invest Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to the static HTML to avoid redirect
    await page.goto("/invest.html");
  });

  test("loads and shows hero with correct H1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toContain("High-Yield Asset");
  });

  test("displays exactly 3 investment tiers", async ({ page }) => {
    const tierCards = page.locator(".t-card");
    await expect(tierCards).toHaveCount(3);
  });

  test("Silver tier shows ₹10L investment amount", async ({ page }) => {
    const cards = page.locator(".t-card");
    const silver = cards.nth(0);
    await expect(silver).toContainText("₹10L");
    await expect(silver).toContainText("Silver");
  });

  test("Gold tier shows ₹20L investment amount", async ({ page }) => {
    const cards = page.locator(".t-card");
    const gold = cards.nth(1);
    await expect(gold).toContainText("₹20L");
    await expect(gold).toContainText("Gold");
  });

  test("Platinum tier shows ₹30L investment amount", async ({ page }) => {
    const cards = page.locator(".t-card");
    const platinum = cards.nth(2);
    await expect(platinum).toContainText("₹30L");
    await expect(platinum).toContainText("Platinum");
  });

  test("each tier shows deposit-to-share conversion bullet", async ({ page }) => {
    const cards = page.locator(".t-card");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText("Deposit converts to share capital at Year 5");
    }
  });

  test("each tier shows 'in addition to free stay' stacking language", async ({ page }) => {
    const cards = page.locator(".t-card");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText("in addition to free stay");
    }
  });

  test("each tier shows 150 pax capacity on event hall", async ({ page }) => {
    const cards = page.locator(".t-card");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText("150 pax capacity");
    }
  });

  test("Platinum only shows Director Board liaison", async ({ page }) => {
    const cards = page.locator(".t-card");
    const platinum = cards.nth(2);
    await expect(platinum).toContainText("Director Board");

    const silver = cards.nth(0);
    await expect(silver).not.toContainText("Director Board");

    const gold = cards.nth(1);
    await expect(gold).not.toContainText("Director Board");
  });

  test("Strategy Timeline section is visible", async ({ page }) => {
    const timeline = page.locator("#strategy");
    await expect(timeline).toBeVisible();
    await expect(timeline).toContainText("Deposit converts to share capital");
  });

  test("Share Sale & Exit Terms section is visible", async ({ page }) => {
    const exitTerms = page.locator("#exit-terms");
    await expect(exitTerms).toBeVisible();
    await expect(exitTerms).toContainText("5");
    await expect(exitTerms).toContainText("6");
    await expect(exitTerms).toContainText("3");
    await expect(exitTerms).toContainText("Equal Instalments");
  });

  test("lead capture form progresses through all steps", async ({ page }) => {
    // Step 1 is visible by default
    const step1 = page.locator("#step-1");
    await expect(step1).toHaveClass(/active/);

    // Fill step 1 and proceed
    await page.fill("#mf-name", "Test User");
    await page.fill("#mf-email", "test@example.com");
    await page.fill("#mf-phone", "+91 98765 43210");
    await page.click("button:has-text('Next')");

    // Step 2 should now be active
    const step2 = page.locator("#step-2");
    await expect(step2).toHaveClass(/active/);

    // Fill step 2 and proceed
    await page.selectOption("#mf-tier", "Gold");
    await page.click("#step-2 button:has-text('Next')");

    // Step 3 should now be active with summary
    const step3 = page.locator("#step-3");
    await expect(step3).toHaveClass(/active/);
    await expect(step3).toContainText("Test User");
  });

  test("lead capture form accepts valid input", async ({ page }) => {
    await page.fill("#mf-name", "Test User");
    await page.fill("#mf-email", "test@example.com");
    await page.fill("#mf-phone", "+91 98765 43210");

    const form = page.locator(".multi-form");
    await expect(form).toBeVisible();
  });

  test("lead capture form submits data to /api/web3forms", async ({ page }) => {
    // Mock the API endpoint so we don't need real credentials
    await page.route("/api/web3forms", async (route) => {
      const req = route.request();
      const body = await req.postDataJSON();
      expect(body.name).toBe("Test Investor");
      expect(body.email).toBe("investor@example.com");
      expect(body.subject).toContain("Investment Enquiry");
      expect(body.message).toContain("Tier:");
      await route.fulfill({ status: 200, json: { success: true } });
    });

    // Progress through all 3 steps
    await page.fill("#mf-name", "Test Investor");
    await page.fill("#mf-email", "investor@example.com");
    await page.fill("#mf-phone", "+91 98765 43210");
    await page.click("#step-1 button:has-text('Next')");

    await page.selectOption("#mf-tier", "Gold");
    await page.click("#step-2 button:has-text('Next')");

    // Step 3: submit
    await page.click("#submit-btn");

    // Should reach success state
    const success = page.locator("#step-success");
    await expect(success).toHaveClass(/active/);
    await expect(success).toContainText("Enquiry Received");
  });

  test("navigation CTA says 'CONNECT NOW'", async ({ page }) => {
    const size = page.viewportSize();
    if (size && size.width <= 1024) {
      test.skip(true, "Nav CTA hidden on mobile by design — hamburger menu replaces it");
      return;
    }
    const navCta = page.locator("nav .nav-cta");
    await expect(navCta).toBeVisible();
    await expect(navCta).toContainText("CONNECT NOW");
  });

  test("no 'site visit' language appears on page", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).not.toContain("site visit");
    expect(bodyText?.toLowerCase()).not.toContain("visit site");
    expect(bodyText?.toLowerCase()).not.toContain("book a tour");
  });
});

test.describe("Invest Page — Responsive", () => {
  test("tiers stack vertically on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/invest.html");

    const tierCards = page.locator(".t-card");
    await expect(tierCards).toHaveCount(3);

    // All cards should be visible on mobile
    for (let i = 0; i < 3; i++) {
      await expect(tierCards.nth(i)).toBeVisible();
    }
  });
});
