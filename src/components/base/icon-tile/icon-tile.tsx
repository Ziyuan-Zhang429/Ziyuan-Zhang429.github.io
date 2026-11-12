import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { cx, sortCx } from "@/utils/cx";

const STYLES = sortCx({
    common: "inline-flex shrink-0 items-center justify-center ring-1 ring-inset",
    sizes: {
        sm: { root: "size-9 rounded-lg", icon: "size-5" },
        md: { root: "size-11 rounded-xl", icon: "size-6" },
        lg: { root: "size-14 rounded-2xl", icon: "size-7" },
    },
    colors: {
        brand: "bg-brand-primary text-fg-brand-primary ring-brand-600/10 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-400/15",
        gray: "bg-surface-muted text-fg-tertiary ring-secondary",
    },
});

interface IconTileProps {
    /** A Phosphor icon; rendered in the duotone weight. */
    icon: PhosphorIcon;
    size?: keyof typeof STYLES.sizes;
    color?: keyof typeof STYLES.colors;
    className?: string;
}

/** Subject-matter glyph on a tinted tile. Decorative: the adjacent text carries the meaning. */
export const IconTile = ({ icon: Icon, size = "md", color = "brand", className }: IconTileProps) => (
    <span aria-hidden="true" className={cx(STYLES.common, STYLES.sizes[size].root, STYLES.colors[color], className)}>
        <Icon weight="duotone" className={STYLES.sizes[size].icon} />
    </span>
);
