/**
 * A small stochastic SIRD model on a random geometric contact network.
 *
 * - Network: nodes scattered with a minimum spacing, each linked to its nearest neighbours.
 * - Epidemic: discrete-time Reed–Frost dynamics. Each day every infected node infects each susceptible
 *   neighbour with probability `beta`.
 * - Outcomes: each infection's fate is decided when it starts: death with probability `ifr`, else recovery.
 *   The person then stays infectious for that outcome's period (`deathDays` or `recoveryDays`, geometric with
 *   that mean). A disease that kills quickly therefore spreads less from its fatal cases, which a single shared
 *   infectious period (or standard competing death/recovery rates) cannot capture.
 */

export type Random = () => number;

/** Small, fast, seeded PRNG so a run can be replayed from its seed. */
export const mulberry32 = (seed: number): Random => {
    let state = seed;
    return () => {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

export const MIN_SEED = 10000;
export const MAX_SEED = 99999;

/** A five-digit seed: short enough to read off the screen and type back in. */
export const randomSeed = () => MIN_SEED + Math.floor(Math.random() * (MAX_SEED - MIN_SEED + 1));

/** A seeded shuffle of `0…n-1`. */
export const seededOrder = (n: number, random: Random) => {
    const order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
};

export interface NetworkNode {
    x: number;
    y: number;
    r: number;
}

export interface NetworkEdge {
    a: number;
    b: number;
}

export interface Network {
    width: number;
    height: number;
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    adjacency: number[][];
    /** Superspreader hubs (empty unless built with `superspreaders`). */
    hubs: number[];
}

export interface NetworkOptions {
    width?: number;
    height?: number;
    count?: number;
    minDistance?: number;
    /** Each node links to this many nearest neighbours (links are undirected, so degree is usually higher). */
    neighbours?: number;
    maxEdgeLength?: number;
    /** Add 2–4 clusters, each centred on a hub linked to at least `MIN_HUB_CONTACTS` people. */
    superspreaders?: boolean;
    /** Node radii scale with spacing (1 = sized for 30px spacing), so dense networks stay legible. */
    radiusScale?: number;
}

export const MIN_HUB_CONTACTS = 6;
export const MAX_HUB_CONTACTS = 10;
export const MIN_CLUSTERS = 2;
export const MAX_CLUSTERS = 4;
/** Node radius range and hub radius at 30px spacing; scaled by `radiusScale`. */
export const NODE_RADIUS = { min: 2.6, max: 4 };
export const HUB_RADIUS = 5.5;

export const buildNetwork = (random: Random, options: NetworkOptions = {}): Network => {
    const { width = 1200, height = 180, count = 120, minDistance = 30, neighbours = 3, maxEdgeLength = 88, superspreaders = false, radiusScale = 1 } = options;
    const margin = 12 * Math.max(0.75, radiusScale);

    const nodes: NetworkNode[] = [];
    for (let attempt = 0; nodes.length < count && attempt < 120000; attempt++) {
        const x = margin + random() * (width - 2 * margin);
        const y = margin + random() * (height - 2 * margin);
        if (nodes.every((node) => (node.x - x) ** 2 + (node.y - y) ** 2 > minDistance ** 2)) {
            nodes.push({ x, y, r: (NODE_RADIUS.min + random() * (NODE_RADIUS.max - NODE_RADIUS.min)) * radiusScale });
        }
    }

    const edgeKeys = new Set<string>();
    const edges: NetworkEdge[] = [];
    const adjacency: number[][] = nodes.map(() => []);

    const link = (i: number, j: number) => {
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        const key = `${a}-${b}`;
        if (a === b || edgeKeys.has(key)) return;
        edgeKeys.add(key);
        edges.push({ a, b });
        adjacency[a].push(b);
        adjacency[b].push(a);
    };

    const byDistanceFrom = (i: number) =>
        nodes
            .map((other, j) => ({ j, d: Math.hypot(other.x - nodes[i].x, other.y - nodes[i].y) }))
            .filter(({ j }) => j !== i)
            .sort((p, q) => p.d - q.d);

    nodes.forEach((_, i) => {
        byDistanceFrom(i)
            .filter(({ d }) => d <= maxEdgeLength)
            .slice(0, neighbours)
            .forEach(({ j }) => link(i, j));
    });

    // Superspreaders: one hub per cluster, spread across the width, each linked to its nearest 6–10 people.
    const hubs: number[] = [];
    if (superspreaders && nodes.length > MAX_CLUSTERS * (MAX_HUB_CONTACTS + 1)) {
        const clusters = MIN_CLUSTERS + Math.floor(random() * (MAX_CLUSTERS - MIN_CLUSTERS + 1));
        for (let cluster = 0; cluster < clusters; cluster++) {
            const band = width / clusters;
            const target = { x: band * (cluster + 0.5) + (random() - 0.5) * band * 0.4, y: height * (0.3 + random() * 0.4) };
            const hub = nodes
                .map((node, i) => ({ i, d: Math.hypot(node.x - target.x, node.y - target.y) }))
                .filter(({ i }) => !hubs.includes(i))
                .sort((p, q) => p.d - q.d)[0].i;
            hubs.push(hub);
            nodes[hub] = { ...nodes[hub], r: HUB_RADIUS * radiusScale };

            const reach = MIN_HUB_CONTACTS + Math.floor(random() * (MAX_HUB_CONTACTS - MIN_HUB_CONTACTS + 1));
            byDistanceFrom(hub)
                .filter(({ j }) => !hubs.includes(j))
                .slice(0, reach)
                .forEach(({ j }) => link(hub, j));
        }
    }

    return { width, height, nodes, edges, adjacency, hubs };
};

/** Index of the node closest to a point. */
export const nearestNode = (network: Network, x: number, y: number) => {
    let best = 0;
    network.nodes.forEach((node, i) => {
        const current = network.nodes[best];
        if (Math.hypot(node.x - x, node.y - y) < Math.hypot(current.x - x, current.y - y)) best = i;
    });
    return best;
};

/* ─── Epidemic ───────────────────────────────────────────────────── */

export const S = 0;
export const I = 1;
export const R = 2;
export const D = 3;
export type Compartment = typeof S | typeof I | typeof R | typeof D;

export interface SirdParams {
    /** Per-day probability that an infected node infects a given susceptible neighbour. */
    beta: number;
    /** Mean infectious period (days) of infections that end in recovery. */
    recoveryDays: number;
    /** Mean infectious period (days) of infections that end in death. */
    deathDays: number;
    /** Infection fatality rate: the share of infections that end in death rather than recovery. */
    ifr: number;
}

/** Each infection's fate, decided when it starts (index cases: on the first day, with the parameters then). */
export const FATE_UNDECIDED = 0;
export const FATE_RECOVERS = 1;
export const FATE_DIES = 2;

export interface SirdCounts {
    s: number;
    i: number;
    r: number;
    d: number;
}

export interface SirdState {
    day: number;
    /** The nodes infected at the start of the run (the "initial infected"). */
    indexCases: number[];
    states: Uint8Array;
    /** Each node's fate once infected (`FATE_*`). */
    fates: Uint8Array;
    /** Who infected each node (-1 for index cases and the never-infected). */
    infectedBy: Int16Array;
    history: SirdCounts[];
}

const count = (states: Uint8Array): SirdCounts => {
    const counts = { s: 0, i: 0, r: 0, d: 0 };
    for (const state of states) {
        if (state === S) counts.s++;
        else if (state === I) counts.i++;
        else if (state === R) counts.r++;
        else counts.d++;
    }
    return counts;
};

/**
 * A fresh run at day 0. `initial` is either a number of index cases to place at random among nodes
 * with at least one contact, or the exact nodes to start from.
 */
export const createEpidemic = (network: Network, initial: number | number[], random: Random): SirdState => {
    const states = new Uint8Array(network.nodes.length);
    const infectedBy = new Int16Array(network.nodes.length).fill(-1);
    let indexCases: number[];

    if (Array.isArray(initial)) {
        indexCases = initial.filter((node) => node >= 0 && node < network.nodes.length);
    } else {
        const connected = network.nodes.map((_, i) => i).filter((i) => network.adjacency[i].length > 0);
        indexCases = [];
        for (let k = 0; k < Math.min(initial, connected.length); k++) {
            const pick = k + Math.floor(random() * (connected.length - k));
            [connected[k], connected[pick]] = [connected[pick], connected[k]];
            indexCases.push(connected[k]);
        }
    }

    indexCases.forEach((node) => (states[node] = I));
    return { day: 0, indexCases, states, fates: new Uint8Array(network.nodes.length), infectedBy, history: [count(states)] };
};

export const stepEpidemic = (network: Network, state: SirdState, params: SirdParams, random: Random): SirdState => {
    const states = state.states.slice();
    const fates = state.fates.slice();
    const infectedBy = state.infectedBy.slice();
    const endProbability = {
        [FATE_RECOVERS]: 1 / Math.max(1, params.recoveryDays),
        [FATE_DIES]: 1 / Math.max(1, params.deathDays),
    };
    const drawFate = () => (random() < params.ifr ? FATE_DIES : FATE_RECOVERS);

    state.states.forEach((compartment, node) => {
        if (compartment !== I) return;
        // Index cases get their fate on the first day, so changing the fatality rate during setup still applies.
        if (fates[node] === FATE_UNDECIDED) fates[node] = drawFate();

        for (const neighbour of network.adjacency[node]) {
            if (states[neighbour] === S && random() < params.beta) {
                states[neighbour] = I;
                infectedBy[neighbour] = node;
                fates[neighbour] = drawFate();
            }
        }

        const fate = fates[node] as typeof FATE_RECOVERS | typeof FATE_DIES;
        if (random() < endProbability[fate]) states[node] = fate === FATE_DIES ? D : R;
    });

    return { ...state, day: state.day + 1, states, fates, infectedBy, history: [...state.history, count(states)] };
};

export const isOver = (state: SirdState) => state.history[state.history.length - 1].i === 0;

/** Chance an infection passes along one contact before it ends, for one outcome's infectious period. */
const transmissibilityFor = (beta: number, days: number) => {
    const gamma = 1 / Math.max(1, days);
    return 1 - (gamma * (1 - beta)) / (1 - (1 - beta) * (1 - gamma));
};

type R0Params = Pick<SirdParams, "beta" | "recoveryDays" | "deathDays" | "ifr">;

/**
 * Approximate basic reproduction number on this network: transmissibility T (chance an infection passes along one
 * contact before it ends, averaged over the two outcomes by the fatality rate) times the mean excess degree
 * ⟨k²⟩/⟨k⟩ − 1. Shorter fatal infections lower T, and so R₀.
 */
export const estimateR0 = (network: Network, params: R0Params) => {
    const transmissibility =
        params.ifr * transmissibilityFor(params.beta, params.deathDays) + (1 - params.ifr) * transmissibilityFor(params.beta, params.recoveryDays);
    // Clamp: with no transmission, floating-point error can leave a tiny negative (shown as "−0").
    return Math.max(0, transmissibility) * excessDegree(network);
};

/** Mean excess degree ⟨k²⟩/⟨k⟩ − 1: how many onward contacts a newly infected node has, on average. */
export const excessDegree = (network: Network) => {
    const degrees = network.adjacency.map((neighbours) => neighbours.length);
    const mean = degrees.reduce((sum, k) => sum + k, 0) / degrees.length;
    const meanSquare = degrees.reduce((sum, k) => sum + k * k, 0) / degrees.length;
    return mean > 0 ? meanSquare / mean - 1 : 0;
};

/**
 * Per-contact daily transmission probability that gives a target R₀ on this network, clamped to [min, max].
 * R₀ rises monotonically with β, so bisection finds it to well below display precision.
 */
export const betaForR0 = (network: Network, targetR0: number, durations: Omit<R0Params, "beta">, min = 0.01, max = 0.95) => {
    const r0At = (beta: number) => estimateR0(network, { ...durations, beta });
    if (r0At(max) <= targetR0) return max;
    if (r0At(min) >= targetR0) return min;
    let low = min;
    let high = max;
    for (let iteration = 0; iteration < 60; iteration++) {
        const mid = (low + high) / 2;
        if (r0At(mid) < targetR0) low = mid;
        else high = mid;
    }
    return (low + high) / 2;
};

/**
 * Deterministic, well-mixed SIRD with the same R₀, infectious periods and fatality rate, stepped daily like the
 * simulation. New infections, S·(1 − e^(−β·I/N)) a day, split into a recovering and a dying stream by the fatality
 * rate; each ends at its own rate. β = R₀ / mean infectious period, so R₀ matches the simulation's.
 */
export const deterministicSird = (
    r0: number,
    durations: Pick<SirdParams, "recoveryDays" | "deathDays" | "ifr">,
    population: number,
    initialCases: number,
    days: number,
): SirdCounts[] => {
    const { ifr } = durations;
    const recoveryDays = Math.max(1, durations.recoveryDays);
    const deathDays = Math.max(1, durations.deathDays);
    const beta = r0 / (ifr * deathDays + (1 - ifr) * recoveryDays);
    let s = population - initialCases;
    let iRecovering = initialCases * (1 - ifr);
    let iDying = initialCases * ifr;
    let r = 0;
    let d = 0;
    const curve: SirdCounts[] = [{ s, i: initialCases, r, d }];

    for (let day = 1; day <= days; day++) {
        const i = iRecovering + iDying;
        const infections = s * (1 - Math.exp((-beta * i) / population));
        const recoveries = iRecovering / recoveryDays;
        const deaths = iDying / deathDays;
        s -= infections;
        iRecovering += infections * (1 - ifr) - recoveries;
        iDying += infections * ifr - deaths;
        r += recoveries;
        d += deaths;
        curve.push({ s, i: iRecovering + iDying, r, d });
    }

    return curve;
};

/** Theory infections below this count as over: under half a person rounds to nobody. */
export const THEORY_OVER_BELOW = 0.5;

/**
 * The first day the deterministic curve predicts no one infected (under half a person), or its last day if it never
 * gets there. Infections only fall below the threshold once the outbreak is fading, so this is when it ends.
 */
export const theoryEndDay = (curve: SirdCounts[]) => {
    const day = curve.findIndex((counts) => counts.i < THEORY_OVER_BELOW);
    return day === -1 ? curve.length - 1 : day;
};

/** The day with the most people infected (the first such day on ties). */
export const peakInfections = (history: SirdCounts[]) =>
    history.reduce((peak, counts, day) => (counts.i > peak.count ? { count: counts.i, day } : peak), { count: 0, day: 0 });

/**
 * Deaths as a share of everyone ever infected (the run's observed fatality). Deaths still to come among people
 * who are infected now are not counted yet, so mid-run this is a lower bound; 0 before anyone is infected.
 */
export const deathsAmongInfected = (counts: SirdCounts) => {
    const everInfected = counts.i + counts.r + counts.d;
    return everInfected > 0 ? counts.d / everInfected : 0;
};
