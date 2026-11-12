import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx, sortCx } from "@/utils/cx";

export const HEADING_STYLES = sortCx({
    /** Hero name. One per page at most. */
    display: "font-serif text-[3.5rem] leading-[0.95] tracking-[-0.02em] text-primary sm:text-7xl lg:text-8xl",
    /** Page title (h1) on interior pages. */
    page: "font-serif text-[2.75rem] leading-[1.05] tracking-[-0.01em] text-primary md:text-7xl",
    /** Section title (h2). */
    section: "font-serif text-3xl leading-tight text-primary md:text-4xl",
    /** Card and list-item titles. Sans, for scanning. */
    title: "text-lg leading-snug font-semibold text-pretty text-primary",
    /** Small titles inside dense lists. */
    subtitle: "text-md leading-snug font-semibold text-primary",
});

type HeadingSize = keyof typeof HEADING_STYLES;

const DEFAULT_ELEMENT: Record<HeadingSize, ElementType> = {
    display: "h1",
    page: "h1",
    section: "h2",
    title: "h3",
    subtitle: "h4",
};

type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
    size?: HeadingSize;
    /** Override the rendered element to keep the document outline correct. */
    as?: "h1" | "h2" | "h3" | "h4" | "p";
};

export const Heading = ({ size = "section", as, className, ...props }: HeadingProps) => {
    const Component = as ?? DEFAULT_ELEMENT[size];
    return <Component {...props} className={cx(HEADING_STYLES[size], className)} />;
};

const OVERLINE_STYLES = sortCx({
    common: "flex items-center gap-3 font-mono text-xs tracking-[0.08em] uppercase",
    tones: {
        quaternary: "text-quaternary",
        brand: "text-brand-secondary",
    },
});

type OverlineProps = ComponentPropsWithoutRef<"p"> & {
    tone?: keyof typeof OVERLINE_STYLES.tones;
    /** Draws a short rule before the label. */
    rule?: boolean;
};

/** Monospaced uppercase label for eyebrows, dates, venues and indices. */
export const Overline = ({ tone = "quaternary", rule, className, children, ...props }: OverlineProps) => (
    <p {...props} className={cx(OVERLINE_STYLES.common, OVERLINE_STYLES.tones[tone], className)}>
        {rule && <span className="h-px w-6 shrink-0 bg-current" aria-hidden="true" />}
        {children}
    </p>
);
