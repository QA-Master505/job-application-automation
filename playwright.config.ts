import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path'; // Modern Node import

// Load environment variables from .env at project root
dotenv.config({ path: path.resolve(__dirname, '.env') });

const CI = !!process.env.CI;
const BASE_URL = process.env.BASE_URL || 'https://example.com';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results/',

  fullyParallel: !CI, // Run in parallel locally, serially in CI
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: CI ? 'never' : 'on-failure' }]
  ],

  use: {
    baseURL: BASE_URL,
    headless: CI, // Headless in CI, can override locally
    trace: CI ? 'on-first-retry' : 'on',
    screenshot: 'only-on-failure',
    video: CI ? 'off' : 'on',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Uncomment for mobile browser/device testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Optional: If you have a dev server to start before running tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !CI,
  // },
});
