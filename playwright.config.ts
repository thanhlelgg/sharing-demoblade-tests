import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.demoblaze.com/',
    headless: process.env.HEADLESS !== 'false',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/api/**/*.spec.ts', '**/performance/**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      testIgnore: ['**/api/**/*.spec.ts', '**/performance/**/*.spec.ts'],
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      testIgnore: ['**/api/**/*.spec.ts', '**/performance/**/*.spec.ts'],
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'mobile-chromium',
      testIgnore: ['**/api/**/*.spec.ts', '**/performance/**/*.spec.ts'],
      use: {
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'mobile-webkit',
      testIgnore: ['**/api/**/*.spec.ts', '**/performance/**/*.spec.ts'],
      use: {
        ...devices['iPhone 13'],
      },
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL: process.env.API_BASE_URL ?? 'https://api.demoblaze.com',
      },
    },
    {
      name: 'performance',
      testMatch: '**/performance/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL ?? 'https://www.demoblaze.com/',
      },
    },
  ],
  outputDir: 'test-results',
});
