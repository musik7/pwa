import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    actionTimeout: 0,
    // Point tests to the GitHub Pages URL for the project site
    baseURL: 'https://musik7.github.io/pwa',
    trace: 'on-first-retry',
  }
});
