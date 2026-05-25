import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("loads and shows hero with correct heading", async ({ page }) => {
    const heading = page.locator("h2", { hasText: "Contact Us" });
    await expect(heading).toBeVisible();
  });

  test("displays contact form with all fields", async ({ page }) => {
    await expect(page.locator("input#name")).toBeVisible();
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("input#phone")).toBeVisible();
    await expect(page.locator("textarea#message")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("contact form submits data to /api/web3forms", async ({ page }) => {
    // Mock the API endpoint
    await page.route("/api/web3forms", async (route) => {
      const req = route.request();
      const body = await req.postDataJSON();
      expect(body.name).toBe("Jane Resident");
      expect(body.email).toBe("jane@example.com");
      expect(body.phone).toBe("+91 98765 43210");
      expect(body.subject).toContain("General / Residence Enquiry");
      expect(body.message).toContain("Preferred Contact Method: whatsapp");
      expect(body.message).toContain("Looking for a 1 BHK unit for my parents.");
      await route.fulfill({ status: 200, json: { success: true } });
    });

    await page.fill("input#name", "Jane Resident");
    await page.fill("input#email", "jane@example.com");
    await page.fill("input#phone", "+91 98765 43210");
    await page.check("input[value='whatsapp']");
    await page.fill("textarea#message", "Looking for a 1 BHK unit for my parents.");

    await page.click("button[type='submit']");

    // Should reach success state
    const successHeading = page.locator("h3", { hasText: "Thank You!" });
    await expect(successHeading).toBeVisible();
  });

  test("shows validation errors for empty required fields", async ({ page }) => {
    await page.click("button[type='submit']");

    await expect(page.locator("text=Name must be at least 2 characters")).toBeVisible();
    await expect(page.locator("text=Please enter a valid email address")).toBeVisible();
    await expect(page.locator("text=Message must be at least 10 characters")).toBeVisible();
  });

  test("contact information card shows phone, email, address", async ({ page }) => {
    // Scope to main content to avoid matching footer duplicates
    const main = page.locator("#main-content");
    await expect(main.getByText("+91 94470 80356").first()).toBeVisible();
    await expect(main.getByText("Info@matermariahomes.com").first()).toBeVisible();
    await expect(main.getByText("Kanjirappally, Kottayam, Kerala 686507").first()).toBeVisible();
  });

  test("WhatsApp CTA links to correct number", async ({ page }) => {
    // Target the specific WhatsApp card, not all wa.me links on the page
    const whatsappCard = page.locator("a", { hasText: "Chat on WhatsApp" });
    await expect(whatsappCard).toBeVisible();
    const href = await whatsappCard.getAttribute("href");
    expect(href).toContain("919447080356");
  });

  test("navigation CTA says 'ENQUIRE NOW'", async ({ page }) => {
    const size = page.viewportSize();
    if (size && size.width <= 1024) {
      test.skip(true, "Nav CTA hidden on mobile by design — hamburger menu replaces it");
      return;
    }
    const header = page.locator("header");
    await expect(header.getByRole("button", { name: "Enquire Now" })).toBeVisible();
  });

  test("no 'site visit' language appears on page", async ({ page }) => {
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).not.toContain("site visit");
    expect(bodyText?.toLowerCase()).not.toContain("visit site");
    expect(bodyText?.toLowerCase()).not.toContain("book a tour");
  });
});
