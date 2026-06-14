// Basic test file for Mater Maria Homes

describe('Mater Maria Homes', () => {
  test('project structure exists', () => {
    const fs = require('fs');
    expect(fs.existsSync('public')).toBe(true);
    expect(fs.existsSync('package.json')).toBe(true);
  });

  test('HTML files exist', () => {
    const fs = require('fs');
    const htmlFiles = [
      'public/index-landing.html',
      'public/about.html',
      'public/invest.html',
      'public/brochure.html',
      'public/privacy.html',
      'public/terms.html'
    ];
    
    htmlFiles.forEach(file => {
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  test('images are optimized', () => {
    const fs = require('fs');
    const webpFiles = fs.readdirSync('public/assets-2025/images/renders/webp');
    expect(webpFiles.length).toBeGreaterThan(0);
  });
});
