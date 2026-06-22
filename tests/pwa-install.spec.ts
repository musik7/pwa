import { test, expect } from '@playwright/test';

test.describe('PWA install flow (GitHub Pages)', () => {
  test('serves manifest and registers service worker and handles install prompt', async ({ page }) => {
    await page.goto('/');

    // Check manifest link exists and is fetchable (resolve relative URL)
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestHref).toBeTruthy();

    const manifestUrl = new URL(manifestHref, page.url()).href;
    const manifest = await page.request.get(manifestUrl);
    expect(manifest.ok()).toBeTruthy();
    const manifestJson = await manifest.json();
    expect(manifestJson.start_url).toBe('./');

    // Wait for service worker to be registered
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration();
      return !!reg;
    });
    expect(swRegistered).toBeTruthy();

    // Simulate beforeinstallprompt event: create a fake event with prompt() and userChoice
    await page.evaluate(() => {
      class FakeEvent extends Event {
        constructor() { super('beforeinstallprompt'); }
      }
      const e = new FakeEvent();
      // Add prompt method and userChoice
      e.prompt = () => Promise.resolve();
      e.userChoice = Promise.resolve({ outcome: 'accepted' });
      // Dispatch
      window.dispatchEvent(e);
    });

    // Install button should be shown
    const installBtn = page.locator('#installBtn');
    await expect(installBtn).toBeVisible();

    // Click the button and ensure it hides after "installation"
    await installBtn.click();
    await expect(installBtn).toBeHidden();
  });
});
