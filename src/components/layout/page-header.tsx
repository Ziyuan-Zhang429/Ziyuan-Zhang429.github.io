import type { ReactNode } from "react";
import { Heading, Overline } from "@/components/base/heading/heading";

interface PageHeaderProps {
    eyebrow: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
}

export const PageHeader = ({ eyebrow, title, description, children }: PageHeaderProps) => (
    <header className="animate-fade-up pt-12 pb-10 md:pt-20 md:pb-14">
        <Overline tone="brand" rule>
            {eyebrow}
        </Overline>
        <Heading size="page" className="mt-4">
            {title}
        </Heading>
        {description && <p className="mt-5 max-w-2xl text-lg text-pretty text-tertiary">{description}</p>}
        {children && <div className="mt-10">{children}</div>}
    </header>
);
