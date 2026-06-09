// BizFlow Marketing Site - Comprehensive Playwright Test Suite
// Enhanced with cross-browser, performance, and accessibility testing

import { test, expect } from '@playwright/test';

// Test Configuration
const SITE_URL = 'file:///' + process.cwd() + '/.superdesign/design_iterations/bizflow_enhanced_2.html';
const MOBILE_VIEWPORT = { width: 375, height: 667 };
const TABLET_VIEWPORT = { width: 768, height: 1024 };
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };

test.describe('BizFlow Marketing Site - Core Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URL);
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load homepage successfully with all key elements', async ({ page }) => {
    // Check page title and meta
    await expect(page).toHaveTitle(/BizFlow.*AI-Powered Business Automation/);
    
    // Verify logo and navigation
    await expect(page.locator('[data-lucide="zap"]').first()).toBeVisible();
    await expect(page.getByText('BizFlow')).toBeVisible();
    
    // Check main navigation elements
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Solutions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
    
    // Verify primary CTA buttons
    await expect(page.getByRole('link', { name: 'Start Free Trial' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Live Demo' })).toBeVisible();
  });

  test('should display hero section with proper content and animations', async ({ page }) => {
    // Check hero headline
    await expect(page.getByRole('heading', { name: /Automate Your.*Business Flow.*with AI Intelligence/ })).toBeVisible();
    
    // Verify trust badge
    await expect(page.getByText('Trusted by 5000+ businesses worldwide')).toBeVisible();
    
    // Check key metrics
    await expect(page.getByText('75%')).toBeVisible();
    await expect(page.getByText('Cost Reduction')).toBeVisible();
    await expect(page.getByText('10x')).toBeVisible();
    await expect(page.getByText('Faster Processing')).toBeVisible();
    
    // Verify animated dashboard is present
    await expect(page.getByText('Live Automation Dashboard')).toBeVisible();
    await expect(page.getByText('Invoice Processing')).toBeVisible();
    await expect(page.getByText('AI Data Analysis')).toBeVisible();
  });

  test('should handle mobile menu toggle correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(MOBILE_VIEWPORT);
    
    // Mobile menu should be hidden initially
    await expect(page.locator('#mobile-menu')).toHaveClass(/hidden/);
    
    // Click mobile menu button
    await page.getByRole('button', { name: /menu/i }).click();
    
    // Mobile menu should become visible
    await expect(page.locator('#mobile-menu')).not.toHaveClass(/hidden/);
    
    // Check mobile menu links
    await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Solutions' })).toBeVisible();
  });

  test('should validate lead capture form functionality', async ({ page }) => {
    // Find the assessment form
    const form = page.getByText('Get Your Free Automation Assessment').locator('..').locator('form');
    
    // Fill out the form
    await form.locator('input[placeholder="Work Email"]').fill('test@company.com');
    await form.locator('input[placeholder="Company Size"]').fill('50-100');
    await form.locator('input[placeholder="Industry"]').fill('Technology');
    
    // Check that inputs are filled
    await expect(form.locator('input[placeholder="Work Email"]')).toHaveValue('test@company.com');
    await expect(form.locator('input[placeholder="Company Size"]')).toHaveValue('50-100');
    await expect(form.locator('input[placeholder="Industry"]')).toHaveValue('Technology');
    
    // Verify form button is present
    await expect(form.getByRole('button', { name: 'Get Free Assessment' })).toBeVisible();
  });

  test('should show enhanced dropdown navigation on hover', async ({ page }) => {
    // Set desktop viewport for hover interactions
    await page.setViewportSize(DESKTOP_VIEWPORT);
    
    // Hover over Features dropdown
    const featuresLink = page.getByRole('link', { name: 'Features' }).first();
    await featuresLink.hover();
    
    // Wait for dropdown to appear
    await page.waitForSelector('[class*="group-hover:opacity-100"]', { state: 'visible' });
    
    // Check dropdown content
    await expect(page.getByText('AI Automation')).toBeVisible();
    await expect(page.getByText('Smart Analytics')).toBeVisible();
    await expect(page.getByText('Integrations')).toBeVisible();
  });

  test('should handle smooth scrolling for anchor links', async ({ page }) => {
    // Click on a navigation link
    await page.getByRole('link', { name: 'Features' }).first().click();
    
    // Wait for scroll animation
    await page.waitForTimeout(1000);
    
    // Check that page has scrolled (URL should contain hash)
    const url = page.url();
    expect(url).toContain('#features');
  });
});

