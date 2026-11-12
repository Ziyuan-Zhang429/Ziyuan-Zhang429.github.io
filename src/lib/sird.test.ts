import { describe, expect, it } from "vitest";
import {
    D,
    FATE_DIES,
    FATE_RECOVERS,
    FATE_UNDECIDED,
    I,
    MAX_HUB_CONTACTS,
    MAX_SEED,
    MIN_HUB_CONTACTS,
    MIN_SEED,
    type Network,
    R,
    S,
    betaForR0,
    buildNetwork,
    createEpidemic,
    deathsAmongInfected,
    deterministicSird,
    estimateR0,
    excessDegree,
    isOver,
    mulberry32,
    peakInfections,
    randomSeed,
    seededOrder,
    stepEpidemic,
    theoryEndDay,
} from "./sird";

const DESKTOP = { width: 1080, height: 176, count: 250, minDistance: 19, neighbours: 4, maxEdgeLength: 64 };

const total = (counts: { s: number; i: number; r: number; d: number }) => counts.s + counts.i + counts.r + counts.d;

/** A hand-built network for exact checks: a star (hub 0 linked to 1–4) plus an isolated node 5. */
const star = (): Network => ({
    width: 100,
    height: 100,
    nodes: Array.from({ length: 6 }, (_, i) => ({ x: i * 10, y: 0, r: 3 })),
    edges: [1, 2, 3, 4].map((b) => ({ a: 0, b })),
    adjacency: [[1, 2, 3, 4], [0], [0], [0], [0], []],
    hubs: [],
});

describe("random numbers", () => {
    it("mulberry32 is deterministic and stays in [0, 1)", () => {
        const a = mulberry32(42);
        const b = mulberry32(42);
        const values = Array.from({ length: 1000 }, () => a());
        expect(values).toEqual(Array.from({ length: 1000 }, () => b()));
        expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    });

    it("randomSeed returns five digits", () => {
        for (let k = 0; k < 200; k++) {
            const seed = randomSeed();
            expect(Number.isInteger(seed)).toBe(true);
            expect(seed).toBeGreaterThanOrEqual(MIN_SEED);
            expect(seed).toBeLessThanOrEqual(MAX_SEED);
        }
    });

    it("seededOrder is a deterministic permutation", () => {
        const order = seededOrder(250, mulberry32(7));
        expect([...order].sort((x, y) => x - y)).toEqual(Array.from({ length: 250 }, (_, i) => i));
        expect(seededOrder(250, mulberry32(7))).toEqual(order);
        expect(seededOrder(250, mulberry32(8))).not.toEqual(order);
    });
});

describe("buildNetwork", () => {
    it("places the full population inside the canvas, deterministically", () => {
        const network = buildNetwork(mulberry32(123), DESKTOP);
        expect(network.nodes).toHaveLength(250);
        for (const node of network.nodes) {
            expect(node.x).toBeGreaterThan(0);
            expect(node.x).toBeLessThan(DESKTOP.width);
            expect(node.y).toBeGreaterThan(0);
            expect(node.y).toBeLessThan(DESKTOP.height);
        }
        expect(buildNetwork(mulberry32(123), DESKTOP)).toEqual(network);
    });

    it("keeps edges unique and adjacency symmetric", () => {
        const network = buildNetwork(mulberry32(5), DESKTOP);
        const keys = network.edges.map(({ a, b }) => `${a}-${b}`);
        expect(new Set(keys).size).toBe(keys.length);
        for (const { a, b } of network.edges) {
            expect(a).toBeLessThan(b);
            expect(network.adjacency[a]).toContain(b);
            expect(network.adjacency[b]).toContain(a);
        }
        const degreeSum = network.adjacency.reduce((sum, neighbours) => sum + neighbours.length, 0);
        expect(degreeSum).toBe(2 * network.edges.length);
    });

    it("gives every node a contact and more contacts when asked", () => {
        const sparse = buildNetwork(mulberry32(9), { ...DESKTOP, neighbours: 2 });
        const dense = buildNetwork(mulberry32(9), { ...DESKTOP, neighbours: 8, maxEdgeLength: 128 });
        expect(sparse.adjacency.every((neighbours) => neighbours.length > 0)).toBe(true);
        expect(dense.edges.length).toBeGreaterThan(sparse.edges.length * 2);
    });

    it("keeps the same people when only contacts change", () => {
        const a = buildNetwork(mulberry32(11), { ...DESKTOP, neighbours: 3 });
        const b = buildNetwork(mulberry32(11), { ...DESKTOP, neighbours: 6 });
        expect(b.nodes.map(({ x, y }) => [x, y])).toEqual(a.nodes.map(({ x, y }) => [x, y]));
    });

    it("adds 2–4 superspreader hubs, each linked to at least 6 people", () => {
        for (let seed = 1; seed <= 25; seed++) {
            const network = buildNetwork(mulberry32(seed), { ...DESKTOP, superspreaders: true });
            expect(network.hubs.length).toBeGreaterThanOrEqual(2);
            expect(network.hubs.length).toBeLessThanOrEqual(4);
            expect(new Set(network.hubs).size).toBe(network.hubs.length);
            for (const hub of network.hubs) expect(network.adjacency[hub].length).toBeGreaterThanOrEqual(MIN_HUB_CONTACTS);
        }
        expect(MAX_HUB_CONTACTS).toBeGreaterThanOrEqual(MIN_HUB_CONTACTS);
        expect(buildNetwork(mulberry32(1), DESKTOP).hubs).toEqual([]);
    });
});

