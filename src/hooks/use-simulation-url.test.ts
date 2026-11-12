import { describe, expect, it } from "vitest";
import type { SimulationSetup } from "./use-epidemic-simulation";
import { SIMULATION_URL_SCHEMA, toSetup, toUrlValues } from "./use-simulation-url";
import { parseUrlValues, withUrlValues } from "./use-url-state";

const custom: SimulationSetup = {
    presetId: null,
    populationId: "adults",
    params: { beta: 0.271, recoveryDays: 16.4, deathDays: 7.5, ifr: 0.0054, contacts: 6, initialCases: 3 },
    superspreaders: true,
    seed: 54321,
    autoRun: false,
};

const roundTrip = (setup: SimulationSetup) => {
    const url = withUrlValues(SIMULATION_URL_SCHEMA, toUrlValues(setup), "https://example.org/");
    return { url, setup: toSetup(parseUrlValues(SIMULATION_URL_SCHEMA, url.searchParams)) };
};

describe("simulation URL", () => {
    it("round-trips a custom setup", () => {
        const { setup } = roundTrip(custom);
        expect(setup).toEqual({ ...custom });
    });

    it("writes only the preset, population, cases and seed for a disease preset", () => {
        const { url } = roundTrip({ ...custom, presetId: "measles", superspreaders: false, autoRun: true });
        expect([...url.searchParams.keys()].sort()).toEqual(["cases", "disease", "population", "seed"]);
        expect(url.searchParams.get("disease")).toBe("measles");
    });

    it("uses the 'population' key, not 'age'", () => {
        const { url } = roundTrip(custom);
        expect(url.searchParams.get("population")).toBe("adults");
        expect(url.searchParams.has("age")).toBe(false);
    });

    it("ignores unknown diseases and out-of-range values", () => {
        const values = parseUrlValues(SIMULATION_URL_SCHEMA, new URLSearchParams("disease=influenza-b&beta=2&cases=9&seed=12&population=teens"));
        expect(values).toEqual({});
    });

    it("leaves out keys that are not in the URL", () => {
        expect(toSetup({ disease: "custom" })).toEqual({ presetId: null });
    });
});
