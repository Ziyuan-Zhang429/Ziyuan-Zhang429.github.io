import type { CSSProperties, ReactNode } from "react";
import type { SliderProps as AriaSliderProps } from "react-aria-components";
import {
    Label as AriaLabel,
    Slider as AriaSlider,
    SliderOutput as AriaSliderOutput,
    SliderThumb as AriaSliderThumb,
    SliderTrack as AriaSliderTrack,
    useLocale,
} from "react-aria-components";
import { cx } from "@/utils/cx";

interface SliderProps extends Omit<AriaSliderProps<number>, "children" | "className"> {
    label: string;
    /** Read by screen readers after the visible label, e.g. the full name of a short inline label. */
    labelSuffix?: string;
    /** A small glyph before the label (e.g. a legend key). */
    labelIcon?: ReactNode;
    /**
     * `stacked`: label and value above the track (default).
     * `inline`: label, track and value on one row, for compact groups such as `SliderGroup`.
     */
    layout?: "stacked" | "inline";
    /** Fill and handle color (any CSS color). Defaults to the brand color. */
    color?: string;
    className?: string;
}

/**
 * Single-thumb slider. Pass `formatOptions` (Intl.NumberFormat options, e.g. `{ style: "unit", unit: "day" }`)
 * for locale-aware values. Adapted from Untitled UI's slider: same track and handle tokens, compact size.
 *
 * The value slot is sized to the widest value the slider can show, so dragging never re-wraps the label.
 */
export const Slider = ({
    label,
    labelSuffix,
    labelIcon,
    layout = "stacked",
    color,
    minValue = 0,
    maxValue = 100,
    formatOptions,
    className,
    ...props
}: SliderProps) => {
    const { locale } = useLocale();
    // The ends plus one step in from each end, so fractional values ("0.01%", "9.99%") are covered too.
    const formatter = new Intl.NumberFormat(locale, formatOptions);
    const step = props.step ?? 1;
    const widestValue = [minValue, maxValue, minValue + step, maxValue - step]
        .map((value) => formatter.format(value))
        .reduce((widest, text) => (text.length > widest.length ? text : widest));

    const accent = { "--slider-accent": color ?? "var(--color-bg-brand-solid)" } as CSSProperties;

    const labelElement = (
        <AriaLabel className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-secondary">
            {labelIcon}
            <span>{label}</span>
            {labelSuffix && <span className="sr-only"> {labelSuffix}</span>}
        </AriaLabel>
    );

    const valueElement = (
        // An invisible copy of the widest value reserves the slot; the live value sits on top of it.
        <span className="grid shrink-0 justify-items-end font-mono text-xs text-tertiary tabular-nums">
            <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
                {widestValue}
            </span>
            <AriaSliderOutput className="col-start-1 row-start-1 whitespace-nowrap">{({ state }) => state.getThumbValueLabel(0)}</AriaSliderOutput>
        </span>
    );

    const trackElement = (
        <AriaSliderTrack className="relative h-5 w-full min-w-0 cursor-pointer">
            {({ state }) => (
                <>
                    <span className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-quaternary" />
                    <span
                        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-(--slider-accent)"
                        style={{ width: `${state.getThumbPercent(0) * 100}%` }}
                    />
                    <AriaSliderThumb
                        index={0}
                        className={({ isFocusVisible, isDragging }) =>
                            cx(
                                // One handle in both modes: the surface colour outlined in exactly the fill colour, so the two always match.
                                "top-1/2 box-border size-4.5 cursor-grab rounded-full bg-surface shadow-md ring-2 ring-(--slider-accent) transition-transform duration-100 ring-inset",
                                isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                                isDragging && "scale-110 cursor-grabbing",
                            )
                        }
                    />
                </>
            )}
        </AriaSliderTrack>
    );

    return (
        <AriaSlider
            {...props}
            minValue={minValue}
            maxValue={maxValue}
            formatOptions={formatOptions}
            style={accent}
            className={cx(layout === "inline" ? "grid grid-cols-[5.5rem_1fr_auto] items-center gap-3" : "flex flex-col gap-1.5", className)}
        >
            {layout === "inline" ? (
                <>
                    {labelElement}
                    {trackElement}
                    {valueElement}
                </>
            ) : (
                <>
                    <div className="flex items-baseline justify-between gap-3">
                        {labelElement}
                        {valueElement}
                    </div>
                    {trackElement}
                </>
            )}
        </AriaSlider>
    );
};

/** A heading over related inline sliders, e.g. one setting split by outcome. */
export const SliderGroup = ({ label, children, className }: { label: string; children: ReactNode; className?: string }) => (
    <div role="group" aria-label={label} className={cx("flex flex-col gap-1", className)}>
        <p aria-hidden="true" className="text-sm font-medium text-secondary">
            {label}
        </p>
        <div className="flex flex-col gap-0.5">{children}</div>
    </div>
);
