import type { ReactNode } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { IconTile } from "@/components/base/icon-tile/icon-tile";

interface EmptyStateProps {
    icon: PhosphorIcon;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
}

/** Says what's missing and offers the next step. */
export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-primary px-6 py-12 text-center">
        <IconTile icon={icon} color="gray" />
        <p className="mt-4 text-md font-semibold text-primary">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-tertiary">{description}</p>}
        {action && <div className="mt-5">{action}</div>}
    </div>
);
