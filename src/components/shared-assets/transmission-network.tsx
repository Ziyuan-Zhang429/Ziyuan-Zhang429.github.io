import type { CSSProperties } from "react";
import { buildNetwork, mulberry32, nearestNode } from "@/lib/sird";
import { cx } from "@/utils/cx";

/**
 * Decorative, non-interactive SIR wave on a random contact network (used behind the CTA and on the 404).
 * The network, transmission tree and infection times are computed deterministically from a seed,
 * then animated purely with CSS (see `site.css`). The interactive version is `EpidemicSimulator`.
 */

const TRANSMISSION_PROBABILITY = 0.82;
/** Seconds of rest after the last infection before the next wave starts. */
const REST = 4;

const buildEpidemic = (seed: number) => {
    const random = mulberry32(seed);
    const network = buildNetwork(random);
    const { nodes, edges, adjacency } = network;
    const index = nearestNode(network, network.width * 0.4, network.height * 0.5);

    // Simulate spread as first-passage percolation: each contact either transmits
    //    (with a random serial interval) or never does. Dijkstra gives infection times.
    const infectedAt = new Array<number>(nodes.length).fill(Infinity);
    const infectedBy = new Array<number>(nodes.length).fill(-1);
    const transmits = new Map<string, number>();
    edges.forEach(({ a, b }) => {
        if (random() < TRANSMISSION_PROBABILITY) transmits.set(`${a}-${b}`, 0.22 + random() * 0.38);
    });

    infectedAt[index] = 0;
    const visited = new Set<number>();
    while (visited.size < nodes.length) {
        let current = -1;
        infectedAt.forEach((time, i) => {
            if (!visited.has(i) && time < Infinity && (current === -1 || time < infectedAt[current])) current = i;
        });
        if (current === -1) break;
        visited.add(current);

        adjacency[current].forEach((next) => {
            const interval = transmits.get(current < next ? `${current}-${next}` : `${next}-${current}`);
            if (interval === undefined) return;
            const time = infectedAt[current] + interval;
            if (time < infectedAt[next]) {
                infectedAt[next] = time;
                infectedBy[next] = current;
            }
        });
    }

    const lastInfection = Math.max(...infectedAt.filter((time) => time < Infinity));

    return {
        width: network.width,
        height: network.height,
        nodes,
        edges,
        index,
        infectedAt,
        infectedBy,
        period: lastInfection + REST,
        snapshot: lastInfection * 0.45,
    };
};

/** Infection state at a fixed moment, used when animations are disabled. */
const staticState = (infectedAt: number, snapshot: number) => {
    if (infectedAt === Infinity || infectedAt > snapshot) return "s";
    return snapshot - infectedAt < 0.9 ? "i" : "r";
};

interface TransmissionNetworkProps {
    className?: string;
    seed?: number;
}

export const TransmissionNetwork = ({ className, seed = 11 }: TransmissionNetworkProps) => {
    const { width, height, nodes, edges, index, infectedAt, infectedBy, period, snapshot } = buildEpidemic(seed);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid slice"
            className={cx("block h-full w-full", className)}
            style={{ "--sir-period": `${period.toFixed(2)}s` } as CSSProperties}
            aria-hidden="true"
            focusable="false"
        >
            <g strokeWidth={1} strokeLinecap="round">
                {edges.map(({ a, b }) => {
                    const child = infectedBy[b] === a ? b : infectedBy[a] === b ? a : -1;
                    const isTransmission = child !== -1;

                    return (
                        <line
                            key={`${a}-${b}`}
                            x1={nodes[a].x}
                            y1={nodes[a].y}
                            x2={nodes[b].x}
                            y2={nodes[b].y}
                            className="sir-edge"
                            data-transmission={isTransmission || undefined}
                            data-static={isTransmission ? staticState(infectedAt[child], snapshot) : undefined}
                            style={isTransmission ? ({ "--sir-delay": `${infectedAt[child].toFixed(2)}s` } as CSSProperties) : undefined}
                        />
                    );
                })}
            </g>
            <g>
                {nodes.map((node, i) => {
                    const isInfected = infectedAt[i] < Infinity;

                    return (
                        <circle
                            key={i}
                            cx={node.x}
                            cy={node.y}
                            r={i === index ? node.r + 1.5 : node.r}
                            className="sir-node"
                            data-infected={isInfected || undefined}
                            data-static={staticState(infectedAt[i], snapshot)}
                            style={isInfected ? ({ "--sir-delay": `${infectedAt[i].toFixed(2)}s` } as CSSProperties) : undefined}
                        />
                    );
                })}
            </g>
        </svg>
    );
};