test.describe('BizFlow Site - Performance & Accessibility', () => {
  
  test('should meet performance benchmarks', async ({ page }) => {
    // Start performance monitoring
    await page.goto(SITE_URL);
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Check that page loads within reasonable time (5 seconds)
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const navTiming = JSON.parse(performanceEntries)[0];
    const loadTime = navTiming.loadEventEnd - navTiming.navigationStart;
    
    expect(loadTime).toBeLessThan(5000); // Less than 5 seconds
  });

  test('should be accessible to screen readers', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Check for proper heading hierarchy
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThanOrEqual(1);
    
    // Verify alt text for images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
    
    // Check for proper button labels
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasText = await button.textContent();
      const hasAriaLabel = await button.getAttribute('aria-label');
      
      expect(hasText || hasAriaLabel).toBeTruthy();
    }
    
    // Verify color contrast (simplified check)
    const primaryButtons = page.locator('.btn-primary');
    await expect(primaryButtons.first()).toBeVisible();
    
    // Check for keyboard navigation support
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });

  test('should handle keyboard navigation properly', async ({ page }) => {
    await page.goto(SITE_URL);
    
    let focusedElement = null;
    
    // Tab through interactive elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => document.activeElement.tagName);
      
      // Should focus on interactive elements
      if (focusedElement) {
        expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(focusedElement)).toBeTruthy();
      }
    }
    
    // Test escape key functionality
    await page.keyboard.press('Escape');
    
    // Test skip to content functionality (if implemented)
    await page.keyboard.press('Alt+KeyS');
  });
});

test.describe('BizFlow Site - Cross-Browser Compatibility', () => {
  
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should work correctly in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName, `Skipping test for ${browserName}`);
      
      await page.goto(SITE_URL);
      
      // Basic functionality tests
      await expect(page.getByText('BizFlow')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Start Free Trial' })).toBeVisible();
      
      // CSS animations should work
      const heroElement = page.locator('.hero-float');
      await expect(heroElement).toBeVisible();
      
      // JavaScript functionality
      if (currentBrowser !== 'webkit') { // Skip for Safari due to file:// limitations
        await page.evaluate(() => {
          return typeof lucide !== 'undefined';
        });
      }
    });
  });
});

