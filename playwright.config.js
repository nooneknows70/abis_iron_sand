const { defineConfig, devices } = require("@playwright/test");

const LINE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1 Line/14.10.0";

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "e2e.spec.js",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 30000,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:4173/abis_iron_sand/",
    locale: "zh-TW",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "node tests/static-server.js",
        url: "http://127.0.0.1:4173/abis_iron_sand/",
        reuseExistingServer: false,
        timeout: 15000,
      },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "android-chrome-pixel", use: { ...devices["Pixel 7"] } },
    {
      name: "iphone-chromium-emulation",
      use: { ...devices["iPhone 14"], browserName: "chromium", defaultBrowserType: "chromium" },
    },
    {
      name: "line-inapp-ua",
      use: {
        ...devices["iPhone 14"],
        browserName: "chromium",
        defaultBrowserType: "chromium",
        userAgent: LINE_UA,
      },
    },
  ],
});
