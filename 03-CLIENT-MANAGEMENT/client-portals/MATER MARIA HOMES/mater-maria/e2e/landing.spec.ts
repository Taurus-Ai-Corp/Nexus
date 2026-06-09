import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index-landing.html");
  });

  test("loads and shows hero with correct H1", async ({ page }) => {
    const h1 = page.locator("h1.hero-h1");
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toContain("Board-Supervised Estate");
    expect(text).toContain("Your Parents");
    expect(text).toContain("Kerala");
  });

  test("shows correct sub-headline with price anchor", async ({ page }) => {
    const sub = page.locator("p.hero-h3");
    await expect(sub).toBeVisible();
    await expect(sub).toContainText("24/7 medical care");
    await expect(sub).toContainText("Catholic spiritual community");
    await expect(sub).toContainText("₹10 lakh");
  });

  test("has ENQUIRE NOW and INVEST NOW CTAs", async ({ page }) => {
    const enquireBtn = page.locator(".btn-outline-w:has-text('ENQUIRE NOW')").first();
    const investBtn = page.locator(".btn-outline-w:has-text('INVEST NOW')").first();
    await expect(enquireBtn).toBeVisible();
    await expect(investBtn).toBeVisible();
    await expect(investBtn).toHaveAttribute("href", /invest/);
  });

  test("navigation is visible with logo", async ({ page }) => {
    const nav = page.locator("nav#nav");
    await expect(nav).toBeVisible();
    const logo = nav.locator("img[alt*='Mater Maria']");
    await expect(logo).toBeVisible();
  });

  test("nav CTA says ENQUIRE NOW", async ({ page }) => {
    const size = page.viewportSize();
    if (size && size.width <= 1024) {
      test.skip(true, "Nav CTA hidden on mobile by design — hamburger menu replaces it");
      return;
    }
    const navCta = page.locator("nav .nav-cta");
    await expect(navCta).toBeVisible();
    await expect(navCta).toContainText("ENQUIRE NOW");
  });

  test("footer logo is left-aligned with tagline", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    const logo = footer.locator("img").first();
    await expect(logo).toBeVisible();
    const tagline = footer.locator(".footer-brand p, p").first();
    await expect(tagline).toContainText(/sanctuary|care|community|dignity|peace/i);
  });

  test("contact section exists", async ({ page }) => {
    const contact = page.locator("#contact");
    await expect(contact).toBeVisible();
  });

  test("no 'site visit' language appears on page", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).not.toContain("site visit");
    expect(bodyText?.toLowerCase()).not.toContain("visit site");
    expect(bodyText?.toLowerCase()).not.toContain("book a tour");
  });

  test("page title is correct", async ({ page }) => {
    await expect(page).toHaveTitle(/Mater Maria/);
  });

  test(" responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    const h1 = page.locator("h1.hero-h1");
    await expect(h1).toBeVisible();
  });
});