describe("createEpidemic", () => {
    it("seeds a number of index cases among connected nodes", () => {
        const epidemic = createEpidemic(star(), 3, mulberry32(1));
        expect(epidemic.indexCases).toHaveLength(3);
        expect(epidemic.indexCases).not.toContain(5);
        expect(epidemic.history).toEqual([{ s: 3, i: 3, r: 0, d: 0 }]);
        expect(epidemic.day).toBe(0);
    });

    it("starts from exact index cases and ignores out-of-range ones", () => {
        const epidemic = createEpidemic(star(), [2, 4, 99, -1], mulberry32(1));
        expect(epidemic.indexCases).toEqual([2, 4]);
        expect(epidemic.states[2]).toBe(I);
        expect(epidemic.states[0]).toBe(S);
    });

    it("can start with nobody infected, which is already over", () => {
        const epidemic = createEpidemic(star(), [], mulberry32(1));
        expect(isOver(epidemic)).toBe(true);
    });
});

describe("stepEpidemic", () => {
    const run = (network: Network, params: { beta: number; recoveryDays: number; deathDays: number; ifr: number }, seed = 3) => {
        const random = mulberry32(seed);
        let epidemic = createEpidemic(network, 2, random);
        const seen = [epidemic];
        while (!isOver(epidemic) && epidemic.day < 1000) {
            epidemic = stepEpidemic(network, epidemic, params, random);
            seen.push(epidemic);
        }
        return seen;
    };

    it("conserves the population and moves people only forwards", () => {
        const network = buildNetwork(mulberry32(21), DESKTOP);
        const runs = run(network, { beta: 0.3, recoveryDays: 5, deathDays: 5, ifr: 0.1 });
        const history = runs[runs.length - 1].history;
        for (let day = 0; day < history.length; day++) {
            expect(total(history[day])).toBe(250);
            if (day > 0) {
                expect(history[day].s).toBeLessThanOrEqual(history[day - 1].s);
                expect(history[day].r).toBeGreaterThanOrEqual(history[day - 1].r);
                expect(history[day].d).toBeGreaterThanOrEqual(history[day - 1].d);
            }
        }
        expect(isOver(runs[runs.length - 1])).toBe(true);
    });

    it("only infects through contacts and records who infected whom", () => {
        const network = buildNetwork(mulberry32(4), DESKTOP);
        const final = run(network, { beta: 0.5, recoveryDays: 4, deathDays: 4, ifr: 0 }).pop()!;
        final.infectedBy.forEach((infector, node) => {
            if (infector === -1) return;
            expect(network.adjacency[node]).toContain(infector);
            expect(final.indexCases).not.toContain(node);
        });
    });

    it("never kills anyone at 0% fatality and never lets anyone recover at 100%", () => {
        const network = buildNetwork(mulberry32(6), DESKTOP);
        const safe = run(network, { beta: 0.4, recoveryDays: 3, deathDays: 3, ifr: 0 }).pop()!.history.pop()!;
        const deadly = run(network, { beta: 0.4, recoveryDays: 3, deathDays: 3, ifr: 1 }).pop()!.history.pop()!;
        expect(safe.d).toBe(0);
        expect(deadly.r).toBe(0);
        expect(deadly.d).toBeGreaterThan(0);
    });

    it("does not spread at zero transmission", () => {
        const network = buildNetwork(mulberry32(8), DESKTOP);
        const final = run(network, { beta: 0, recoveryDays: 3, deathDays: 3, ifr: 0.5 }).pop()!.history.pop()!;
        expect(final.s).toBe(248);
        expect(final.r + final.d).toBe(2);
    });

    it("keeps the index cases and states consistent with the counts", () => {
        const network = buildNetwork(mulberry32(10), DESKTOP);
        const final = run(network, { beta: 0.3, recoveryDays: 4, deathDays: 4, ifr: 0.2 }).pop()!;
        const counts = { s: 0, i: 0, r: 0, d: 0 };
        final.states.forEach((state) => (state === S ? counts.s++ : state === I ? counts.i++ : state === R ? counts.r++ : state === D && counts.d++));
        expect(counts).toEqual(final.history[final.history.length - 1]);
        expect(final.indexCases).toHaveLength(2);
    });
});

