import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, FlipBackward, PauseCircle, Play, Share07, Shuffle01 } from "@untitledui/icons";
import { useFormatter, useTranslations } from "use-intl";
import { Button } from "@/components/base/buttons/button";
import { Card } from "@/components/base/card/card";
import { Chip, ChipGroup } from "@/components/base/chip-group/chip-group";
import { Heading, Overline } from "@/components/base/heading/heading";
import { InfoTooltip } from "@/components/base/info-tooltip/info-tooltip";
import { Slider, SliderGroup } from "@/components/base/slider/slider";
import { TextLink } from "@/components/base/text-link/text-link";
import { Toggle } from "@/components/base/toggle/toggle";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import {
    COVID_AGE_PROFILE,
    type EpidemicPreset,
    FLU_AGE_PROFILE,
    POPULATION_IDS,
    PRESET_SOURCES,
    type PopulationId,
    type PresetId,
    SOURCE_ORDER,
    SUPERSPREADING_SOURCE,
    type SourceId,
    VISIBLE_PRESETS,
    hasOutcomeSpecificPeriods,
    sourceNumber,
} from "@/content/epidemic-presets";
import { useClipboard } from "@/hooks/use-clipboard";
import { useElementSize } from "@/hooks/use-element-size";
import {
    BETA_STEP,
    IFR_STEP,
    INFECTIOUS_DAYS_STEP,
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
    POPULATION,
    useEpidemicSimulation,
} from "@/hooks/use-epidemic-simulation";
import { useIsVisible } from "@/hooks/use-is-visible";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SIMULATION_ANCHOR, useSimulationUrl } from "@/hooks/use-simulation-url";
import { D, I, R } from "@/lib/sird";
import { cx } from "@/utils/cx";
import { withPeriod } from "@/utils/format/citation";
import { DAYS_FORMAT, DECIMAL_FORMAT, PERCENT_FORMAT } from "@/utils/format/number";
import { EpidemicChart, SERIES } from "./epidemic-chart";

export { SIMULATION_ANCHOR };

/** Clickable area around each person; larger than the dot so it is easy to hit. */
const HIT_RADIUS = 9;

/** Initial canvas size before the first measurement (desktop container width × strip height). */
const INITIAL_CANVAS = { width: 1152, height: 208 };
/** Round the measured width to this step so small layout shifts don't rebuild the network. */
const CANVAS_WIDTH_STEP = 40;
/** Chart height in pixels; sized so the chart column balances the parameters column on desktop. */
const CHART_HEIGHT = 196;
/** Keep the initial-infected label inside the canvas: flip below the node / anchor to an edge when this close. */
const LABEL_EDGE_MARGIN = 56;

const nodeFill = (state: number | undefined) =>
    state === I ? "var(--color-sir-i)" : state === R ? "var(--color-sir-r)" : state === D ? "var(--color-sir-d)" : "var(--color-sir-s-muted)";

/** The fatality the chosen age implies, with its citations. */
const PopulationSummary = ({
    preset,
    ageGroup,
    onOpenSources,
}: {
    preset: EpidemicPreset | null;
    ageGroup: PopulationId | null;
    onOpenSources: () => void;
}) => {
    const t = useTranslations("home.simulator.populations");
    const format = useFormatter();
    const percent = (value: number) => format.number(value, PERCENT_FORMAT);

    if (!preset?.ageProfile) return null;
    if (!ageGroup || ageGroup === "all") return <>{t("allSummary")}</>;

    const { profile, scale, scaleSource } = preset.ageProfile;
    const group = profile.groups[ageGroup];
    const text = scale
        ? t("scaledSummary", { ages: group.ages, base: percent(group.ifr), scale: format.number(scale, DECIMAL_FORMAT), ifr: percent(group.ifr * scale) })
        : t(`ageSummary.${profile.measure}`, { ages: group.ages, ifr: percent(group.ifr) });

    return (
        <>
            {text}
            <SourceMarkers sources={[group.source ?? profile.source, ...(scaleSource ? [scaleSource] : [])]} onOpen={onOpenSources} />
        </>
    );
};

