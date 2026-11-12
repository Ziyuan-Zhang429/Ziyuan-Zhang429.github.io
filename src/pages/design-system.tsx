import { useState } from "react";
import { SparkleIcon, VirusIcon } from "@phosphor-icons/react";
import { ArrowRight, Download01, SearchLg } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Card, CardLink } from "@/components/base/card/card";
import { Chip, ChipGroup } from "@/components/base/chip-group/chip-group";
import { CopyButton } from "@/components/base/copy-button/copy-button";
import { EmptyState } from "@/components/base/empty-state/empty-state";
import { Heading, Overline } from "@/components/base/heading/heading";
import { IconTile } from "@/components/base/icon-tile/icon-tile";
import { Input } from "@/components/base/input/input";
import { Slider } from "@/components/base/slider/slider";
import { HighlightBadge, StatusBadge, Tag, TagList } from "@/components/base/tag/tag";
import { TextLink } from "@/components/base/text-link/text-link";
import { Timeline } from "@/components/base/timeline/timeline";
import { LogoMark } from "@/components/foundations/logo/logo-mark";
import { PageHeader } from "@/components/layout/page-header";
import { PageMeta } from "@/components/layout/page-meta";
import { Section } from "@/components/layout/section";
import { AREA_ICONS } from "@/components/patterns/topic-icons";
import { PERCENT_FORMAT } from "@/utils/format/number";

const SWATCHES = [
    { name: "page", className: "bg-page" },
    { name: "surface", className: "bg-surface" },
    { name: "surface-muted", className: "bg-surface-muted" },
    { name: "brand-solid", className: "bg-brand-solid" },
    { name: "brand-primary", className: "bg-brand-primary" },
    { name: "brand-950", className: "bg-brand-950" },
    { name: "sir-s", className: "bg-sir-s" },
    { name: "sir-i", className: "bg-sir-i" },
    { name: "sir-r", className: "bg-sir-r" },
    { name: "sir-s-muted", className: "bg-sir-s-muted" },
];