describe("R₀", () => {
    it("excessDegree is ⟨k²⟩/⟨k⟩ − 1", () => {
        // Degrees 4,1,1,1,1,0 → ⟨k⟩ = 8/6, ⟨k²⟩ = 20/6 → 20/8 − 1 = 1.5
        expect(excessDegree(star())).toBeCloseTo(1.5);
    });

    it("estimateR0 is zero without transmission and grows with it", () => {
        const network = buildNetwork(mulberry32(2), DESKTOP);
        expect(estimateR0(network, { beta: 0, recoveryDays: 5, deathDays: 5, ifr: 0 })).toBe(0);
        expect(estimateR0(network, { beta: 0.4, recoveryDays: 5, deathDays: 5, ifr: 0 })).toBeGreaterThan(
            estimateR0(network, { beta: 0.2, recoveryDays: 5, deathDays: 5, ifr: 0 }),
        );
        expect(estimateR0(network, { beta: 0.2, recoveryDays: 10, deathDays: 10, ifr: 0 })).toBeGreaterThan(
            estimateR0(network, { beta: 0.2, recoveryDays: 5, deathDays: 5, ifr: 0 }),
        );
    });

    it("betaForR0 inverts estimateR0 when the target is reachable", () => {
        const network = buildNetwork(mulberry32(3), { ...DESKTOP, neighbours: 6, maxEdgeLength: 100 });
        for (const target of [1.2, 1.5, 2.8]) {
            for (const infectiousDays of [3, 8, 21]) {
                for (const durations of [
                    { recoveryDays: infectiousDays, deathDays: infectiousDays, ifr: 0.01 },
                    { recoveryDays: infectiousDays, deathDays: 2, ifr: 0.5 },
                ]) {
                    const beta = betaForR0(network, target, durations);
                    expect(estimateR0(network, { ...durations, beta })).toBeCloseTo(target, 6);
                }
            }
        }
    });

    it("betaForR0 clamps when the network can't reach the target", () => {
        const network = buildNetwork(mulberry32(3), { ...DESKTOP, neighbours: 3 });
        const durations = { recoveryDays: 8, deathDays: 8, ifr: 0.1 };
        expect(betaForR0(network, 50, durations, 0.01, 0.95)).toBe(0.95);
        expect(betaForR0(network, 0, durations, 0.01, 0.95)).toBe(0.01);
    });
});

describe("outcome-specific infectious periods", () => {
    it("a disease that kills quickly has a lower R₀ than one that kills slowly", () => {
        const network = buildNetwork(mulberry32(3), DESKTOP);
        const slow = estimateR0(network, { beta: 0.2, recoveryDays: 16, deathDays: 16, ifr: 0.5 });
        const quick = estimateR0(network, { beta: 0.2, recoveryDays: 16, deathDays: 4, ifr: 0.5 });
        expect(quick).toBeLessThan(slow);
        // With nobody dying, the death period can't matter.
        expect(estimateR0(network, { beta: 0.2, recoveryDays: 16, deathDays: 4, ifr: 0 })).toBeCloseTo(
            estimateR0(network, { beta: 0.2, recoveryDays: 16, deathDays: 30, ifr: 0 }),
        );
    });

    it("decides index cases' fates on the first day, with the fatality rate in force then", () => {
        const network = buildNetwork(mulberry32(12), DESKTOP);
        const random = mulberry32(1);
        const start = createEpidemic(network, 3, random);
        expect([...start.fates].every((fate) => fate === FATE_UNDECIDED)).toBe(true);
        const next = stepEpidemic(network, start, { beta: 0, recoveryDays: 30, deathDays: 30, ifr: 1 }, random);
        for (const node of start.indexCases) expect(next.fates[node]).toBe(FATE_DIES);
    });

    it("ends fatal infections at the death period's rate", () => {
        const network = buildNetwork(mulberry32(13), DESKTOP);
        const meanDuration = (deathDays: number) => {
            let days = 0;
            const runs = 40;
            for (let seed = 0; seed < runs; seed++) {
                const random = mulberry32(seed);
                let epidemic = createEpidemic(network, 1, random);
                while (!isOver(epidemic)) epidemic = stepEpidemic(network, epidemic, { beta: 0, recoveryDays: 30, deathDays, ifr: 1 }, random);
                days += epidemic.day;
            }
            return days / runs;
        };
        expect(meanDuration(1)).toBe(1);
        expect(meanDuration(10)).toBeGreaterThan(5);
    });

    it("gives every infected person a fate", () => {
        const network = buildNetwork(mulberry32(14), DESKTOP);
        const random = mulberry32(2);
        let epidemic = createEpidemic(network, 2, random);
        while (!isOver(epidemic)) epidemic = stepEpidemic(network, epidemic, { beta: 0.3, recoveryDays: 6, deathDays: 3, ifr: 0.4 }, random);
        epidemic.states.forEach((state, node) => {
            if (state === S) expect(epidemic.fates[node]).toBe(FATE_UNDECIDED);
            if (state === D) expect(epidemic.fates[node]).toBe(FATE_DIES);
            if (state === R) expect(epidemic.fates[node]).toBe(FATE_RECOVERS);
        });
    });
});

