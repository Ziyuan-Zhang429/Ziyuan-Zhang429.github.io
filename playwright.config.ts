import { defineConfig, devices } from "@playwright/test";

const PORT = 5180;

/**
 * Browser tests for the epidemic simulator and the site shell. Starts the dev server itself.
 * Uses the installed Chrome (`channel: "chrome"`) so no browser download is needed locally; CI can use Playwright's.
 */
export default defineConfig({
    testDir: "tests/e2e",
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: `http://localhost:${PORT}`,
        channel: process.env.CI ? undefined : "chrome",
        trace: "retain-on-failure",
    },
    projects: [
        { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
        { name: "mobile", use: { ...devices["Pixel 7"], channel: process.env.CI ? undefined : "chrome" } },
    ],
    webServer: {
        command: `npx vite --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
    },
});
