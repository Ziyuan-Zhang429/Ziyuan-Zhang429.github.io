import type { ReactNode } from "react";
import { Heading, Overline } from "@/components/base/heading/heading";
import { cx } from "@/utils/cx";

interface SectionProps {
    id: string;
    title: ReactNode;
    /** Short index shown above the title, e.g. "01". */
    index?: string;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
    children: ReactNode;
}

/**
 * Editorial two-column section: a sticky heading rail on large screens,
 * stacked heading + content on small screens.
 */
export const Section = ({ id, title, index, description, action, className, children }: SectionProps) => (
    <section
        id={id}
        aria-labelledby={`${id}-title`}
        className={cx("grid gap-6 border-t border-secondary py-12 md:py-16 lg:grid-cols-[13rem_1fr] lg:gap-12", className)}
    >
        <div className="lg:sticky lg:top-24 lg:self-start">
            {index && <Overline className="mb-2">{index}</Overline>}
            <Heading id={`${id}-title`} size="section">
                {title}
            </Heading>
            {description && <p className="mt-2 text-sm text-tertiary">{description}</p>}
            {action && <div className="mt-4 hidden lg:block">{action}</div>}
        </div>
        <div className="min-w-0">
            {children}
            {action && <div className="mt-6 lg:hidden">{action}</div>}
        </div>
    </section>
);
