import { useEffect, useMemo, useState } from "react";
import { DEFAULT_POPULATION_ID, type PopulationId, type PresetId, getPreset, presetIfr } from "@/content/epidemic-presets";
import type { ElementSize } from "@/hooks/use-element-size";
import {
    I,
    type Network,
    type Random,
    S,
    type SirdCounts,
    type SirdState,
    betaForR0,
    buildNetwork,
    createEpidemic,
    deathsAmongInfected,
    deterministicSird,
    estimateR0,
    isOver,
    mulberry32,
    peakInfections,
    randomSeed,
    seededOrder,
    stepEpidemic,
    theoryEndDay,
} from "@/lib/sird";

/** Milliseconds per simulated day. */
export const TICK_MS = 240;
/** Pause between runs when auto run replays the setup. */
export const LOOP_PAUSE_MS = 2600;
/** Every network has the same population, whatever the screen size, preset or toggles. */
export const POPULATION = 250;
/** Share of the canvas the node spacing discs may cover; spacing shrinks on small screens to fit everyone. */
export const PACKING = 0.38;
/** Node spacing on roomy canvases (pixels). */
export const MAX_NODE_SPACING = 30;
/** Longest contact link at full spacing and the default number of contacts (pixels). */
export const BASE_EDGE_LENGTH = 88;
export const MIN_BETA = 0.01;
export const MAX_BETA = 0.95;
export const MIN_INFECTIOUS_DAYS = 1;
export const MAX_INFECTIOUS_DAYS = 30;
/** Tenths of a day, so published means like Ebola's 7.5 and 16.4 days fit exactly. */
export const INFECTIOUS_DAYS_STEP = 0.1;
export const MIN_CONTACTS = 2;
export const MAX_CONTACTS = 12;
export const MIN_IFR = 0;
/** Up to 90%: Ebola's case fatality has reached 90% in past outbreaks. */
export const MAX_IFR = 0.9;
/**
 * Slider steps fine enough that preset and age values are never rounded off (0.0054% stays 0.0054%).
 * Keyboard users can move in larger jumps with Page Up / Page Down.
 */
export const IFR_STEP = 0.000001;
export const BETA_STEP = 0.001;
export const MIN_INITIAL_CASES = 0;
export const MAX_INITIAL_CASES = 5;
/** The x-axis runs until the theory predicts no one infected, but never shorter than this. */
export const MIN_DAYS = 10;
/** The theory curve is computed this far ahead at most: near R₀ = 1 an outbreak can smoulder for years. */
export const MAX_THEORY_DAYS = 730;

/** Baseline for "Custom" and the reference point for scaling contact reach. */
export const DEFAULT_PARAMS = { beta: 0.3, recoveryDays: 4, deathDays: 4, ifr: 0.01, contacts: 3, initialCases: 1 };
export type SimulationParams = typeof DEFAULT_PARAMS;

/** The figure opens on this disease. */
export const DEFAULT_PRESET_ID: PresetId = "covid-ancestral";

/** Mixed into the seed for the index-case draw, so it is independent of the network layout draw. */
const INDEX_CASE_SALT = 0x9e3779b9;

/** Parameters a disease preset controls; changing one by hand leaves the preset. */
const PRESET_PARAMS: (keyof SimulationParams)[] = ["beta", "recoveryDays", "deathDays", "ifr", "contacts"];

interface Run {
    network: Network;
    /** Same key = same node positions, so chosen index cases can carry over a rebuild. */
    layoutKey: string;
    epidemic: SirdState;
    /** Transmission and recovery luck. Fresh on every run; only the setup comes from the seed. */
    random: Random;
}

/** A run at day 0 on `network` from the given index cases, with fresh luck. */
const freshRun = (network: Network, layoutKey: string, indexCases: number[]): Run => {
    const random = mulberry32(randomSeed());
    return { network, layoutKey, epidemic: createEpidemic(network, indexCases, random), random };
};

/** Everything a visitor can set, e.g. for a shareable URL. */
export interface SimulationSetup {
    presetId: PresetId | null;
    populationId: PopulationId;
    params: SimulationParams;
    superspreaders: boolean;
    seed: number;
    autoRun: boolean;
}

interface UseEpidemicSimulationOptions {
    /** Canvas size in pixels; the network is generated to fit it exactly. */
    size: ElementSize;
    /** Ticks only while visible. */
    visible: boolean;
    /** Start paused (reduced motion, or a shared setup the visitor should see before it runs). */
    startPaused: boolean;
    /** Settings to start from (e.g. parsed from the URL). Missing ones use the defaults. */
    initialSetup?: Partial<SimulationSetup>;
}

