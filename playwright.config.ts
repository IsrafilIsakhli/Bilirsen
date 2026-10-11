import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'apps/mobile/tests',
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:8081',
    viewport: { width: 390, height: 844 },
    launchOptions: {
      executablePath:
        process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    },
    trace: 'retain-on-failure',
  },
  outputDir: 'output/testing/playwright',
});
