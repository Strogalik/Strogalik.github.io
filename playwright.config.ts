import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60000,
  expect: { timeout: 15000 },
  workers: 1,
  use: {
    baseURL: process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000",
    headless: true,
    launchOptions: {
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    },
    screenshot: "only-on-failure",
  },
  reporter: [["list"], ["json", { outputFile: "test-results/report.json" }]],
});
