import { webkit, devices } from 'playwright';
import { env } from 'process';

(async () => {
  const iPhone16Preset = devices['iPhone 16'];
  const fallbackIPhone16 = {
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  };

  const contextOptions = iPhone16Preset ?? fallbackIPhone16;

  const browser = await webkit.launch();
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForLoadState('networkidle');

  // Attempt to wait for a key UI element; ignore if not found within timeout
  try {
    await page.waitForSelector('h1:has-text("Transform any content into beautiful speech")', { timeout: 15000 });
  } catch {}

  const path = env.SCREENSHOT_PATH || `ui-preview-${Date.now()}.png`;
  await page.screenshot({ path, fullPage: false });
  await browser.close();
  console.log(`Screenshot saved to ${path}`);
})();
