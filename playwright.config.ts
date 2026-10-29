import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',

    // Tests can run in parallel
    fullyParallel: true,

    // Prevent accidental test.only in CI
    forbidOnly: !!process.env.CI,

    // Retry failures in CI
    retries: process.env.CI ? 2 : 0,

    // Keep CI stable
    workers: process.env.CI ? 1 : 1,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://openlibrary.org',

    headless: false,

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});