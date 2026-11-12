import { Mail01 } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import { CopyButton } from "@/components/base/copy-button/copy-button";
import { PROFILE } from "@/content/profile";
import { cx } from "@/utils/cx";

/** The email address as a mailto link with a copy action beside it. */
export const EmailPill = ({ className }: { className?: string }) => {
    const t = useTranslations("common");

    return (
        <div
            className={cx(
                "inline-flex max-w-full items-center gap-1 rounded-lg bg-surface py-1 pr-1 pl-3 shadow-xs ring-1 ring-secondary ring-inset",
                className,
            )}
        >
            <Mail01 aria-hidden="true" className="size-4 shrink-0 text-fg-quaternary" />
            <a
                href={`mailto:${PROFILE.email}`}
                className="truncate rounded-xs px-1 text-sm font-medium text-secondary outline-focus-ring hover:text-primary focus-visible:outline-2"
            >
                {PROFILE.email}
            </a>
            <CopyButton value={PROFILE.email} label={t("copyEmail")} size="xs" />
        </div>
    );
};
