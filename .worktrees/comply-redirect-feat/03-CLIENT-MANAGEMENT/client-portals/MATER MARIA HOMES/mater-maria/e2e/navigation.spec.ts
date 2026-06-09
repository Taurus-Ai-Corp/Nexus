import { test, expect } from "@playwright/test";

test.describe("Cross-Page Navigation", () => {
  test("landing INVEST NOW button navigates to invest.html", async ({ page }) => {
    await page.goto("/index-landing.html");
    const investBtn = page.locator("a:has-text('INVEST NOW')").first();
    await expect(investBtn).toBeVisible();
    const href = await investBtn.getAttribute("href");
    expect(href).toMatch(/invest/);
  });

  test("landing ENQUIRE NOW scrolls to contact section", async ({ page }) => {
    await page.goto("/index-landing.html");
    const enquireBtn = page.locator(".btn-outline-w:has-text('ENQUIRE NOW')").first();
    await expect(enquireBtn).toBeVisible();
    await enquireBtn.click();
    const contact = page.locator("#contact");
    await expect(contact).toBeVisible();
  });

  test("invest page Silver CTA selects tier and scrolls to form", async ({ page }) => {
    await page.goto("/invest.html");
    const silverCta = page.locator("button:has-text('Select Silver')");
    await expect(silverCta).toBeVisible();
    await silverCta.click();
    const form = page.locator(".multi-form");
    await expect(form).toBeVisible();
    const tierSelect = page.locator("#mf-tier");
    const value = await tierSelect.inputValue();
    expect(value).toBe("Silver");
  });

  test("about page VIEW INVESTMENT TIERS links to invest", async ({ page }) => {
    await page.goto("/about.html");
    const viewTiers = page.locator("a.nav-cta:has-text('VIEW INVESTMENT TIERS')");
    await expect(viewTiers).toBeVisible();
    const href = await viewTiers.getAttribute("href");
    expect(href).toMatch(/invest/);
  });

  test("all pages have consistent nav with logo", async ({ page }) => {
    // Brochure is a standalone form page without nav — skip it
    const pages = ["/index-landing.html", "/about.html", "/invest.html", "/contact"];
    for (const path of pages) {
      await page.goto(path);
      // Use first nav to avoid strict-mode violation on pages with breadcrumb navs
      const nav = page.locator("nav").first();
      await expect(nav).toBeVisible();
      // Logo may be img (static HTML) or SVG/role=img (React) — check alt text or aria-label
      const logo = nav.locator("img[alt*='Mater Maria'], [role='img'][aria-label*='Mater Maria']").first();
      await expect(logo).toBeVisible();
    }
  });

  test("all pages have consistent footer", async ({ page }) => {
    // Brochure is a standalone form page without footer — skip it
    const pages = ["/index-landing.html", "/about.html", "/invest.html", "/contact"];
    for (const path of pages) {
      await page.goto(path);
      const footer = page.locator("footer, .footer, .brochure-footer");
      await expect(footer).toBeVisible();
      // Logo may be img (static HTML) or SVG/role=img (React)
      const logo = footer.locator("img, [role='img']").first();
      await expect(logo).toBeVisible();
    }
  });

  test("no page contains 'site visit' language", async ({ page }) => {
    const pages = ["/index-landing.html", "/about.html", "/invest.html", "/brochure.html", "/contact"];
    for (const path of pages) {
      await page.goto(path);
      const bodyText = await page.locator("body").textContent();
      expect(bodyText?.toLowerCase()).not.toContain("site visit");
      expect(bodyText?.toLowerCase()).not.toContain("visit site");
      expect(bodyText?.toLowerCase()).not.toContain("book a tour");
    }
  });
});
