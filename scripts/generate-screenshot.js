const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  // Wait for the main content to be visible to ensure the page has loaded
  await page.waitForSelector('h1', { text: 'Transform any content into beautiful speech' });
  const path = process.env.SCREENSHOT_PATH || `ui-preview-${Date.now()}.png`;
  await page.screenshot({ path });
  await browser.close();
  console.log(`Screenshot saved to ${path}`);
})();
