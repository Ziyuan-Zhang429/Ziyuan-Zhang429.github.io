import { type Page, expect } from "@playwright/test";

/** A chip in a ChipGroup (rendered as a toggle button / radio, depending on React Aria's role). */
export const chip = (page: Page, name: string) =>
    page
        .getByRole("radio", { name, exact: true })
        .or(page.getByRole("button", { name, exact: true }))
        .first();

export const simulator = (page: Page) => page.locator("#simulation");

export const sliders = (page: Page) => simulator(page).locator('input[type="range"]');

/** Slider order in the Parameters column. */
export const SLIDER = { beta: 0, recoveryDays: 1, deathDays: 2, ifr: 3, contacts: 4, initialCases: 5 } as const;

export const sliderText = (page: Page, index: number) => sliders(page).nth(index).getAttribute("aria-valuetext");

export const dayReadout = (page: Page) => simulator(page).locator("dl dd").first();

export const isPlaying = async (page: Page) => (await page.getByRole("button", { name: "Pause", exact: true }).count()) === 1;

/** Pause if running and go back to day 0, ready for setup. */
export const toSetup = async (page: Page) => {
    if (await isPlaying(page)) await page.getByRole("button", { name: "Pause", exact: true }).click();
    const reset = page.getByRole("button", { name: "Reset", exact: true });
    if (await reset.isEnabled()) await reset.click();
    await expect(dayReadout(page)).toHaveText("0");
};

export const openHome = async (page: Page, path = "/") => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(simulator(page).locator("svg g.group\\/node").first()).toBeVisible();
};

/** Positions and sizes of the simulator's main blocks, relative to the figure. Used to catch layout shifts. */
export const layoutSnapshot = (page: Page) =>
    page.evaluate(() => {
        const figure = document.getElementById("simulation")!;
        const origin = figure.getBoundingClientRect();
        const blocks: Record<string, Element | null> = {
            card: figure.querySelector("[class*='rounded-2xl']"),
            header: figure.querySelector("dl"),
            presets: figure.querySelector("[class*='grid-area:presets']"),
            population: figure.querySelector("[class*='grid-area:population']"),
            chart: figure.querySelector("[role=group][aria-label^='Epidemic curve']"),
            params: figure.querySelector("[class*='grid-area:params']"),
            sources: figure.querySelector("details"),
        };
        figure.querySelectorAll('input[type="range"]').forEach((input, i) => (blocks[`slider${i}`] = input.closest(".flex-col")));
        return Object.fromEntries(
            Object.entries(blocks)
                .filter(([, el]) => el)
                .map(([key, el]) => {
                    const r = el!.getBoundingClientRect();
                    return [key, [r.left - origin.left, r.top - origin.top, r.width, r.height].map(Math.round)];
                }),
        );
    });
