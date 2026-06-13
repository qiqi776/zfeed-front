import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    timeout: 30_000,
    expect: {
        timeout: 5_000
    },
    use: {
        baseURL: "http://127.0.0.1:55002",
        channel: "chrome",
        trace: "on-first-retry"
    },
    webServer: {
        command: "npm run dev -- --port 55002",
        url: "http://127.0.0.1:55002",
        reuseExistingServer: false,
        timeout: 120_000
    },
    projects: [
        {
            name: "chromium-desktop",
            use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1100 } }
        },
        {
            name: "chromium-mobile",
            use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } }
        }
    ]
});
