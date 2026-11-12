import { describe, expect, it } from "vitest";
import { MAX_CONTACTS, MAX_IFR, MAX_INFECTIOUS_DAYS, MIN_CONTACTS, MIN_IFR, MIN_INFECTIOUS_DAYS } from "@/hooks/use-epidemic-simulation";
import en from "@/i18n/messages/en.json";
import {
    COVID_AGE_PROFILE,
    EPIDEMIC_PRESETS,
    FLU_AGE_PROFILE,
    OMICRON_FATALITY_SCALE,
    POPULATION_IDS,
    PRESET_SOURCES,
    SOURCE_ORDER,
    SUPERSPREADING_SOURCE,
    VISIBLE_PRESETS,
    getPreset,
    hasOutcomeSpecificPeriods,
    presetIfr,
    sourceNumber,
} from "./epidemic-presets";

const presetCopy = en.home.simulator.presets;

describe("disease presets", () => {
    it("stay within the simulator's parameter ranges", () => {
        for (const preset of EPIDEMIC_PRESETS) {
            expect(preset.r0).toBeGreaterThan(0);
            for (const days of [preset.recoveryDays, preset.deathDays]) {
                expect(days).toBeGreaterThanOrEqual(MIN_INFECTIOUS_DAYS);
                expect(days).toBeLessThanOrEqual(MAX_INFECTIOUS_DAYS);
            }
            expect(preset.ifr).toBeGreaterThanOrEqual(MIN_IFR);
            expect(preset.ifr).toBeLessThanOrEqual(MAX_IFR);
            expect(preset.contacts).toBeGreaterThanOrEqual(MIN_CONTACTS);
            expect(preset.contacts).toBeLessThanOrEqual(MAX_CONTACTS);
        }
    });

    it("cite sources that exist, and have copy for every line", () => {
        for (const preset of EPIDEMIC_PRESETS) {
            for (const source of Object.values(preset.sources)) expect(PRESET_SOURCES[source]).toBeDefined();
            expect(presetCopy.items[preset.id]).toBeTruthy();
            expect(presetCopy.details[preset.id]).toMatchObject({ r0: expect.any(String), infectious: expect.any(String), fatality: expect.any(String) });
        }
    });

    it("hide influenza B but keep its data", () => {
        expect(getPreset("influenza-b")).toBeDefined();
        expect(VISIBLE_PRESETS.map((preset) => preset.id)).not.toContain("influenza-b");
        expect(VISIBLE_PRESETS.map((preset) => preset.id)).toContain("ebola");
    });

    it("give fatal cases their own infectious period only where a source estimates it (Ebola)", () => {
        const ebola = getPreset("ebola");
        expect(ebola.deathDays).toBe(7.5);
        expect(ebola.recoveryDays).toBe(16.4);
        expect(ebola.sources.death).toBe("who-ebola-nejm-2014");
        for (const preset of EPIDEMIC_PRESETS.filter((item) => item.id !== "ebola")) {
            expect(hasOutcomeSpecificPeriods(preset)).toBe(false);
            expect(preset.sources.death).toBe(preset.sources.recovery);
        }
    });

    it("make Ebola the deadliest preset by far", () => {
        const others = VISIBLE_PRESETS.filter((preset) => preset.id !== "ebola").map((preset) => preset.ifr);
        expect(getPreset("ebola").ifr).toBeGreaterThan(Math.max(...others) * 10);
    });
});

describe("reference list", () => {
    it("numbers every visible preset's sources from 1, without gaps or duplicates", () => {
        expect(new Set(SOURCE_ORDER).size).toBe(SOURCE_ORDER.length);
        SOURCE_ORDER.forEach((id, index) => expect(sourceNumber(id)).toBe(index + 1));
        for (const preset of VISIBLE_PRESETS) for (const source of Object.values(preset.sources)) expect(SOURCE_ORDER).toContain(source);
        expect(SOURCE_ORDER).toContain(SUPERSPREADING_SOURCE);
    });

    it("leaves out sources only a hidden preset uses", () => {
        expect(SOURCE_ORDER).not.toContain("thompson-2022");
    });

    it("lists every source with a URL", () => {
        for (const source of Object.values(PRESET_SOURCES)) expect(source.url).toMatch(/^https:\/\//);
    });
});

describe("population (age) fatality", () => {
    it("uses the preset's own rate for all ages and for diseases without age data", () => {
        expect(presetIfr(getPreset("covid-ancestral"), "all")).toBe(getPreset("covid-ancestral").ifr);
        expect(presetIfr(getPreset("measles"), "elderly")).toBe(getPreset("measles").ifr);
    });

    it("rises with age for COVID-19 and influenza", () => {
        for (const profile of [COVID_AGE_PROFILE, FLU_AGE_PROFILE]) {
            const rates = (["infants", "adults", "middle-aged", "elderly"] as const).map((id) => profile.groups[id].ifr);
            expect(rates.slice(1).every((rate, i) => rate > rates[i])).toBe(true);
        }
    });

    it("matches the published values", () => {
        expect(presetIfr(getPreset("covid-ancestral"), "elderly")).toBe(0.046);
        expect(presetIfr(getPreset("covid-ancestral"), "infants")).toBe(0.000054);
        expect(presetIfr(getPreset("covid-omicron"), "elderly")).toBeCloseTo(0.046 * OMICRON_FATALITY_SCALE, 12);
        expect(presetIfr(getPreset("influenza-a"), "elderly")).toBeCloseTo(19_038 / 2_610_181, 12);
    });

    it("has a label for every population", () => {
        for (const id of POPULATION_IDS) expect(en.home.simulator.populations.items[id]).toBeTruthy();
    });
});
