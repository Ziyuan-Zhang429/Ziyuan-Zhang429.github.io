import type { ReactNode } from "react";
import { useState } from "react";
import { InfoCircle } from "@untitledui/icons";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

interface InfoTooltipProps {
    /** Accessible name of the trigger, e.g. "About superspreaders". */
    label: string;
    title: ReactNode;
    description: ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    className?: string;
}

/**
 * An (i) icon that explains the control beside it. Opens on hover and keyboard focus like any tooltip,
 * and on tap for touch screens. Tooltips can't hold links, so cite sources by their reference number.
 */
export const InfoTooltip = ({ label, title, description, placement = "top", className }: InfoTooltipProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Tooltip title={title} description={description} placement={placement} isOpen={open} onOpenChange={setOpen}>
            <TooltipTrigger
                aria-label={label}
                onPress={() => setOpen((current) => !current)}
                className={cx(
                    "rounded-full p-0.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary_hover focus-visible:outline-2",
                    className,
                )}
            >
                <InfoCircle aria-hidden="true" className="size-4" />
            </TooltipTrigger>
        </Tooltip>
    );
};
