import { cx } from "@/utils/cx";

/**
 * The mark: a Z traced as a tiny contact network. Four people joined by three links; the first (top left) is solid,
 * the index case, and the rest are rings, echoing how the simulator marks the initial infected.
 * `public/favicon.svg` draws the same geometry, so keep the two in step.
 */
const LINKS = "M9 10H23L9 22H23";
const INDEX_CASE = { cx: 9, cy: 10 };
const CONTACTS = [
    { cx: 23, cy: 10 },
    { cx: 9, cy: 22 },
    { cx: 23, cy: 22 },
];
/** Rings and the solid index case share one outer radius (2.5 + half the 1.6 stroke). */
const RING_RADIUS = 2.5;
const RING_STROKE = 1.6;

/** Network-Z mark on a brand tile. Decorative: always pair it with the name as text. */
export const LogoMark = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cx("size-8 shrink-0 drop-shadow-xs", className)}>
        <rect width="32" height="32" rx="8" className="fill-bg-brand-solid" />
        <path d={LINKS} fill="none" stroke="white" strokeWidth={1.8} strokeLinejoin="round" />
        {CONTACTS.map((node) => (
            // Filled with the tile colour so the links stop at the ring.
            <circle key={`${node.cx}-${node.cy}`} {...node} r={RING_RADIUS} strokeWidth={RING_STROKE} stroke="white" className="fill-bg-brand-solid" />
        ))}
        <circle {...INDEX_CASE} r={RING_RADIUS + RING_STROKE / 2} fill="white" />
    </svg>
);
