import { Check, Copy01 } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { useClipboard } from "@/hooks/use-clipboard";

interface CopyButtonProps {
    /** Text written to the clipboard. */
    value: string;
    /** Tooltip and accessible name before copying. Defaults to "Copy". */
    label?: string;
    /** Tooltip and announcement after copying. Defaults to "Copied". */
    copiedLabel?: string;
    size?: "xs" | "sm";
    color?: "secondary" | "tertiary";
    className?: string;
}

/** Icon-only copy action with a tooltip and a polite screen-reader announcement. */
export const CopyButton = ({ value, label, copiedLabel, size = "sm", color = "tertiary", className }: CopyButtonProps) => {
    const t = useTranslations("common");
    const { copied, copy } = useClipboard();
    const doneLabel = copiedLabel ?? t("copied");

    return (
        <>
            <ButtonUtility
                size={size}
                color={color}
                className={className}
                icon={copied ? Check : Copy01}
                tooltip={copied ? doneLabel : (label ?? t("copy"))}
                onClick={() => copy(value)}
            />
            <span role="status" className="sr-only">
                {copied ? doneLabel : ""}
            </span>
        </>
    );
};