describe("deterministicSird", () => {
    it("conserves the population", () => {
        for (const counts of deterministicSird(2.5, { recoveryDays: 12, deathDays: 4, ifr: 0.4 }, 250, 1, 120)) expect(total(counts)).toBeCloseTo(250, 6);
    });

    it("grows when R₀ > 1 and dies out when R₀ < 1", () => {
        const growing = deterministicSird(2.5, { recoveryDays: 6, deathDays: 6, ifr: 0 }, 250, 1, 30);
        const fading = deterministicSird(0.6, { recoveryDays: 6, deathDays: 6, ifr: 0 }, 250, 1, 30);
        expect(growing[10].i).toBeGreaterThan(growing[0].i);
        expect(fading[10].i).toBeLessThan(fading[0].i);
    });

    it("splits ended infections into deaths at the fatality rate", () => {
        for (const deathDays of [2, 5, 15]) {
            const final = deterministicSird(3, { recoveryDays: 5, deathDays, ifr: 0.3 }, 250, 1, 600).pop()!;
            expect(final.d / (final.r + final.d)).toBeCloseTo(0.3, 6);
        }
    });
});

describe("theoryEndDay", () => {
    const durations = { recoveryDays: 6, deathDays: 6, ifr: 0 };

    it("is the first day the theory predicts under half a person infected, after the peak", () => {
        const curve = deterministicSird(2.5, durations, 250, 1, 730);
        const end = theoryEndDay(curve);
        expect(curve[end].i).toBeLessThan(0.5);
        expect(curve[end - 1].i).toBeGreaterThanOrEqual(0.5);
        expect(end).toBeGreaterThan(peakInfections(curve).day);
    });

    it("ends sooner when the outbreak fades from the start", () => {
        const fading = theoryEndDay(deterministicSird(0.6, durations, 250, 1, 730));
        expect(fading).toBeGreaterThan(0);
        expect(fading).toBeLessThan(theoryEndDay(deterministicSird(2.5, durations, 250, 1, 730)));
    });

    it("is day 0 with no one infected and the last day if the outbreak outlasts the curve", () => {
        expect(theoryEndDay(deterministicSird(2.5, durations, 250, 0, 100))).toBe(0);
        expect(theoryEndDay(deterministicSird(2.5, durations, 250, 1, 20))).toBe(20);
    });
});

describe("deathsAmongInfected", () => {
    it("divides deaths by everyone ever infected, not the whole population", () => {
        expect(deathsAmongInfected({ s: 200, i: 10, r: 30, d: 10 })).toBe(0.2);
        expect(deathsAmongInfected({ s: 250, i: 0, r: 0, d: 0 })).toBe(0);
        expect(deathsAmongInfected({ s: 0, i: 0, r: 0, d: 250 })).toBe(1);
    });

    it("approaches the fatality rate by the end of a run", () => {
        const network = buildNetwork(mulberry32(15), DESKTOP);
        const random = mulberry32(4);
        let epidemic = createEpidemic(network, 5, random);
        while (!isOver(epidemic)) epidemic = stepEpidemic(network, epidemic, { beta: 0.4, recoveryDays: 5, deathDays: 5, ifr: 0.5 }, random);
        const final = epidemic.history[epidemic.history.length - 1];
        const infected = final.r + final.d;
        // Each death is a coin flip at the fatality rate: allow three binomial standard deviations.
        const tolerance = 3 * Math.sqrt((0.5 * 0.5) / infected);
        expect(infected).toBeGreaterThan(100);
        expect(Math.abs(deathsAmongInfected(final) - 0.5)).toBeLessThan(tolerance);
    });
});

describe("peakInfections", () => {
    it("finds the first day with the most infected", () => {
        const history = [0, 3, 7, 7, 2].map((i) => ({ s: 0, i, r: 0, d: 0 }));
        expect(peakInfections(history)).toEqual({ count: 7, day: 2 });
    });
});
