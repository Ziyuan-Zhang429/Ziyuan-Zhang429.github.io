import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from "react";
import { useFormatter, useTranslations } from "use-intl";
import type { SirdCounts } from "@/lib/sird";
import { cx } from "@/utils/cx";
import { PERCENT_FORMAT } from "@/utils/format/number";

const DEFAULT_HEIGHT = 200;
const PAD = { top: 10, right: 44, bottom: 24, left: 34 };
/** End labels closer than this (in pixels) are nudged apart. */
const LABEL_GAP = 13;

type SeriesKey = "s" | "i" | "r" | "d";

/** Legend order. */
export const SERIES = [
    { key: "s", label: "susceptible", color: "var(--color-sir-s)" },
    { key: "i", label: "infected", color: "var(--color-sir-i)" },
    { key: "r", label: "recovered", color: "var(--color-sir-r)" },
    { key: "d", label: "died", color: "var(--color-sir-d)" },
] as const;

/** Paint order: infected last, so it is never hidden under the other lines. */
const PAINT_ORDER = [SERIES[0], SERIES[2], SERIES[3], SERIES[1]];

interface EpidemicChartProps {
    history: SirdCounts[];
    /** Deterministic reference curves, drawn dashed behind the simulation. */
    theory?: SirdCounts[];
    population: number;
    /** The x-axis spans at least this many days so early curves don't stretch. */
    minDays?: number;
    /** Rendered height in pixels. */
    height?: number;
    className?: string;
}

/**
 * S/I/R/D counts by day: four 2px simulation lines over light dashed theory lines, a recessive grid,
 * direct end labels, and a crosshair tooltip on pointer and arrow keys.
 */
