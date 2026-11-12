import { expect, test } from "@playwright/test";

test.describe("site", () => {
    test("navigates between pages and sets titles", async ({ page, isMobile }) => {
        await page.goto("/");
        await expect(page).toHaveTitle("Ziyuan Zhang — Infectious Disease Epidemiology");
        if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
        await page.getByRole("link", { name: "Publications" }).first().click();
        await expect(page).toHaveTitle("Publications — Ziyuan Zhang");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Publications & Manuscripts");
        // Navigating closes the mobile menu.
        if (isMobile) await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
    });

    test("old .html URLs redirect and unknown ones show the 404", async ({ page }) => {
        await page.goto("/research.html");
        await expect(page).toHaveURL(/\/research$/);
        await page.goto("/nope");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page didn’t spread.");
    });

    test("research filters by area from the URL", async ({ page }) => {
        await page.goto("/research?area=suicide");
        await expect(page.locator("main [id] h3")).toHaveCount(2);
    });

    test("publications search and first-author filter", async ({ page }) => {
        await page.goto("/publications");
        await page.getByPlaceholder(/Search titles/).fill("buprenorphine");
        await expect(page.locator("main article")).toHaveCount(2);
        await page.getByPlaceholder(/Search titles/).fill("");
        await page
            .getByRole("radio", { name: "First author" })
            .or(page.getByRole("button", { name: "First author" }))
            .first()
            .click();
        await expect(page.locator("main article")).toHaveCount(3);
    });

    test("theme toggle persists dark mode", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: /Switch to dark mode/ }).click();
        await expect(page.locator("html")).toHaveClass(/dark-mode/);
        await page.reload();
        await expect(page.locator("html")).toHaveClass(/dark-mode/);
    });
});
