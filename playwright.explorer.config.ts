import { defineConfig, devices } from "@playwright/test";

const appHost = "127.0.0.1";
const appPort = process.env.PLAYWRIGHT_EXPLORER_PORT || "55444";
const appUrl = `http://${appHost}:${appPort}`;

export default defineConfig({
  testDir: "./tests/explorer",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: appUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev --workspace birdman-explorer -- --host ${appHost} --port ${appPort} --strictPort`,
    url: appUrl,
    reuseExistingServer: !process.env.CI,
  },
});
