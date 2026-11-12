import type { ReactNode } from "react";
import { Badge } from "@/components/base/badges/badges";
import type { AffiliationStatus } from "@/content/types";

/** Neutral keyword label (topics, methods, tools). */
export const Tag = ({ children, className }: { children: ReactNode; className?: string }) => (
    <Badge type="modern" size="sm" color="gray" className={className}>
        {children}
    </Badge>
);

export const TagList = ({ children, className }: { children: ReactNode; className?: string }) => (
    <ul className={className ?? "flex flex-wrap gap-1.5"}>{children}</ul>
);

const STATUS_COLORS = {
    primary: "brand",
    active: "success",
    alumnus: "purple",
    prior: "gray",
} as const satisfies Record<AffiliationStatus, string>;

/** Status pill. The label always carries the meaning; color only reinforces it. */
export const StatusBadge = ({ status, children }: { status: AffiliationStatus; children: ReactNode }) => (
    <Badge type="pill-color" size="sm" color={STATUS_COLORS[status]}>
        {children}
    </Badge>
);

/** Emphasis badge for highlights such as "First author". */
export const HighlightBadge = ({ children }: { children: ReactNode }) => (
    <Badge type="pill-color" size="sm" color="brand">
        {children}
    </Badge>
);