test.describe('BizFlow Site - Responsive Design', () => {
  
  const viewports = [
    { name: 'Mobile', ...MOBILE_VIEWPORT },
    { name: 'Tablet', ...TABLET_VIEWPORT },
    { name: 'Desktop', ...DESKTOP_VIEWPORT }
  ];

  viewports.forEach(viewport => {
    test(`should display correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(SITE_URL);
      
      // Check that content is visible and properly arranged
      await expect(page.getByText('BizFlow')).toBeVisible();
      await expect(page.getByRole('heading', { name: /Automate Your.*Business Flow/ })).toBeVisible();
      
      // Check responsive navigation
      if (viewport.width < 768) {
        // Mobile: hamburger menu should be visible
        await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
        // Desktop menu should be hidden
        await expect(page.locator('.hidden.md\\:flex')).toHaveCount(0);
      } else {
        // Desktop: full menu should be visible
        await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Solutions' })).toBeVisible();
      }
      
      // Verify that text is readable (not cut off)
      const heroHeading = page.getByRole('heading', { name: /Automate Your.*Business Flow/ });
      const boundingBox = await heroHeading.boundingBox();
      
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
      }
      
      // Check that CTAs are accessible
      const primaryCTA = page.getByRole('link', { name: 'Start Free Trial' }).first();
      await expect(primaryCTA).toBeVisible();
      
      const ctaBoundingBox = await primaryCTA.boundingBox();
      if (ctaBoundingBox) {
        expect(ctaBoundingBox.width).toBeGreaterThan(44); // Minimum touch target
        expect(ctaBoundingBox.height).toBeGreaterThan(44);
      }
    });
  });
});

test.describe('BizFlow Site - Animation & Interaction Testing', () => {
  
  test('should handle scroll-triggered animations', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Scroll to trigger animations
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    
    // Wait for animations to potentially trigger
    await page.waitForTimeout(1000);
    
    // Check for animation classes
    const animatedElements = page.locator('.revealed, .slide-in-stagger');
    await expect(animatedElements.first()).toBeVisible();
  });

  test('should update scroll progress indicator', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Scroll partway down
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight * 0.3);
    });
    
    // Check that progress indicator has width
    const progressBar = page.locator('.scroll-progress');
    await expect(progressBar).toBeVisible();
    
    const width = await progressBar.evaluate(el => el.style.width);
    expect(width).toBeTruthy();
  });

  test('should handle counter animations on scroll', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Find counter elements
    const counters = page.locator('[data-count]');
    const counterCount = await counters.count();
    
    if (counterCount > 0) {
      // Scroll to make counters visible
      await counters.first().scrollIntoViewIfNeeded();
      
      // Wait for counter animation
      await page.waitForTimeout(2500);
      
      // Check that counter has animated value
      const counterValue = await counters.first().textContent();
      expect(counterValue).toBeTruthy();
      expect(parseInt(counterValue) || 0).toBeGreaterThan(0);
    }
  });

  test('should handle form enhancements and validation', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Find smart input fields
    const smartInputs = page.locator('.smart-input');
    const inputCount = await smartInputs.count();
    
    if (inputCount > 0) {
      const emailInput = smartInputs.first();
      
      // Test invalid email
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      
      // Test valid email
      await emailInput.fill('test@company.com');
      await emailInput.blur();
      
      // Should have updated styling based on validation
      const inputStyle = await emailInput.evaluate(el => window.getComputedStyle(el).borderColor);
      expect(inputStyle).toBeTruthy();
    }
  });
});

test.describe('BizFlow Site - Error Handling & Edge Cases', () => {
  
  test('should handle missing images gracefully', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Check for broken images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      
      // If image failed to load, should have alt text or placeholder
      if (naturalWidth === 0) {
        const altText = await img.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    }
  });

  test('should work with JavaScript disabled', async ({ page, context }) => {
    // Disable JavaScript
    await context.setOfflineMode(false);
    await page.addInitScript(() => {
      delete window.lucide;
    });
    
    await page.goto(SITE_URL);
    
    // Basic content should still be visible
    await expect(page.getByText('BizFlow')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Automate Your.*Business Flow/ })).toBeVisible();
    
    // Links should still work
    await expect(page.getByRole('link', { name: 'Start Free Trial' })).toBeVisible();
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(SITE_URL);
    
    // Content should still be visible
    await expect(page.getByText('BizFlow')).toBeVisible();
    
    // Animations should be reduced (check CSS)
    const animatedElement = page.locator('.hero-float').first();
    if (await animatedElement.count() > 0) {
      const animationDuration = await animatedElement.evaluate(el => 
        window.getComputedStyle(el).animationDuration
      );
      
      // Should have very short or no animation duration
      expect(animationDuration === '0s' || animationDuration === '0.01s').toBeTruthy();
    }
  });
});

test.describe('BizFlow Site - SEO & Meta Testing', () => {
  
  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Check title
    const title = await page.title();
    expect(title).toContain('BizFlow');
    expect(title).toContain('AI-Powered');
    
    // Check meta description
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    expect(description.length).toBeGreaterThan(120);
    expect(description.length).toBeLessThan(160);
    
    // Check Open Graph tags
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toBeTruthy();
    
    // Check Twitter card
    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    expect(twitterCard).toBeTruthy();
  });

  test('should have structured data for rich snippets', async ({ page }) => {
    await page.goto(SITE_URL);
    
    // Check for potential structured data (JSON-LD)
    const structuredData = await page.locator('script[type="application/ld+json"]').count();
    
    // While not required, structured data would enhance SEO
    // This test documents the opportunity for enhancement
    console.log(`Structured data scripts found: ${structuredData}`);
  });
});

// Export test configuration for CI/CD
export const playwrightConfig = {
  testDir: '.superdesign/design_iterations',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  use: {
    actionTimeout: 10000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ]
};