import type { ComponentPropsWithoutRef } from "react";
import type { LinkProps as AriaLinkProps } from "react-aria-components";
import { Link as AriaLink } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";

export const CARD_STYLES = sortCx({
    common: "block rounded-2xl bg-surface ring-1 ring-secondary",
    padding: {
        none: "",
        sm: "p-4",
        md: "p-5 md:p-6",
        lg: "p-6 md:p-8",
    },
    interactive: [
        "group/card cursor-pointer outline-focus-ring transition duration-150 ease-out",
        "hover:shadow-md hover:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2",
    ].join(" "),
});

type Padding = keyof typeof CARD_STYLES.padding;

type CardProps = ComponentPropsWithoutRef<"div"> & { padding?: Padding };

/** Raised surface. Separates content with a hairline ring, not a shadow. */
export const Card = ({ padding = "md", className, ...props }: CardProps) => (
    <div {...props} className={cx(CARD_STYLES.common, CARD_STYLES.padding[padding], className)} />
);

type CardLinkProps = Omit<AriaLinkProps, "className"> & { href: string; padding?: Padding; className?: string };

/** A whole-card link. Internal hrefs navigate client-side through the React Aria router provider. */
export const CardLink = ({ padding = "md", className, ...props }: CardLinkProps) => (
    <AriaLink {...props} className={cx(CARD_STYLES.common, CARD_STYLES.padding[padding], CARD_STYLES.interactive, className)} />
);
