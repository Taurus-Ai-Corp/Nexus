import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about.html");
  });

  test("loads and shows hero with correct H1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toContain("About");
    expect(text).toContain("Mater Maria");
  });

  test("navigation is visible with logo", async ({ page }) => {
    const nav = page.locator("nav#nav");
    await expect(nav).toBeVisible();
    const logo = nav.locator("img[alt*='Mater Maria']");
    await expect(logo).toBeVisible();
  });

  test("nav CTA says Connect Now", async ({ page }) => {
    const size = page.viewportSize();
    if (size && size.width <= 1024) {
      test.skip(true, "Nav CTA hidden on mobile by design — hamburger menu replaces it");
      return;
    }
    const navCta = page.locator("nav .nav-cta");
    await expect(navCta).toBeVisible();
    await expect(navCta).toContainText(/Connect Now/i);
  });

  test("has ENQUIRE NOW and VIEW INVESTMENT TIERS CTAs", async ({ page }) => {
    const enquire = page.locator("a:has-text('ENQUIRE NOW')").first();
    const viewTiers = page.locator("a:has-text('VIEW INVESTMENT TIERS')").first();
    await expect(enquire).toBeVisible();
    await expect(viewTiers).toBeVisible();
  });

  test("footer is visible with left-aligned logo", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    const logo = footer.locator("img").first();
    await expect(logo).toBeVisible();
  });

  test("no 'site visit' language appears on page", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).not.toContain("site visit");
    expect(bodyText?.toLowerCase()).not.toContain("visit site");
    expect(bodyText?.toLowerCase()).not.toContain("book a tour");
  });

  test("page title contains Mater Maria", async ({ page }) => {
    await expect(page).toHaveTitle(/Mater Maria/);
  });
});
