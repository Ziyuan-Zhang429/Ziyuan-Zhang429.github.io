import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@untitledui/icons";
import type { LinkProps as AriaLinkProps } from "react-aria-components";
import { Link as AriaLink } from "react-aria-components";
import { useTranslations } from "use-intl";
import { cx, sortCx } from "@/utils/cx";

const STYLES = sortCx({
    common: [
        "group/link inline-flex items-center gap-1 rounded-xs font-medium outline-focus-ring transition duration-100 ease-linear",
        "underline decoration-1 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
    ].join(" "),
    tones: {
        brand: "text-brand-secondary decoration-brand-300 hover:text-brand-secondary_hover hover:decoration-current dark:decoration-brand-700",
        neutral: "text-secondary decoration-neutral-300 hover:text-primary hover:decoration-current dark:decoration-neutral-700",
    },
    icon: "size-4 shrink-0 transition-transform duration-150 ease-out",
});

interface TextLinkProps extends Omit<AriaLinkProps, "className" | "children"> {
    href: string;
    children: ReactNode;
    tone?: keyof typeof STYLES.tones;
    /** Opens in a new tab and shows an up-right arrow. Defaults to true for http(s) links. */
    external?: boolean;
    /** Shows a trailing right arrow for internal "go to" links. */
    arrow?: boolean;
    className?: string;
}

/** Inline link. Internal hrefs navigate client-side; external ones open in a new tab and say so to screen readers. */
export const TextLink = ({ href, children, tone = "brand", external, arrow, className, ...props }: TextLinkProps) => {
    const t = useTranslations("common");
    const isExternal = external ?? /^https?:\/\//.test(href);

    return (
        <AriaLink
            {...props}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={cx(STYLES.common, STYLES.tones[tone], className)}
        >
            {children}
            {isExternal && (
                <>
                    <ArrowUpRight aria-hidden="true" className={cx(STYLES.icon, "group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5")} />
                    <span className="sr-only">{t("opensInNewTab")}</span>
                </>
            )}
            {!isExternal && arrow && <ArrowRight aria-hidden="true" className={cx(STYLES.icon, "group-hover/link:translate-x-0.5")} />}
        </AriaLink>
    );
};
