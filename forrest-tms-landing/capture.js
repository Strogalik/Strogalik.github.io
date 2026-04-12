const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 9000 } });
  await page.goto('file:///mnt/data/forrest-tms-landing/index.html', { waitUntil: 'load' });
  await page.screenshot({ path: '/mnt/data/forrest-tms-landing/preview.png', fullPage: true });
  await browser.close();
})();
