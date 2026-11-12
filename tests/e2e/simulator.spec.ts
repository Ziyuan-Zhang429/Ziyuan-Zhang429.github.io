import { expect, test } from "@playwright/test";
import { SLIDER, chip, dayReadout, isPlaying, layoutSnapshot, openHome, simulator, sliderText, sliders, toSetup } from "./helpers";

test.describe("epidemic simulator", () => {
    test("opens on ancestral COVID-19, elderly, playing, with a clean URL", async ({ page }) => {
        await openHome(page);
        await expect(chip(page, "COVID-19 (ancestral)")).toHaveAttribute("aria-checked", "true");
        await expect(chip(page, "Elderly")).toHaveAttribute("aria-checked", "true");
        expect(await sliderText(page, SLIDER.ifr)).toBe("4.6%");
        expect(await isPlaying(page)).toBe(true);
        await page.waitForTimeout(500);
        expect(new URL(page.url()).search).toBe("");
        await expect(simulator(page).locator("svg g.group\\/node")).toHaveCount(250);
    });

    test("presets and parameter changes set up a run without starting it", async ({ page }) => {
        await openHome(page);
        await chip(page, "Measles").click();
        await expect(dayReadout(page)).toHaveText("0");
        expect(await isPlaying(page)).toBe(false);
        await sliders(page).nth(SLIDER.contacts).focus();
        await page.keyboard.press("ArrowLeft");
        expect(await isPlaying(page)).toBe(false);
        await page.getByRole("button", { name: "Play", exact: true }).click();
        await expect(dayReadout(page)).not.toHaveText("0", { timeout: 5000 });
    });

    test("population changes only the fatality rate, shown consistently", async ({ page }) => {
        await openHome(page);
        const expected: Record<string, string> = { Infants: "0.0054%", Adults: "0.01%", "Middle-aged": "0.4%", Elderly: "4.6%", "All ages": "0.47%" };
        for (const [population, ifr] of Object.entries(expected)) {
            await chip(page, population).click();
            expect(await sliderText(page, SLIDER.ifr)).toBe(ifr);
        }
        await chip(page, "Measles").click();
        await expect(simulator(page).locator("[class*='grid-area:population'] > div")).toHaveClass(/invisible/);
    });

    test("Ebola shows its sources, 50% fatality and shorter infectiousness when fatal", async ({ page }) => {
        await openHome(page);
        await chip(page, "Ebola").click();
        expect(await sliderText(page, SLIDER.ifr)).toBe("50%");
        expect(await sliderText(page, SLIDER.recoveryDays)).toBe("16.4 days");
        expect(await sliderText(page, SLIDER.deathDays)).toBe("7.5 days");
        await expect(simulator(page).getByText(/R₀ 1\.71–2\.02/)).toBeVisible();
    });

    test("during setup, clicking a person toggles them as an initial infected", async ({ page }) => {
        await openHome(page);
        await toSetup(page);
        const before = Number(await sliders(page).nth(SLIDER.initialCases).inputValue());
        const person = simulator(page).locator("svg g.group\\/node").nth(40);
        await person.click({ force: true });
        await expect(sliders(page).nth(SLIDER.initialCases)).toHaveValue(String(before + 1));
        await person.click({ force: true });
        await expect(sliders(page).nth(SLIDER.initialCases)).toHaveValue(String(before));

        await page.getByRole("button", { name: "Play", exact: true }).click();
        await person.click({ force: true });
        await expect(sliders(page).nth(SLIDER.initialCases)).toHaveValue(String(before));
    });

    test("auto run starts a new network after each run, and can be turned off", async ({ page }) => {
        await openHome(page);
        await chip(page, "Custom").click();
        for (const index of [SLIDER.recoveryDays, SLIDER.deathDays]) {
            await sliders(page).nth(index).focus();
            await page.keyboard.press("Home");
        }
        await sliders(page).nth(SLIDER.beta).focus();
        await page.keyboard.press("Home");
        await toSetup(page);
        const firstLayout = () => simulator(page).locator("svg g.group\\/node > circle:first-child").first().getAttribute("cx");
        const start = await firstLayout();
        await page.getByRole("button", { name: "Play", exact: true }).click();
        await expect.poll(firstLayout, { timeout: 15000 }).not.toBe(start);
        expect(await isPlaying(page)).toBe(true);

        await page.locator("label", { hasText: "Auto run" }).click();
        await expect.poll(() => isPlaying(page), { timeout: 15000 }).toBe(false);
    });

    test("without auto run, a run that ends stops, and Play replays it from day 0", async ({ page }) => {
        // A fast, certain outbreak: everyone in contact, near-certain transmission, one-day infections.
        await openHome(page, "/?disease=custom&beta=0.95&recoveryDays=1&deathDays=1&ifr=0&contacts=12&cases=5&seed=12345&auto=0#simulation");
        await page.getByRole("button", { name: "Play", exact: true }).click();
        await expect.poll(() => isPlaying(page), { timeout: 20000 }).toBe(false);
        const lastDay = Number(await dayReadout(page).textContent());
        expect(lastDay).toBeGreaterThan(0);

        await page.getByRole("button", { name: "Play", exact: true }).click();
        expect(await isPlaying(page)).toBe(true);
        await expect.poll(async () => Number(await dayReadout(page).textContent())).toBeLessThan(lastDay);
    });

    test("settings go into the URL after interaction, and a shared link reopens them paused", async ({ page }) => {
        await openHome(page);
        await chip(page, "Mpox").click();
        await expect.poll(() => new URL(page.url()).searchParams.get("disease")).toBe("mpox");
        const historyLength = await page.evaluate(() => history.length);
        await chip(page, "Custom").click();
        await sliders(page).nth(SLIDER.beta).focus();
        for (let k = 0; k < 5; k++) await page.keyboard.press("ArrowRight");
        await expect.poll(() => new URL(page.url()).searchParams.has("beta")).toBe(true);
        expect(await page.evaluate(() => history.length)).toBe(historyLength);

        await page.goto("/?disease=custom&beta=0.5&recoveryDays=3&deathDays=2.5&ifr=0.05&contacts=6&cases=3&hubs=1&seed=12345&auto=0#simulation");
        await expect(chip(page, "Custom")).toHaveAttribute("aria-checked", "true");
        expect(await sliderText(page, SLIDER.beta)).toBe("50%");
        expect(await sliderText(page, SLIDER.recoveryDays)).toBe("3 days");
        expect(await sliderText(page, SLIDER.deathDays)).toBe("2.5 days");
        expect(await sliderText(page, SLIDER.ifr)).toBe("5%");
        await expect(sliders(page).nth(SLIDER.initialCases)).toHaveValue("3");
        await expect(page.getByRole("switch", { name: "Superspreaders" })).toBeChecked();
        await expect(page.getByRole("switch", { name: "Auto run" })).not.toBeChecked();
        expect(await isPlaying(page)).toBe(false);
    });

    test("the same seed draws the same network", async ({ browser }) => {
        const link = "/?disease=covid-ancestral&population=elderly&cases=1&seed=24680";
        const positions = async () => {
            const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
            await openHome(page, link);
            const cx = await simulator(page)
                .locator("svg g.group\\/node > circle:first-child")
                .evaluateAll((circles) => circles.slice(0, 20).map((c) => c.getAttribute("cx")));
            await page.close();
            return cx;
        };
        expect(await positions()).toEqual(await positions());
    });

    test("invalid URL settings are ignored", async ({ page }) => {
        await openHome(page, "/?disease=influenza-b&beta=9&cases=-2&seed=abc");
        await expect(chip(page, "COVID-19 (ancestral)")).toHaveAttribute("aria-checked", "true");
        await expect(chip(page, "Influenza B")).toHaveCount(0);
    });

    test("Share copies a link to the exact setup and confirms it", async ({ page, context, browserName }) => {
        test.skip(browserName !== "chromium", "Clipboard permissions are Chromium-only in Playwright");
        test.skip(test.info().project.name === "mobile", "Touch devices use the system share sheet");
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
        await openHome(page);
        await page.getByRole("button", { name: "Share", exact: true }).click();
        await expect(page.locator('[role="tooltip"]', { hasText: "Link copied" })).toBeVisible();
        const link = new URL(await page.evaluate(() => navigator.clipboard.readText()));
        expect(link.hash).toBe("#simulation");
        expect(link.searchParams.get("disease")).toBe("covid-ancestral");
        expect(link.searchParams.get("population")).toBe("elderly");
        expect(link.searchParams.get("seed")).toMatch(/^\d{5}$/);
    });

    test("the #simulation anchor puts the network under the header with the chart in view", async ({ page }) => {
        test.skip(test.info().project.name === "mobile", "Desktop layout check");
        await openHome(page, "/#simulation");
        await expect
            .poll(() =>
                simulator(page)
                    .locator("svg")
                    .first()
                    .evaluate((svg) => Math.round(svg.getBoundingClientRect().top)),
            )
            .toBe(72);
        const chartBottom = await page.getByRole("group", { name: /Epidemic curve/ }).evaluate((el) => el.getBoundingClientRect().bottom);
        expect(chartBottom).toBeLessThanOrEqual(page.viewportSize()!.height);
    });

    test("the chart tooltip lines up its columns", async ({ page }) => {
        test.skip(test.info().project.name === "mobile", "Hover");
        await openHome(page, "/#simulation");
        await page.waitForTimeout(3000);
        const chart = page.getByRole("group", { name: /Epidemic curve/ });
        await chart.scrollIntoViewIfNeeded();
        const box = (await chart.boundingBox())!;
        await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.5);
        await expect(chart.locator("table tbody tr")).toHaveCount(4);
        const rows = await chart
            .locator("table tbody tr")
            .evaluateAll((trs) => trs.map((tr) => [...tr.children].map((td) => Math.round(td.getBoundingClientRect().right))));
        expect(rows.length).toBe(4);
        for (const row of rows) expect(row).toEqual(rows[0]);
    });

    test("no control moves the layout", async ({ page }) => {
        await openHome(page);
        await page.waitForTimeout(300);
        const base = await layoutSnapshot(page);
        const check = async (label: string) => expect(await layoutSnapshot(page), label).toEqual(base);

        for (const preset of ["COVID-19 (Omicron)", "Influenza A", "Measles", "Mpox", "Ebola", "Custom", "COVID-19 (ancestral)"]) {
            await chip(page, preset).click();
            await check(preset);
        }
        for (const population of ["All ages", "Infants", "Adults", "Middle-aged", "Elderly"]) {
            await chip(page, population).click();
            await check(population);
        }
        for (let i = 0; i < 6; i++) {
            await sliders(page).nth(i).focus();
            for (const key of ["Home", "End", "ArrowLeft"]) {
                await page.keyboard.press(key);
                await check(`slider ${i} ${key}`);
            }
        }
        await page.locator("label", { hasText: "Superspreaders" }).click();
        await check("superspreaders");
        await sliders(page).nth(SLIDER.initialCases).focus();
        await page.keyboard.press("Home");
        await page.keyboard.press("ArrowRight");
        await chip(page, "COVID-19 (ancestral)").click();
        await page.getByRole("button", { name: "Play", exact: true }).click();
        for (let second = 0; second < 5; second++) {
            await page.waitForTimeout(1000);
            await check(`running ${second}s`);
        }
    });
});
