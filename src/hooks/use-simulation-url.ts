import { useCallback } from "react";
import { POPULATION_IDS, type PresetId, VISIBLE_PRESETS } from "@/content/epidemic-presets";
import {
    MAX_BETA,
    MAX_CONTACTS,
    MAX_IFR,
    MAX_INFECTIOUS_DAYS,
    MAX_INITIAL_CASES,
    MIN_BETA,
    MIN_CONTACTS,
    MIN_IFR,
    MIN_INFECTIOUS_DAYS,
    MIN_INITIAL_CASES,
    type SimulationSetup,
} from "@/hooks/use-epidemic-simulation";
import { URL_CODECS, type UrlValues, useUrlState, withUrlValues } from "@/hooks/use-url-state";
import { MAX_SEED, MIN_SEED } from "@/lib/sird";

const CUSTOM = "custom";

/** Page anchor for the figure: `/#simulation` lines the network up with the top of the screen. */
export const SIMULATION_ANCHOR = "simulation";

/**
 * Query-string keys for the simulator, e.g. `/?disease=covid-ancestral&population=elderly&seed=48213#simulation`.
 * Transmission, the infectious periods, fatality and contacts are written only for "custom": a preset defines them.
 */
export const SIMULATION_URL_SCHEMA = {
    disease: URL_CODECS.oneOf([...VISIBLE_PRESETS.map((preset) => preset.id), CUSTOM]),
    // "population" rather than "age", so other population types can share the key later.
    population: URL_CODECS.oneOf(POPULATION_IDS),
    beta: URL_CODECS.number({ min: MIN_BETA, max: MAX_BETA }),
    recoveryDays: URL_CODECS.number({ min: MIN_INFECTIOUS_DAYS, max: MAX_INFECTIOUS_DAYS }),
    deathDays: URL_CODECS.number({ min: MIN_INFECTIOUS_DAYS, max: MAX_INFECTIOUS_DAYS }),
    ifr: URL_CODECS.number({ min: MIN_IFR, max: MAX_IFR }),
    contacts: URL_CODECS.integer({ min: MIN_CONTACTS, max: MAX_CONTACTS }),
    cases: URL_CODECS.integer({ min: MIN_INITIAL_CASES, max: MAX_INITIAL_CASES }),
    hubs: URL_CODECS.boolean,
    seed: URL_CODECS.integer({ min: MIN_SEED, max: MAX_SEED }),
    auto: URL_CODECS.boolean,
};

export type SimulationUrlValues = UrlValues<typeof SIMULATION_URL_SCHEMA>;

export const toSetup = (values: SimulationUrlValues): Partial<SimulationSetup> => {
    const setup: Partial<SimulationSetup> = {};
    if (values.disease) setup.presetId = values.disease === CUSTOM ? null : (values.disease as PresetId);
    if (values.population) setup.populationId = values.population;
    if (values.hubs !== undefined) setup.superspreaders = values.hubs;
    if (values.seed !== undefined) setup.seed = values.seed;
    if (values.auto !== undefined) setup.autoRun = values.auto;

    const params: Partial<SimulationSetup["params"]> = {};
    if (values.beta !== undefined) params.beta = values.beta;
    if (values.recoveryDays !== undefined) params.recoveryDays = values.recoveryDays;
    if (values.deathDays !== undefined) params.deathDays = values.deathDays;
    if (values.ifr !== undefined) params.ifr = values.ifr;
    if (values.contacts !== undefined) params.contacts = values.contacts;
    if (values.cases !== undefined) params.initialCases = values.cases;
    if (Object.keys(params).length > 0) setup.params = params as SimulationSetup["params"];
    return setup;
};

export const toUrlValues = (setup: SimulationSetup): SimulationUrlValues => {
    const custom = setup.presetId === null;
    return {
        disease: setup.presetId ?? CUSTOM,
        population: setup.populationId,
        beta: custom ? setup.params.beta : undefined,
        recoveryDays: custom ? setup.params.recoveryDays : undefined,
        deathDays: custom ? setup.params.deathDays : undefined,
        ifr: custom ? setup.params.ifr : undefined,
        contacts: custom ? setup.params.contacts : undefined,
        cases: setup.params.initialCases,
        hubs: setup.superspreaders || undefined,
        seed: setup.seed,
        auto: setup.autoRun ? undefined : false,
    };
};

/**
 * The simulator's settings in the URL: `initialSetup` to start from (with `fromUrl` when a link carried any),
 * and `persist(setup)` to write the current settings back.
 */
export const useSimulationUrl = () => {
    const { initial, write } = useUrlState(SIMULATION_URL_SCHEMA);
    const initialSetup = toSetup(initial);
    // Kept stable on purpose: the simulator's persist effect depends on it.
    const persist = useCallback((setup: SimulationSetup) => write(toUrlValues(setup)), [write]);

    /** A link that reopens exactly this setup, scrolled to the figure. */
    const shareUrl = (setup: SimulationSetup) => {
        const url = withUrlValues(SIMULATION_URL_SCHEMA, toUrlValues(setup), window.location.href);
        url.hash = SIMULATION_ANCHOR;
        return url.toString();
    };

    return { initialSetup, fromUrl: Object.keys(initial).length > 0, persist, shareUrl };
};