export const EpidemicChart = ({ history, theory, population, minDays = 40, height = DEFAULT_HEIGHT, className }: EpidemicChartProps) => {
    const plotHeight = height - PAD.top - PAD.bottom;
    const t = useTranslations("home");
    const format = useFormatter();
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoverDay, setHoverDay] = useState<number | null>(null);

    // Draw in real pixels (viewBox = rendered width) so labels keep their size on narrow screens.
    const [width, setWidth] = useState(560);
    useEffect(() => {
        const element = svgRef.current?.parentElement;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    const plotWidth = width - PAD.left - PAD.right;

    const lastDay = history.length - 1;
    const maxDay = Math.max(minDays, lastDay);
    const x = (day: number) => PAD.left + (day / maxDay) * plotWidth;
    const y = (value: number) => PAD.top + (1 - value / population) * plotHeight;

    const path = (points: SirdCounts[], key: SeriesKey) =>
        points
            .slice(0, maxDay + 1)
            .map((counts, day) => `${day === 0 ? "M" : "L"}${x(day).toFixed(1)},${y(counts[key]).toFixed(1)}`)
            .join("");

    // Direct labels at the line ends, nudged apart so they never overlap and kept inside the plot.
    const latest = history[lastDay];
    const endLabels = SERIES.map((item) => ({ key: item.key, color: item.color, value: latest[item.key], y: y(latest[item.key]) }))
        .sort((a, b) => a.y - b.y)
        .reduce<{ key: SeriesKey; color: string; value: number; y: number }[]>((placed, item) => {
            const previous = placed[placed.length - 1];
            placed.push({ ...item, y: previous && item.y - previous.y < LABEL_GAP ? previous.y + LABEL_GAP : item.y });
            return placed;
        }, []);
    const bottom = PAD.top + plotHeight;
    for (let index = endLabels.length - 1; index >= 0; index--) {
        const limit = index === endLabels.length - 1 ? bottom : endLabels[index + 1].y - LABEL_GAP;
        endLabels[index].y = Math.min(endLabels[index].y, limit);
    }

    const dayFromPointer = (event: PointerEvent<SVGSVGElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return null;
        const viewX = ((event.clientX - rect.left) / rect.width) * width;
        return Math.min(lastDay, Math.max(0, Math.round(((viewX - PAD.left) / plotWidth) * maxDay)));
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const step = { ArrowLeft: -1, ArrowRight: 1, Home: -Infinity, End: Infinity }[event.key];
        if (step === undefined) return;
        event.preventDefault();
        setHoverDay((current) => Math.min(lastDay, Math.max(0, (current ?? lastDay) + step)));
    };

    const activeDay = hoverDay !== null ? Math.min(hoverDay, lastDay) : null;
    const active = activeDay !== null ? history[activeDay] : null;
    const activeTheory = activeDay !== null ? theory?.[activeDay] : undefined;
    const tooltipLeft = activeDay !== null ? (x(activeDay) / width) * 100 : 0;
    const readout = active
        ? `${t("simulator.day", { day: activeDay! })}: ${SERIES.map(
              (item) => `${t(`figure.${item.label}`)} ${active[item.key]} (${format.number(active[item.key] / population, PERCENT_FORMAT)})`,
          ).join(", ")}`
        : "";

    return (
        <div
            tabIndex={0}
            role="group"
            aria-label={t("simulator.chart.label")}
            onKeyDown={onKeyDown}
            onBlur={() => setHoverDay(null)}
            className={cx("relative rounded-lg outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-4", className)}
        >
            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                style={{ height }}
                className="block w-full touch-pan-y overflow-visible"
                onPointerMove={(event) => setHoverDay(dayFromPointer(event))}
                onPointerLeave={() => setHoverDay(null)}
                aria-hidden="true"
            >
                {/* Recessive grid: 0, half, and the whole population. */}
                {[0, 0.5, 1].map((share) => (
                    <g key={share}>
                        <line
                            x1={PAD.left}
                            x2={PAD.left + plotWidth}
                            y1={y(population * share)}
                            y2={y(population * share)}
                            className="stroke-border-secondary"
                            strokeWidth={1}
                        />
                        <text x={PAD.left - 8} y={y(population * share)} dy="0.32em" textAnchor="end" className="fill-text-quaternary font-mono text-[10px]">
                            {format.number(Math.round(population * share))}
                        </text>
                    </g>
                ))}
                <text x={PAD.left} y={height - 4} className="fill-text-quaternary font-mono text-[10px]">
                    {t("simulator.day", { day: 0 })}
                </text>
                <text x={PAD.left + plotWidth} y={height - 4} textAnchor="end" className="fill-text-quaternary font-mono text-[10px]">
                    {t("simulator.day", { day: maxDay })}
                </text>

                {/* Theory: light dashed lines behind the simulation. */}
                {theory &&
                    PAINT_ORDER.map((item) => (
                        <path
                            key={`theory-${item.key}`}
                            d={path(theory, item.key)}
                            fill="none"
                            stroke={item.color}
                            strokeOpacity={0.45}
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                        />
                    ))}

                {PAINT_ORDER.map((item) => (
                    <path
                        key={item.key}
                        d={path(history, item.key)}
                        fill="none"
                        stroke={item.color}
                        strokeWidth={2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                ))}

                {/* End labels: values in ink, identity from the short line key beside them. */}
                {endLabels.map((label) => (
                    <g key={label.key} transform={`translate(${x(lastDay) + 6}, ${label.y})`}>
                        <line x1={0} x2={8} y1={0} y2={0} stroke={label.color} strokeWidth={2} strokeLinecap="round" />
                        <text x={12} dy="0.32em" className="fill-text-secondary font-mono text-[10px] tabular-nums">
                            {label.value}
                        </text>
                    </g>
                ))}

                {active && activeDay !== null && (
                    <g>
                        <line x1={x(activeDay)} x2={x(activeDay)} y1={PAD.top} y2={PAD.top + plotHeight} className="stroke-border-primary" strokeWidth={1} />
                        {PAINT_ORDER.map((item) => (
                            <circle
                                key={item.key}
                                cx={x(activeDay)}
                                cy={y(active[item.key])}
                                r={4}
                                fill={item.color}
                                className="stroke-surface"
                                strokeWidth={2}
                            />
                        ))}
                    </g>
                )}
            </svg>

            {active && activeDay !== null && (
                <div
                    className={cx(
                        "pointer-events-none absolute top-0 z-10 rounded-lg bg-primary-solid px-3 py-2 text-xs text-white shadow-lg",
                        tooltipLeft > 60 ? "-translate-x-[calc(100%+12px)]" : "translate-x-3",
                    )}
                    style={{ left: `${tooltipLeft}%` }}
                >
                    {/* A small table: labels left, numbers right-aligned in a monospace face, so every column lines up. */}
                    <table className="border-separate border-spacing-x-0 border-spacing-y-0.5 text-left">
                        <thead>
                            <tr className="font-mono text-[11px] text-white/60">
                                <th colSpan={2} className="pr-4 font-normal">
                                    {t("simulator.day", { day: activeDay })}
                                </th>
                                <th className="pr-1 text-right font-normal">{t("simulator.theory.legend")}</th>
                                {activeTheory && <th className="pl-3 text-right font-normal">{t("simulator.theory.tooltip")}</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {SERIES.map((item) => (
                                <tr key={item.key}>
                                    <td className="pr-2">
                                        <span className="block h-0.5 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    </td>
                                    <td className="pr-4 text-white/70">{t(`figure.${item.label}`)}</td>
                                    <td className="pr-1 text-right font-mono whitespace-nowrap tabular-nums">
                                        <span className="font-semibold text-white">{active[item.key]}</span>{" "}
                                        <span className="text-[11px] text-white/60">({format.number(active[item.key] / population, PERCENT_FORMAT)})</span>
                                    </td>
                                    {activeTheory && (
                                        <td className="pl-3 text-right font-mono text-white/60 tabular-nums">{Math.round(activeTheory[item.key])}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <p aria-live="polite" className="sr-only">
                {readout}
            </p>
        </div>
    );
};
