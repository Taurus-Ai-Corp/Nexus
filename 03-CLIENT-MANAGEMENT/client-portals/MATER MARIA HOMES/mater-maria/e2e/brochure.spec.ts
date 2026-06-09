import { test, expect } from "@playwright/test";

test.describe("Brochure Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/brochure.html");
  });

  test("loads and shows correct H1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Download Brochure");
  });

  test("form exists and has no hardcoded access_key", async ({ page }) => {
    const form = page.locator("#brochureForm");
    await expect(form).toBeVisible();
    // No hardcoded access_key input should exist
    const accessKeyInput = page.locator('input[name="access_key"]');
    await expect(accessKeyInput).toHaveCount(0);
  });

  test("form submits via /api/web3forms proxy", async ({ page }) => {
    const form = page.locator("#brochureForm");
    await expect(form).toBeVisible();
    // The form submits via JS fetch to /api/web3forms — check page body
    const bodyHtml = await page.locator("body").innerHTML();
    expect(bodyHtml).toContain("/api/web3forms");
  });

  test("form accepts valid input fields", async ({ page }) => {
    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.fill("#phone", "+91 98765 43210");
    await page.selectOption("#country", "India");

    const form = page.locator("#brochureForm");
    await expect(form).toBeVisible();
  });

  test("footer is visible", async ({ page }) => {
    const footer = page.locator("footer, .brochure-footer");
    await expect(footer).toBeVisible();
  });

  test("no 'site visit' language appears on page", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).not.toContain("site visit");
    expect(bodyText?.toLowerCase()).not.toContain("visit site");
    expect(bodyText?.toLowerCase()).not.toContain("book a tour");
  });

  test("page title contains Brochure", async ({ page }) => {
    await expect(page).toHaveTitle(/Brochure/i);
  });
});