/** Fills in a partial setup: a preset's own parameters win over loose ones, as in the UI. */
const resolveSetup = (setup: Partial<SimulationSetup> = {}, startPaused: boolean): SimulationSetup => {
    const presetId = setup.presetId !== undefined ? setup.presetId : DEFAULT_PRESET_ID;
    const populationId = setup.populationId ?? DEFAULT_POPULATION_ID;
    const preset = presetId ? getPreset(presetId) : null;
    const initialCases = setup.params?.initialCases ?? DEFAULT_PARAMS.initialCases;
    const params: SimulationParams = preset
        ? {
              ...DEFAULT_PARAMS,
              recoveryDays: preset.recoveryDays,
              deathDays: preset.deathDays,
              ifr: presetIfr(preset, populationId),
              contacts: preset.contacts,
              initialCases,
          }
        : { ...DEFAULT_PARAMS, ...setup.params, initialCases };
    return {
        presetId,
        populationId,
        params,
        superspreaders: setup.superspreaders ?? false,
        seed: setup.seed ?? randomSeed(),
        autoRun: setup.autoRun ?? !startPaused,
    };
};

/**
 * The chart's x-axis span: until the theory predicts 0 infected (the simulation extends it if it runs longer).
 * A module function rather than inline in the hook: inline, this exact call trips a React Compiler codegen bug.
 */
const chartSpan = (theory: SirdCounts[]) => Math.max(MIN_DAYS, theoryEndDay(theory));

/** Node spacing that fits the whole population into the canvas. */
const nodeSpacing = ({ width, height }: ElementSize) => Math.min(MAX_NODE_SPACING, Math.sqrt((PACKING * 4 * width * height) / (Math.PI * POPULATION)));

/**
 * State and actions for the interactive SIRD figure.
 *
 * Two phases: **setup** (day 0, paused), where presets, sliders, toggles and clicking nodes shape the run,
 * and **running**, which only Play starts. Rendering lives in `EpidemicSimulator`; the model in `src/lib/sird.ts`.
 */
