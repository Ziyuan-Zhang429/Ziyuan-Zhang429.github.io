import { useTranslations } from "use-intl";
import { Card } from "@/components/base/card/card";
import { Heading, Overline } from "@/components/base/heading/heading";
import { IconTile } from "@/components/base/icon-tile/icon-tile";
import { HighlightBadge } from "@/components/base/tag/tag";
import { PageHeader } from "@/components/layout/page-header";
import { PageMeta } from "@/components/layout/page-meta";
import { Section } from "@/components/layout/section";
import { TEACHING_INTEREST_ICONS } from "@/components/patterns/topic-icons";
import { TEACHING_INTEREST_IDS, TEACHING_ROLES } from "@/content/teaching";
import { usePeriod } from "@/i18n/use-period";

export const TeachingPage = () => {
    const t = useTranslations("teaching");
    const { formatPeriod } = usePeriod();

    return (
        <>
            <PageMeta title={t("title")} description={t("description")} />
            <PageHeader eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} />

            <Section id="roles" title={t("sections.roles")}>
                <ul className="flex flex-col gap-4">
                    {TEACHING_ROLES.map((role) => (
                        <li key={role.id}>
                            <Card>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <Overline>{formatPeriod(role.period)}</Overline>
                                    <HighlightBadge>{t(`roles.${role.id}.role`)}</HighlightBadge>
                                </div>
                                <Heading size="title" className="mt-3">
                                    {t(`roles.${role.id}.courses`)}
                                </Heading>
                                <p className="mt-1 text-sm text-quaternary">{t(`roles.${role.id}.institution`)}</p>
                                <p className="mt-3 text-md text-pretty text-tertiary">{t(`roles.${role.id}.description`)}</p>
                            </Card>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section id="interests" title={t("sections.interests")}>
                <ul className="grid gap-4 sm:grid-cols-2">
                    {TEACHING_INTEREST_IDS.map((id) => (
                        <li key={id}>
                            <Card className="h-full">
                                <IconTile icon={TEACHING_INTEREST_ICONS[id]} />
                                <Heading size="title" className="mt-5">
                                    {t(`interests.${id}.title`)}
                                </Heading>
                                <p className="mt-2 text-sm text-tertiary">{t(`interests.${id}.description`)}</p>
                            </Card>
                        </li>
                    ))}
                </ul>
            </Section>
        </>
    );
};
