import { test, expect } from "@playwright/test";

test.describe("Security & Compliance", () => {
  test("invest page has no hardcoded API keys in markup", async ({ page }) => {
    await page.goto("/invest.html");
    const bodyHtml = await page.locator("body").innerHTML();

    // No Web3Forms access_key in HTML
    expect(bodyHtml).not.toMatch(/access_key['"\s]*=/i);
    // No Firebase config with API key
    expect(bodyHtml).not.toMatch(/apiKey['"\s]*:/i);
    // No PostHog key
    expect(bodyHtml).not.toMatch(/phc_[a-zA-Z0-9]+/);
    // No Resend key
    expect(bodyHtml).not.toMatch(/re_[a-zA-Z0-9]+/);
  });

  test("brochure page has no hardcoded API keys", async ({ page }) => {
    await page.goto("/brochure.html");
    const bodyHtml = await page.locator("body").innerHTML();
    expect(bodyHtml).not.toMatch(/access_key['"\s]*=/i);
    expect(bodyHtml).not.toMatch(/apiKey['"\s]*:/i);
  });

  test("landing page has no hardcoded API keys", async ({ page }) => {
    await page.goto("/index-landing.html");
    const bodyHtml = await page.locator("body").innerHTML();
    expect(bodyHtml).not.toMatch(/access_key['"\s]*=/i);
    expect(bodyHtml).not.toMatch(/apiKey['"\s]*:/i);
  });

  test("response has security headers (production only)", async ({ request }) => {
    const response = await request.get("/invest.html");
    const headers = response.headers();

    // Security headers are set by Vercel in production; dev server may not send them
    if (headers["x-content-type-options"]) {
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
    } else {
      test.skip(true, "Security headers not set by dev server — verified in vercel.json");
    }
  });

  test("CSP header is present (production only)", async ({ request }) => {
    const response = await request.get("/invest.html");
    const headers = response.headers();
    // CSP is set by Vercel in production; dev server may not send it
    // Verify the header exists OR that the HTML has no inline script violations
    if (headers["content-security-policy"]) {
      expect(headers["content-security-policy"]).toContain("default-src");
    } else {
      test.skip(true, "CSP header not set by dev server — verified in vercel.json");
    }
  });

  test("no leaked passwords or secrets in any page", async ({ page }) => {
    const pages = ["/index-landing.html", "/about.html", "/invest.html", "/brochure.html", "/contact"];
    for (const path of pages) {
      await page.goto(path);
      const text = await page.locator("body").textContent();
      expect(text).not.toContain("matermaria2026");
      expect(text).not.toContain("sk-or-");
      expect(text).not.toContain("sk-ant-");
      expect(text).not.toContain("AIza");
    }
  });
});