const RAMP = ["25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

/** Living reference for DESIGN.md. Not linked from the navigation. */
export const DesignSystemPage = () => {
    const t = useTranslations("designSystem");
    const [chip, setChip] = useState<string>("one");

    return (
        <>
            <PageMeta title={t("title")} />
            <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

            <Section id="colors" title={t("sections.colors")}>
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {SWATCHES.map((swatch) => (
                        <li key={swatch.name}>
                            <div className={`h-16 rounded-xl ring-1 ring-secondary ring-inset ${swatch.className}`} />
                            <p className="mt-1.5 font-mono text-xs text-tertiary">{swatch.name}</p>
                        </li>
                    ))}
                </ul>
                {(["brand", "neutral"] as const).map((scale) => (
                    <div key={scale} className="mt-6 flex overflow-hidden rounded-xl ring-1 ring-secondary">
                        {RAMP.map((step) => (
                            <div key={step} className="h-10 flex-1" style={{ backgroundColor: `var(--color-${scale}-${step})` }} title={`${scale}-${step}`} />
                        ))}
                    </div>
                ))}
            </Section>

            <Section id="typography" title={t("sections.typography")}>
                <div className="flex flex-col gap-6">
                    <Heading size="display" as="p">
                        {t("samples.display")}
                    </Heading>
                    <Heading size="page" as="p">
                        {t("samples.display")}
                    </Heading>
                    <Heading size="section" as="p">
                        {t("samples.heading")}
                    </Heading>
                    <Heading size="title" as="p">
                        {t("samples.cardTitle")}
                    </Heading>
                    <p className="max-w-xl text-md text-tertiary">{t("samples.body")}</p>
                    <Overline>{t("samples.meta")}</Overline>
                    <Overline tone="brand" rule>
                        {t("samples.meta")}
                    </Overline>
                </div>
            </Section>

            <Section id="buttons" title={t("sections.buttons")}>
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="lg" iconTrailing={ArrowRight}>
                        {t("samples.primary")}
                    </Button>
                    <Button size="lg" color="secondary" iconLeading={Download01}>
                        {t("samples.secondary")}
                    </Button>
                    <Button size="lg" color="tertiary">
                        {t("samples.tertiary")}
                    </Button>
                    <CopyButton value="design-system" />
                    <TextLink href="/design-system" arrow>
                        {t("samples.link")}
                    </TextLink>
                    <TextLink href="https://github.com/google-labs-code/design.md" tone="neutral">
                        DESIGN.md
                    </TextLink>
                </div>
            </Section>

            <Section id="badges" title={t("sections.badges")}>
                <div className="flex flex-wrap items-center gap-2">
                    <Tag>{t("samples.chipOne")}</Tag>
                    <HighlightBadge>{t("samples.primary")}</HighlightBadge>
                    <StatusBadge status="primary">Primary</StatusBadge>
                    <StatusBadge status="active">Active</StatusBadge>
                    <StatusBadge status="alumnus">Alumnus</StatusBadge>
                    <StatusBadge status="prior">Prior</StatusBadge>
                    <Badge type="pill-color" size="sm" color="gray">
                        Badge
                    </Badge>
                </div>
            </Section>

            <Section id="inputs" title={t("sections.inputs")}>
                <div className="flex flex-col gap-5">
                    <Slider
                        label={t("samples.chipOne")}
                        defaultValue={0.3}
                        minValue={0}
                        maxValue={1}
                        step={0.05}
                        formatOptions={PERCENT_FORMAT}
                        className="max-w-sm"
                    />
                    <Input icon={SearchLg} shortcut="/" aria-label={t("samples.chipOne")} placeholder={t("samples.body")} className="max-w-sm" />
                    <ChipGroup aria-label={t("sections.inputs")} value={chip} onChange={(key) => setChip(String(key))}>
                        <Chip id="one" count={9}>
                            {t("samples.chipOne")}
                        </Chip>
                        <Chip id="two" count={4}>
                            {t("samples.chipTwo")}
                        </Chip>
                        <Chip id="three">{t("samples.chipThree")}</Chip>
                    </ChipGroup>
                </div>
            </Section>

            <Section id="surfaces" title={t("sections.surfaces")}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <IconTile icon={VirusIcon} />
                        <Heading size="title" className="mt-5">
                            {t("samples.cardTitle")}
                        </Heading>
                        <p className="mt-2 text-sm text-tertiary">{t("samples.cardBody")}</p>
                        <TagList className="mt-4 flex flex-wrap gap-1.5">
                            <li>
                                <Tag>{t("samples.chipOne")}</Tag>
                            </li>
                            <li>
                                <Tag>{t("samples.chipTwo")}</Tag>
                            </li>
                        </TagList>
                    </Card>
                    <CardLink href="/design-system">
                        <IconTile icon={SparkleIcon} color="gray" />
                        <Heading size="title" className="mt-5">
                            {t("samples.cardTitle")}
                        </Heading>
                        <p className="mt-2 text-sm text-tertiary">{t("samples.cardBody")}</p>
                    </CardLink>
                </div>
            </Section>

            <Section id="lists" title={t("sections.lists")}>
                <Timeline>
                    <Timeline.Item current meta="2029" title={t("samples.timelineTitle")}>
                        {t("samples.timelineBody")}
                    </Timeline.Item>
                    <Timeline.Item meta="2025" title={t("samples.timelineTitle")}>
                        {t("samples.timelineBody")}
                    </Timeline.Item>
                </Timeline>
            </Section>

            <Section id="feedback" title={t("sections.feedback")}>
                <EmptyState icon={SparkleIcon} title={t("samples.emptyTitle")} description={t("samples.emptyDescription")} />
            </Section>

            <Section id="icons" title={t("sections.icons")}>
                <div className="flex flex-wrap items-center gap-3">
                    <LogoMark />
                    {Object.entries(AREA_ICONS).map(([key, icon]) => (
                        <IconTile key={key} icon={icon} size="sm" />
                    ))}
                    {Object.entries(AREA_ICONS).map(([key, icon]) => (
                        <IconTile key={key} icon={icon} size="lg" color="gray" />
                    ))}
                </div>
            </Section>
        </>
    );
};
