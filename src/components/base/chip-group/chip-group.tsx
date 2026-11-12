import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { ToggleButtonGroupProps as AriaToggleButtonGroupProps, ToggleButtonProps as AriaToggleButtonProps, Key } from "react-aria-components";
import { ToggleButton as AriaToggleButton, ToggleButtonGroup as AriaToggleButtonGroup } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";

const STYLES = sortCx({
    common: {
        root: [
            "inline-flex cursor-pointer items-center rounded-full font-medium whitespace-nowrap ring-1 outline-focus-ring transition duration-100 ease-linear ring-inset",
            "bg-surface text-secondary ring-secondary hover:bg-primary_hover hover:text-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "selected:bg-brand-solid selected:text-white selected:ring-transparent selected:hover:bg-brand-solid_hover",
            "disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" "),
        count: "rounded-full bg-surface-muted px-1.5 font-mono text-[11px] leading-5 text-tertiary tabular-nums transition-inherit-all group-selected/chip:bg-white/20 group-selected/chip:text-white",
    },
    sizes: {
        sm: "gap-1.5 px-3 py-1 text-xs",
        md: "gap-2 px-3.5 py-1.5 text-sm",
    },
});

type ChipSize = keyof typeof STYLES.sizes;

const ChipGroupContext = createContext<{ size: ChipSize }>({ size: "md" });

interface ChipGroupProps extends Omit<AriaToggleButtonGroupProps, "selectionMode" | "selectedKeys" | "onSelectionChange" | "className"> {
    /** The selected chip id. */
    value: Key;
    onChange: (value: Key) => void;
    size?: ChipSize;
    className?: string;
    /** Accessible name for the group, e.g. "Filter by research area". */
    "aria-label": string;
}

/** Single-select filter chips (a React Aria toggle-button group; arrow keys move between chips). */
export const ChipGroup = ({ value, onChange, size = "md", className, ...props }: ChipGroupProps) => (
    <ChipGroupContext.Provider value={{ size }}>
        <AriaToggleButtonGroup
            {...props}
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([value])}
            onSelectionChange={(keys) => {
                const [next] = keys;
                if (next !== undefined) onChange(next);
            }}
            className={cx("flex flex-wrap gap-2", className)}
        />
    </ChipGroupContext.Provider>
);

interface ChipProps extends Omit<AriaToggleButtonProps, "children" | "className" | "id"> {
    id: Key;
    children: ReactNode;
    /** Optional count shown after the label. */
    count?: number;
    className?: string;
}

export const Chip = ({ children, count, className, ...props }: ChipProps) => {
    const { size } = useContext(ChipGroupContext);

    return (
        <AriaToggleButton {...props} className={cx("group/chip", STYLES.common.root, STYLES.sizes[size], className)}>
            {children}
            {count !== undefined && <span className={STYLES.common.count}>{count}</span>}
        </AriaToggleButton>
    );
};