export const useEpidemicSimulation = ({ size, visible, startPaused, initialSetup }: UseEpidemicSimulationOptions) => {
    const [start] = useState(() => resolveSetup(initialSetup, startPaused));
    const [params, setParams] = useState<SimulationParams>(start.params);
    const [presetId, setPresetId] = useState<PresetId | null>(start.presetId);
    /** Population age for presets with age data. Remembered while a preset without age data is selected. */
    const [populationId, setPopulationId] = useState<PopulationId>(start.populationId);
    const [superspreaders, setSuperspreadersState] = useState(start.superspreaders);
    /** One seed decides the people, their contacts and who starts infected. "New network" re-rolls it. */
    const [seed, setSeed] = useState(start.seed);

    const layoutKey = `${seed}:${size.width}x${size.height}`;
    // Explicitly memoized (like `durations`, `modelParams` and `setup` below): identity matters here, not just speed.
    // A new network object sets up a fresh run; the others are effect dependencies.
    const network = useMemo(() => {
        const spacing = nodeSpacing(size);
        return buildNetwork(mulberry32(seed), {
            width: size.width,
            height: size.height,
            count: POPULATION,
            minDistance: spacing,
            neighbours: params.contacts,
            // Denser networks need a longer reach so every node can find its nearest contacts.
            maxEdgeLength: BASE_EDGE_LENGTH * (spacing / MAX_NODE_SPACING) * Math.sqrt(Math.max(1, params.contacts / DEFAULT_PARAMS.contacts)),
            // Smaller dots when people are packed closer (never below 60% of the roomy size).
            radiusScale: Math.max(0.6, spacing / MAX_NODE_SPACING),
            superspreaders,
        });
    }, [seed, size, params.contacts, superspreaders]);

    /**
     * Seeded order in which people become index cases: "Initial infected = k" always means the first k connected
     * people in this order, so dragging the slider adds and removes the same people instead of re-drawing them.
     */
    const indexOrder = seededOrder(POPULATION, mulberry32(seed ^ INDEX_CASE_SALT));
    const seededCases = (target: Network, count: number) => indexOrder.filter((node) => target.adjacency[node]?.length > 0).slice(0, count);

    const [run, setRun] = useState<Run>(() => freshRun(network, layoutKey, seededCases(network, params.initialCases)));
    const [playing, setPlaying] = useState(!startPaused);
    /** Auto run: when a run ends, start another on a freshly seeded network after a short pause. On by default. */
    const [autoRun, setAutoRunState] = useState(start.autoRun);
    /** Until someone touches a control, setup changes (e.g. the first canvas measurement) keep the run playing. */
    const [interacted, setInteracted] = useState(false);

    /** Set when auto run re-rolls the seed, so the rebuilt network keeps playing instead of waiting for Play. */
    const [autoAdvance, setAutoAdvance] = useState(false);

    const preset = presetId ? getPreset(presetId) : null;
    const durations = useMemo(
        () => ({ recoveryDays: params.recoveryDays, deathDays: params.deathDays, ifr: params.ifr }),
        [params.recoveryDays, params.deathDays, params.ifr],
    );
    const beta = preset ? betaForR0(run.network, preset.r0, durations, MIN_BETA, MAX_BETA) : params.beta;
    const modelParams = useMemo(() => ({ beta, ...durations }), [beta, durations]);

    /** Back to day 0 on `network`, from the given index cases (or the first `count` in the seeded order). */
    const setUp = (target: Network, key: string, initial: number | number[]) =>
        setRun(freshRun(target, key, Array.isArray(initial) ? initial : seededCases(target, initial)));

    const { epidemic } = run;
    const finished = isOver(epidemic);
    /**
     * Playing and able to go on. `playing` is what the visitor asked for; a finished run (or one with no one infected)
     * only goes on when auto run will start the next one.
     */
    const running = playing && (!finished || (autoRun && epidemic.day > 0));
    const editable = epidemic.day === 0 && !running;

    // A rebuilt network sets up a fresh run, adjusted during render so the old run never shows on the new network.
    // Same layout (contacts or superspreaders changed): keep the chosen initial infected. New layout: take them from
    // the seeded order. Once the visitor is in control, a new setup waits for Play unless auto run started it.
    if (run.network !== network) {
        setUp(network, layoutKey, run.layoutKey === layoutKey ? epidemic.indexCases : params.initialCases);
        if (interacted && !autoAdvance) setPlaying(false);
        if (autoAdvance) setAutoAdvance(false);
    }

    // The run loop: one simulated day per tick. When a run ends, auto run re-rolls the seed (new people, contacts
    // and initial infected) after a pause and keeps going.
    useEffect(() => {
        if (!running || !visible) return;

        if (finished) {
            const timeout = window.setTimeout(() => {
                setAutoAdvance(true);
                setSeed(randomSeed());
            }, LOOP_PAUSE_MS);
            return () => window.clearTimeout(timeout);
        }

        const timeout = window.setTimeout(() => {
            const next = stepEpidemic(run.network, run.epidemic, modelParams, run.random);
            // Apply the step only to the run it was computed from, in case a new setup is already on its way.
            setRun((current) => (current === run ? { ...run, epidemic: next } : current));
            // Without auto run, a run that ends is the end of playing.
            if (!autoRun && isOver(next)) setPlaying(false);
        }, TICK_MS);
        return () => window.clearTimeout(timeout);
    }, [running, visible, run, finished, modelParams, autoRun]);

    /* ─── Actions ─── */

    const takeControl = () => setInteracted(true);

    /** Turning auto run on while a finished run is showing starts the next one (on a new seed) right away. */
    const setAutoRun = (enabled: boolean) => {
        takeControl();
        setAutoRunState(enabled);
        if (enabled && finished && epidemic.day > 0) {
            setAutoAdvance(true);
            setSeed(randomSeed());
            setPlaying(true);
        }
    };

    /** Back to day 0 with the same initial infected, paused. */
    const reset = () => {
        takeControl();
        setPlaying(false);
        setUp(run.network, run.layoutKey, epidemic.indexCases);
    };

    const setParam = (key: keyof SimulationParams, value: number) => {
        // Sliders report every pointer move; ignore anything that doesn't actually change a value.
        const current = key === "beta" ? beta : params[key];
        if (value === current) return;
        takeControl();
        if (PRESET_PARAMS.includes(key) && presetId) {
            // Leave the preset, keeping its transmission rate as the new custom value.
            setPresetId(null);
            setParams((current) => ({ ...current, beta, [key]: value }));
        } else {
            setParams((current) => ({ ...current, [key]: value }));
        }
        if (key === "initialCases") {
            setPlaying(false);
            setUp(run.network, run.layoutKey, value);
        }
    };

    const choosePreset = (id: PresetId | null) => {
        takeControl();
        if (!id) {
            setPresetId(null);
            setParams((current) => ({ ...current, beta }));
            return;
        }
        const next = getPreset(id);
        setPresetId(id);
        setParams((current) => ({
            ...current,
            recoveryDays: next.recoveryDays,
            deathDays: next.deathDays,
            ifr: presetIfr(next, populationId),
            contacts: next.contacts,
        }));
        // Set up a fresh run for the disease (same initial infected), paused until Play.
        setPlaying(false);
        setUp(run.network, run.layoutKey, epidemic.indexCases);
    };

    /** Sets everyone's age for a preset with age data: the fatality rate follows; spread is unchanged. */
    const choosePopulation = (id: PopulationId) => {
        if (!preset?.ageProfile || id === populationId) return;
        takeControl();
        setPopulationId(id);
        setParams((current) => ({ ...current, ifr: presetIfr(preset, id) }));
        setPlaying(false);
        setUp(run.network, run.layoutKey, epidemic.indexCases);
    };

    /** Rebuilds the same people with (or without) superspreader hubs; the fresh run waits for Play. */
    const setSuperspreaders = (enabled: boolean) => {
        takeControl();
        setSuperspreadersState(enabled);
    };

    /** Re-rolls the seed: new people, contacts and initial infected. The fresh run waits for Play. */
    const newNetwork = () => {
        takeControl();
        setSeed(randomSeed());
    };

    const togglePlay = () => {
        takeControl();
        if (running) {
            setPlaying(false);
            return;
        }
        // Replaying a finished run starts again from the same initial infected.
        if (finished && epidemic.day > 0) setUp(run.network, run.layoutKey, epidemic.indexCases);
        setPlaying(true);
    };

    /**
     * During setup, clicking a node toggles it as an initial infected (up to the slider's maximum) and keeps the
     * "Initial cases" value in step. Once a run has started, nodes can't be changed.
     */
    const toggleIndexCase = (node: number) => {
        if (!editable) return;
        const isIndex = epidemic.indexCases.includes(node);
        if (!isIndex && epidemic.indexCases.length >= MAX_INITIAL_CASES) return;

        takeControl();
        const indexCases = isIndex ? epidemic.indexCases.filter((index) => index !== node) : [...epidemic.indexCases, node];
        const states = epidemic.states.slice();
        states[node] = isIndex ? S : I;
        const total = indexCases.length;
        setRun((current) => ({
            ...current,
            epidemic: { ...current.epidemic, indexCases, states, history: [{ s: current.network.nodes.length - total, i: total, r: 0, d: 0 }] },
        }));
        setParams((current) => ({ ...current, initialCases: total }));
    };

    /* ─── Derived numbers ─── */

    const population = run.network.nodes.length;
    const last = epidemic.history[epidemic.history.length - 1];
    const initialCases = epidemic.history[0].i;
    const r0 = estimateR0(run.network, modelParams);
    const maxR0 = estimateR0(run.network, { ...durations, beta: MAX_BETA });
    const theory = deterministicSird(r0, durations, population, initialCases, MAX_THEORY_DAYS);
    const chartDays = chartSpan(theory);

    /** The current settings, e.g. for the URL. */
    const setup = useMemo<SimulationSetup>(
        () => ({ presetId, populationId, params: { ...params, beta }, superspreaders, seed, autoRun }),
        [presetId, populationId, params, beta, superspreaders, seed, autoRun],
    );

    return {
        setup,
        /** True once the visitor has touched any control. */
        interacted,
        network: run.network,
        /** The seed behind the current network and its initial infected. */
        seed,
        epidemic,
        params,
        superspreaders,
        autoRun,
        beta,
        preset,
        /** The population age in effect, or null when the preset has no age data. */
        ageGroup: preset?.ageProfile ? populationId : null,
        /** The remembered population choice (shown dimmed while a preset without age data is selected). */
        populationId,
        playing: running,
        finished,
        /** True during setup: day 0 and paused. Nodes can only be clicked then. */
        editable,
        /** Play needs at least one infected person. */
        canPlay: last.i > 0 || (finished && epidemic.day > 0 && epidemic.indexCases.length > 0),
        population,
        r0,
        /** Highest R₀ this network can reach at the current infectious period. */
        maxR0,
        theory,
        chartDays,
        peak: peakInfections(epidemic.history),
        everInfected: (population - last.s) / population,
        deaths: last.d,
        /** Deaths ÷ everyone ever infected. */
        deathShare: deathsAmongInfected(last),
        setParam,
        choosePreset,
        choosePopulation,
        setSuperspreaders,
        setAutoRun,
        togglePlay,
        reset,
        newNetwork,
        toggleIndexCase,
    };
};
