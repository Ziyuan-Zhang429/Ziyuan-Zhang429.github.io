import type { ReactNode } from "react";
import { Overline } from "@/components/base/heading/heading";
import { cx } from "@/utils/cx";

/** Vertical timeline with a hairline rail. Items are ordered newest first. */
export const Timeline = ({ children, className }: { children: ReactNode; className?: string }) => (
    <ol
        className={cx(
            "relative flex flex-col gap-8 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border-secondary",
            className,
        )}
    >
        {children}
    </ol>
);

interface TimelineItemProps {
    meta: ReactNode;
    title: ReactNode;
    children?: ReactNode;
    /** Fills the marker to flag an ongoing or upcoming entry. */
    current?: boolean;
}

const TimelineItem = ({ meta, title, children, current }: TimelineItemProps) => (
    <li className="relative pl-8">
        <span
            aria-hidden="true"
            className={cx("absolute top-1 left-0 size-[11px] rounded-full ring-4 ring-page", current ? "bg-brand-solid" : "border-2 border-brand bg-page")}
        />
        <Overline>{meta}</Overline>
        <div className="mt-1.5 text-md font-semibold text-primary">{title}</div>
        {children && <div className="mt-1 text-sm text-tertiary">{children}</div>}
    </li>
);

Timeline.Item = TimelineItem;
