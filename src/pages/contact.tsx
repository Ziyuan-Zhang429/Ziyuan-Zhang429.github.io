import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { Mail01 } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import { Button } from "@/components/base/buttons/button";
import { Card } from "@/components/base/card/card";
import { CopyButton } from "@/components/base/copy-button/copy-button";
import { Overline } from "@/components/base/heading/heading";
import { IconTile } from "@/components/base/icon-tile/icon-tile";
import { StatusBadge } from "@/components/base/tag/tag";
import { PageHeader } from "@/components/layout/page-header";
import { PageMeta } from "@/components/layout/page-meta";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/patterns/cta-banner";
import { AFFILIATIONS, PROFILE } from "@/content/profile";

export const ContactPage = () => {
    const t = useTranslations();

    return (
        <>
            <PageMeta title={t("contact.title")} description={t("contact.description")} />
            <PageHeader eyebrow={t("contact.eyebrow")} title={t("contact.heading")} description={t("contact.description")} />

            <Section id="reach" title={t("contact.sections.reach")}>
                <Card className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <IconTile icon={EnvelopeSimpleIcon} />
                    <div className="min-w-0 flex-1">
                        <Overline>{t("contact.email.label")}</Overline>
                        <p className="mt-1.5 flex items-center gap-1 text-lg font-semibold break-all text-primary">
                            {PROFILE.email}
                            <CopyButton value={PROFILE.email} label={t("common.copyEmail")} size="xs" />
                        </p>
                        <p className="mt-0.5 text-sm text-tertiary">{t("contact.email.hint")}</p>
                    </div>
                    <Button href={`mailto:${PROFILE.email}`} size="md" iconLeading={Mail01} className="self-start sm:self-center">
                        {t("common.sendEmail")}
                    </Button>
                </Card>
            </Section>

            <Section id="affiliations" title={t("contact.sections.affiliations")}>
                <ul className="divide-y divide-secondary overflow-hidden rounded-2xl bg-surface ring-1 ring-secondary">
                    {AFFILIATIONS.map((affiliation) => (
                        <li key={affiliation.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
                            <div>
                                <p className="text-md font-semibold text-primary">{t(`affiliations.items.${affiliation.id}.name`)}</p>
                                <p className="mt-0.5 text-sm text-tertiary">{t(`affiliations.items.${affiliation.id}.role`)}</p>
                            </div>
                            <StatusBadge status={affiliation.status}>{t(`affiliations.status.${affiliation.status}`)}</StatusBadge>
                        </li>
                    ))}
                </ul>
            </Section>

            <CtaBanner />
        </>
    );
};