/** Numbered citation markers that open the reference list and jump to the entry. */
const SourceMarkers = ({ sources, onOpen }: { sources: SourceId[]; onOpen: () => void }) => {
    const t = useTranslations("home.simulator.presets.sources");
    // One marker per source, even when a source backs two numbers.
    return [...new Set(sources)].map((source) => (
        <a
            key={source}
            href={`#preset-source-${source}`}
            onClick={onOpen}
            className="ml-1 rounded-xs font-mono text-xs text-brand-secondary outline-focus-ring hover:underline focus-visible:outline-2"
        >
            <span aria-hidden="true">[{sourceNumber(source)}]</span>
            <span className="sr-only">{t("cite", { number: sourceNumber(source) })}</span>
        </a>
    ));
};

/**
 * Interactive stochastic SIRD figure: the contact network, a live epidemic curve with the deterministic
 * reference, disease presets and parameter controls. State and actions come from `useEpidemicSimulation`.
 */
export const EpidemicSimulator = () => {
    const t = useTranslations("home");
    const format = useFormatter();
    const rootRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const url = useSimulationUrl();
    const simulation = useEpidemicSimulation({
        size: useElementSize(canvasRef, INITIAL_CANVAS, CANVAS_WIDTH_STEP),
        visible: useIsVisible(rootRef),
        // A shared link opens on its exact setup, paused, so the visitor sees it before it runs.
        startPaused: usePrefersReducedMotion() || url.fromUrl,
        initialSetup: url.initialSetup,
    });

    // Share: the system share sheet on touch devices, otherwise copy the link.
    const clipboard = useClipboard();
    const [shareTooltipOpen, setShareTooltipOpen] = useState(false);
    const share = async () => {
        const link = url.shareUrl(simulation.setup);
        if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
            try {
                await navigator.share({ title: t("simulator.title"), url: link });
                return;
            } catch {
                // Dismissed or unsupported: fall back to copying.
            }
        }
        await clipboard.copy(link);
    };

    // Settings go into the URL once someone uses the simulator (or arrived with settings), never on a plain visit.
    const { persist } = url;
    useEffect(() => {
        if (simulation.interacted || url.fromUrl) persist(simulation.setup);
    }, [persist, simulation.setup, simulation.interacted, url.fromUrl]);
    const {
        network,
        epidemic,
        params,
        superspreaders,
        beta,
        preset,
        playing,
        finished,
        editable,
        canPlay,
        population,
        r0,
        maxR0,
        theory,
        chartDays,
        peak,
        everInfected,
        deaths,
    } = simulation;
    const sourcesRef = useRef<HTMLDetailsElement>(null);
    /** Citation markers open the reference list first, so the anchor jump lands on a visible entry. */
    const openSources = () => {
        if (sourcesRef.current) sourcesRef.current.open = true;
    };
    const hubs = new Set(network.hubs);
    const significant = (value: number) => format.number(value, DECIMAL_FORMAT);

    return (
        // `#simulation` is a page anchor: the page's scroll-padding lands the network just below the sticky header.
        <figure ref={rootRef} id={SIMULATION_ANCHOR} aria-labelledby="simulator-title" className="mb-4">
            {/* The contact network, generated to fit this box. During setup, clicking a person toggles them as an initial infected. */}
            <div ref={canvasRef} className="h-80 md:h-44">
                <svg viewBox={`0 0 ${network.width} ${network.height}`} className="block h-full w-full overflow-visible" aria-hidden="true">
                    <g strokeWidth={1} strokeLinecap="round">
                        {network.edges.map(({ a, b }) => {
                            const child = epidemic.infectedBy[b] === a ? b : epidemic.infectedBy[a] === b ? a : -1;
                            const stroke = child === -1 ? "var(--color-sir-edge)" : nodeFill(epidemic.states[child]);
                            return (
                                <line
                                    key={`${a}-${b}`}
                                    x1={network.nodes[a].x}
                                    y1={network.nodes[a].y}
                                    x2={network.nodes[b].x}
                                    y2={network.nodes[b].y}
                                    stroke={stroke}
                                    className="transition-[stroke] duration-300"
                                />
                            );
                        })}
                    </g>
                    <g>
                        {network.nodes.map((node, i) => (
                            <g key={i} className={cx("group/node", editable && "cursor-pointer")} onClick={() => simulation.toggleIndexCase(i)}>
                                <circle cx={node.x} cy={node.y} r={HIT_RADIUS} fill="transparent" />
                                {hubs.has(i) && (
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={node.r * 1.8}
                                        fill="none"
                                        stroke={nodeFill(epidemic.states[i])}
                                        strokeOpacity={0.5}
                                        strokeWidth={1.5}
                                        className="transition-[stroke] duration-300"
                                    />
                                )}
                                {epidemic.states[i] === D ? (
                                    // Deaths are a cross, so the state reads by shape as well as colour.
                                    <path
                                        d={`M${node.x - node.r} ${node.y - node.r}L${node.x + node.r} ${node.y + node.r}M${node.x + node.r} ${node.y - node.r}L${node.x - node.r} ${node.y + node.r}`}
                                        stroke="var(--color-sir-d)"
                                        strokeWidth={1.75}
                                        strokeLinecap="round"
                                    />
                                ) : (
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={node.r}
                                        fill={nodeFill(epidemic.states[i])}
                                        className={cx(
                                            "origin-center transition-[fill,scale] duration-300 [transform-box:fill-box]",
                                            editable && "group-hover/node:scale-150",
                                            epidemic.states[i] === I && "scale-140",
                                        )}
                                    />
                                )}
                            </g>
                        ))}
                    </g>

                    {/* Initial infected: an ink ring and a label on every index case. */}
                    <g className="pointer-events-none">
                        {epidemic.indexCases.map((index) => {
                            const node = network.nodes[index];
                            const below = node.y < 28;
                            return (
                                <g key={index}>
                                    <circle cx={node.x} cy={node.y} r={node.r * 1.4 + 3.5} fill="none" className="stroke-fg-primary" strokeWidth={1.5} />
                                    <text
                                        x={node.x}
                                        y={below ? node.y + node.r + 20 : node.y - node.r - 12}
                                        textAnchor={node.x < LABEL_EDGE_MARGIN ? "start" : node.x > network.width - LABEL_EDGE_MARGIN ? "end" : "middle"}
                                        className="fill-text-primary stroke-page font-mono text-[10px] font-medium [paint-order:stroke]"
                                        strokeWidth={4}
                                        strokeLinejoin="round"
                                    >
                                        {t("figure.initialInfected")}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            <figcaption className="mt-3 flex flex-col gap-2 font-mono text-xs text-quaternary">
                <span>
                    <TextLink href={`#${SIMULATION_ANCHOR}`} tone="neutral" aria-label={t("figure.permalink")} className="no-underline hover:underline">
                        {t("figure.label")}
                    </TextLink>{" "}
                    — {t("figure.caption", { population: POPULATION })}
                </span>
                {/* Legend on its own row; the superspreader entry keeps its space when hidden so nothing shifts. */}
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {SERIES.filter((item) => item.key !== "d").map((item) => (
                        <li key={item.key} className="flex items-center gap-1.5">
                            <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                            {t(`figure.${item.label}`)}
                        </li>
                    ))}
                    <li className="flex items-center gap-1.5">
                        <svg aria-hidden="true" viewBox="0 0 8 8" className="size-2 overflow-visible">
                            <path d="M0 0L8 8M8 0L0 8" stroke="var(--color-sir-d)" strokeWidth="1.75" strokeLinecap="round" />
                        </svg>
                        {t("figure.died")}
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="size-2.5 rounded-full ring-[1.5px] ring-fg-primary" />
                        {t("figure.initialInfected")}
                    </li>
                    <li className={cx("flex items-center gap-1.5", !superspreaders && "invisible")} aria-hidden={!superspreaders}>
                        <span aria-hidden="true" className="size-2 rounded-full bg-sir-s ring-[1.5px] ring-sir-s/50 ring-offset-1 ring-offset-page" />
                        {t("figure.superspreader")}
                    </li>
                </ul>
            </figcaption>

            <Card padding="lg" className="mt-5">
                {/* Compact header: title with its explanation in a tooltip, live readouts on the right. */}
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                    <div className="flex items-center gap-1.5">
                        <Heading id="simulator-title" size="title" as="h2">
                            {t("simulator.title")}
                        </Heading>
                        <InfoTooltip label={t("simulator.infoLabel")} title={t("simulator.title")} description={t("simulator.description")} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <dl className="flex items-baseline gap-6 text-right">
                            <div className="flex items-baseline gap-2">
                                <dt>
                                    <Overline>{t("simulator.dayLabel")}</Overline>
                                </dt>
                                <dd className="min-w-[3ch] font-mono text-xl leading-none text-primary tabular-nums">{epidemic.day}</dd>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <dt>
                                    <Overline title={t("simulator.r0Description")}>{t("simulator.r0Label")}</Overline>
                                </dt>
                                {/* Four characters covers every two-significant-figure R₀: "0.13", "2.8", "13". */}
                                <dd className="min-w-[4ch] font-mono text-xl leading-none text-primary tabular-nums">{significant(r0)}</dd>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <dt>
                                    <Overline>{t("simulator.deathsLabel")}</Overline>
                                </dt>
                                {/* Deaths as a share of everyone ever infected, in brackets beside the count; an invisible "(0.00%)" reserves its width. */}
                                <dd className="flex items-baseline gap-1.5 font-mono tabular-nums">
                                    <span className="min-w-[3ch] text-xl leading-none text-primary">{deaths}</span>
                                    <span className="grid justify-items-start text-xs text-quaternary">
                                        <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
                                            (0.00%)
                                        </span>
                                        <span className="col-start-1 row-start-1 whitespace-nowrap">
                                            ({format.number(simulation.deathShare, PERCENT_FORMAT)})
                                            <span className="sr-only"> {t("simulator.deathShareLabel")}</span>
                                        </span>
                                    </span>
                                </dd>
                            </div>
                        </dl>
                        {/* Share sits in the header so it's easy to find. After copying, the tooltip stays open with "Link copied". */}
                        <Tooltip
                            title={clipboard.copied ? t("simulator.actions.shareCopied") : t("simulator.actions.shareHint")}
                            placement="top"
                            isOpen={shareTooltipOpen || Boolean(clipboard.copied)}
                            onOpenChange={setShareTooltipOpen}
                        >
                            <Button size="sm" color="secondary" iconLeading={clipboard.copied ? Check : Share07} onClick={share}>
                                {t("simulator.actions.share")}
                            </Button>
                        </Tooltip>
                        <span role="status" className="sr-only">
                            {clipboard.copied ? t("simulator.actions.shareCopied") : ""}
                        </span>
                    </div>
                </div>

                {/*
                 * One two-column grid, so the right column's border runs unbroken from Population to Parameters.
                 * Areas: phones stack presets → population → chart → parameters; desktop pairs them side by side.
                 */}
                <div className="mt-6 grid grid-cols-1 border-t border-secondary [grid-template-areas:'presets'_'population'_'chart'_'params'] lg:grid-cols-[1fr_18rem] lg:[grid-template-areas:'presets_population'_'chart_params']">
                    <div className="min-w-0 pt-4 [grid-area:presets] lg:pr-10">
                        <div className="mb-3 flex items-center gap-1">
                            <Overline>{t("simulator.presets.label")}</Overline>
                            <InfoTooltip
                                label={t("simulator.presets.infoLabel")}
                                title={t("simulator.presets.infoTitle")}
                                description={t("simulator.presets.infoDescription")}
                            />
                        </div>
                        <ChipGroup
                            aria-label={t("simulator.presets.label")}
                            size="sm"
                            value={preset?.id ?? "custom"}
                            onChange={(key) => simulation.choosePreset(key === "custom" ? null : (key as PresetId))}
                        >
                            {VISIBLE_PRESETS.map((item) => (
                                <Chip key={item.id} id={item.id}>
                                    {t(`simulator.presets.items.${item.id}`)}
                                </Chip>
                            ))}
                            <Chip id="custom">{t("simulator.presets.custom")}</Chip>
                        </ChipGroup>
                        {/* Fixed height (R₀ and infectious period, fatality, then caveat or ceiling note) so switching presets never moves the chart. */}
                        <div className="mt-3 min-h-36 sm:min-h-20" aria-live="polite">
                            {preset ? (
                                <>
                                    <p className="text-sm text-tertiary">
                                        {t("simulator.presets.line", {
                                            r0: t(`simulator.presets.details.${preset.id}.r0`),
                                            infectious: t(`simulator.presets.details.${preset.id}.infectious`),
                                        })}
                                        <SourceMarkers sources={[preset.sources.r0, preset.sources.recovery, preset.sources.death]} onOpen={openSources} />
                                    </p>
                                    <p className="text-sm text-tertiary">
                                        {t("simulator.presets.fatality", { fatality: t(`simulator.presets.details.${preset.id}.fatality`) })}
                                        <SourceMarkers sources={[preset.sources.fatality]} onOpen={openSources} />
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-tertiary">{t("simulator.presets.customSummary")}</p>
                            )}
                            <p className={cx("mt-0.5 text-xs", preset && maxR0 < preset.r0 * 0.97 ? "text-secondary" : "text-quaternary")}>
                                {preset && maxR0 < preset.r0 * 0.97
                                    ? t("simulator.presets.capped", { max: significant(maxR0) })
                                    : preset
                                      ? hasOutcomeSpecificPeriods(preset)
                                          ? t("simulator.presets.caveat")
                                          : t("simulator.presets.sharedPeriodCaveat")
                                      : t("simulator.presets.customCaveat")}
                            </p>
                        </div>
                    </div>

                    {/* Population age, for presets with published age data. Without it the content is hidden but keeps its space (and the border stays). */}
                    <div className="mt-5 border-t border-secondary pt-4 [grid-area:population] lg:mt-0 lg:border-t-0 lg:border-l lg:pl-10">
                        <div aria-hidden={!preset?.ageProfile} className={cx(!preset?.ageProfile && "invisible")}>
                            <div className="mb-3 flex items-center gap-1">
                                <Overline>{t("simulator.populations.label")}</Overline>
                                <InfoTooltip
                                    label={t("simulator.populations.infoLabel")}
                                    title={t("simulator.populations.infoTitle")}
                                    description={
                                        preset?.ageProfile?.profile === FLU_AGE_PROFILE
                                            ? t("simulator.populations.infoDescription.flu", { cdc: sourceNumber(FLU_AGE_PROFILE.source) })
                                            : t("simulator.populations.infoDescription.covid", {
                                                  forecasting: sourceNumber("covid-forecasting-2022"),
                                                  levin: sourceNumber(COVID_AGE_PROFILE.source),
                                                  liu: sourceNumber("liu-ijid-2022"),
                                              })
                                    }
                                />
                            </div>
                            <ChipGroup
                                aria-label={t("simulator.populations.groupLabel")}
                                size="sm"
                                value={simulation.populationId}
                                isDisabled={!preset?.ageProfile}
                                onChange={(key) => simulation.choosePopulation(key as PopulationId)}
                            >
                                {POPULATION_IDS.map((id) => (
                                    <Chip key={id} id={id}>
                                        {t(`simulator.populations.items.${id}`)}
                                    </Chip>
                                ))}
                            </ChipGroup>
                            {/* Fixed height: switching presets or ages never moves the parameters below. */}
                            <div className="mt-3 min-h-10" aria-live="polite">
                                <p className="text-sm text-tertiary">
                                    <PopulationSummary preset={preset} ageGroup={simulation.ageGroup} onOpenSources={openSources} />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 min-w-0 border-t border-secondary pt-5 pb-5 [grid-area:chart] lg:mt-0 lg:border-t-0 lg:pr-10">
                        <EpidemicChart history={epidemic.history} theory={theory} population={population} minDays={chartDays} height={CHART_HEIGHT} />

                        <div className="mt-3 flex flex-col gap-1.5 font-mono text-xs text-quaternary">
                            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <li className="flex items-center gap-1.5">
                                    <svg aria-hidden="true" width="16" height="2" className="text-fg-tertiary">
                                        <line x1="0" x2="16" y1="1" y2="1" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    {t("simulator.theory.legend")}
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <svg aria-hidden="true" width="16" height="2" className="text-fg-quaternary">
                                        <line x1="0" x2="16" y1="1" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                                    </svg>
                                    {t("simulator.theory.dashed")}
                                </li>
                            </ul>
                            {/* Reserved height: the summary grows as the run goes on, but nothing below it moves. */}
                            <p aria-live="polite" className="min-h-9 sm:min-h-[18px]">
                                {peak.count > 0 && t("simulator.summary.peak", { count: peak.count, day: peak.day })}
                                {finished && peak.count > 0 && (
                                    <>
                                        {" · "}
                                        {t("simulator.summary.everInfected", { percent: format.number(everInfected, PERCENT_FORMAT) })}
                                        {" · "}
                                        {t("simulator.summary.deaths", { count: deaths })}
                                    </>
                                )}
                            </p>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-secondary pt-4">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    iconLeading={playing ? PauseCircle : Play}
                                    onClick={simulation.togglePlay}
                                    isDisabled={!playing && !canPlay}
                                    className="min-w-24"
                                >
                                    {playing ? t("simulator.actions.pause") : t("simulator.actions.play")}
                                </Button>
                                <Button size="sm" color="secondary" iconLeading={FlipBackward} onClick={simulation.reset} isDisabled={editable}>
                                    {t("simulator.actions.reset")}
                                </Button>
                                {/* The seed lives in the button's tooltip: it is what "New network" re-rolls. */}
                                <Tooltip title={t("simulator.seed", { seed: simulation.seed })} description={t("simulator.seedDescription")} placement="top">
                                    <Button size="sm" color="tertiary" iconLeading={Shuffle01} onClick={simulation.newNetwork}>
                                        {t("simulator.actions.newNetwork")}
                                    </Button>
                                </Tooltip>
                            </div>
                            <Toggle size="sm" label={t("simulator.actions.autoRun")} isSelected={simulation.autoRun} onChange={simulation.setAutoRun} />
                            <p className={cx("text-xs text-quaternary", !editable && "invisible")}>{t("simulator.setupHint")}</p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3.5 border-t border-secondary pt-5 pb-5 [grid-area:params] lg:mt-0 lg:border-t-0 lg:border-l lg:pl-10">
                        <Overline>{t("simulator.controls.label")}</Overline>
                        <Slider
                            label={t("simulator.controls.beta")}
                            minValue={MIN_BETA}
                            maxValue={MAX_BETA}
                            step={BETA_STEP}
                            value={beta}
                            onChange={(value) => simulation.setParam("beta", value)}
                            formatOptions={PERCENT_FORMAT}
                        />
                        {/* One setting split by outcome: each row in its compartment's colour, with the legend's key. */}
                        <SliderGroup label={t("simulator.controls.infectiousPeriod")}>
                            <Slider
                                layout="inline"
                                label={t("simulator.controls.recovers")}
                                labelSuffix={t("simulator.controls.recoveryDays")}
                                labelIcon={<span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-sir-r" />}
                                color="var(--color-sir-r)"
                                minValue={MIN_INFECTIOUS_DAYS}
                                maxValue={MAX_INFECTIOUS_DAYS}
                                step={INFECTIOUS_DAYS_STEP}
                                value={params.recoveryDays}
                                onChange={(value) => simulation.setParam("recoveryDays", value)}
                                formatOptions={DAYS_FORMAT}
                            />
                            <Slider
                                layout="inline"
                                label={t("simulator.controls.dies")}
                                labelSuffix={t("simulator.controls.deathDays")}
                                labelIcon={
                                    <svg aria-hidden="true" viewBox="0 0 8 8" className="size-2 shrink-0 overflow-visible">
                                        <path d="M0 0L8 8M8 0L0 8" stroke="var(--color-sir-d)" strokeWidth="1.75" strokeLinecap="round" />
                                    </svg>
                                }
                                color="var(--color-sir-d)"
                                minValue={MIN_INFECTIOUS_DAYS}
                                maxValue={MAX_INFECTIOUS_DAYS}
                                step={INFECTIOUS_DAYS_STEP}
                                value={params.deathDays}
                                onChange={(value) => simulation.setParam("deathDays", value)}
                                formatOptions={DAYS_FORMAT}
                            />
                        </SliderGroup>
                        <Slider
                            label={t("simulator.controls.ifr")}
                            minValue={MIN_IFR}
                            maxValue={MAX_IFR}
                            step={IFR_STEP}
                            value={params.ifr}
                            onChange={(value) => simulation.setParam("ifr", value)}
                            formatOptions={PERCENT_FORMAT}
                        />
                        <Slider
                            label={t("simulator.controls.contacts")}
                            minValue={MIN_CONTACTS}
                            maxValue={MAX_CONTACTS}
                            step={1}
                            value={params.contacts}
                            onChange={(value) => simulation.setParam("contacts", value)}
                        />
                        <Slider
                            label={t("simulator.controls.initialCases")}
                            minValue={MIN_INITIAL_CASES}
                            maxValue={MAX_INITIAL_CASES}
                            step={1}
                            value={params.initialCases}
                            onChange={(value) => simulation.setParam("initialCases", value)}
                        />

                        <div className="mt-1 flex items-center gap-1.5">
                            <Toggle
                                size="sm"
                                label={t("simulator.controls.superspreaders")}
                                isSelected={superspreaders}
                                onChange={simulation.setSuperspreaders}
                            />
                            <InfoTooltip
                                label={t("simulator.controls.superspreadersInfoLabel")}
                                title={t("simulator.controls.superspreaders")}
                                description={t("simulator.controls.superspreadersInfo", { source: sourceNumber(SUPERSPREADING_SOURCE) })}
                            />
                        </div>
                    </div>
                </div>

                {/* Reference list for the preset numbers. Below everything else, so opening it never moves the controls. */}
                <details ref={sourcesRef} className="group/sources border-t border-secondary pt-4">
                    <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-xs font-mono text-xs tracking-[0.08em] text-quaternary uppercase outline-focus-ring hover:text-tertiary focus-visible:outline-2">
                        <ChevronRight aria-hidden="true" className="size-3.5 transition-transform group-open/sources:rotate-90" />
                        {t("simulator.presets.sources.label")}
                    </summary>
                    <ol className="mt-3 flex flex-col gap-2 text-xs text-tertiary">
                        {SOURCE_ORDER.map((id) => {
                            const source = PRESET_SOURCES[id];
                            return (
                                <li key={id} id={`preset-source-${id}`} className="flex gap-2 rounded-md target:bg-brand-primary">
                                    <span className="w-6 shrink-0 font-mono text-quaternary">[{sourceNumber(id)}]</span>
                                    <span>
                                        {withPeriod(source.authors)}{" "}
                                        <a
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-xs text-secondary underline decoration-neutral-300 underline-offset-2 outline-focus-ring hover:text-primary hover:decoration-current focus-visible:outline-2 dark:decoration-neutral-700"
                                        >
                                            {source.title}
                                            <span className="sr-only"> {t("simulator.presets.sources.opensInNewTab")}</span>
                                        </a>
                                        . <span className="italic">{source.venue}</span>. {source.details}.
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </details>
            </Card>
        </figure>
    );
};
