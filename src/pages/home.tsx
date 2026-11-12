import { ArrowRight, Download01, MarkerPin02 } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import portrait from "@/assets/portrait.jpg";
import { Button } from "@/components/base/buttons/button";
import { Card, CardLink } from "@/components/base/card/card";
import { Heading, Overline } from "@/components/base/heading/heading";
import { IconTile } from "@/components/base/icon-tile/icon-tile";
import { TextLink } from "@/components/base/text-link/text-link";
import { Timeline } from "@/components/base/timeline/timeline";
import { PageMeta } from "@/components/layout/page-meta";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/patterns/cta-banner";
import { EmailPill } from "@/components/patterns/email-pill";
import { EpidemicSimulator, SIMULATION_ANCHOR } from "@/components/patterns/epidemic-simulator";
import { PublicationItem } from "@/components/patterns/publication-item";
import { AREA_ICONS } from "@/components/patterns/topic-icons";
import { CURRENT_POSITIONS, EDUCATION, FOCUS_AREA_IDS, PROFILE } from "@/content/profile";
import { PUBLICATIONS } from "@/content/publications";
import { countProjectsInArea } from "@/content/research";
import { usePeople } from "@/i18n/use-people";
import { usePeriod } from "@/i18n/use-period";

const FEATURED_PUBLICATIONS = PUBLICATIONS.filter((publication) => publication.featured);

const Hero = () => {
    const t = useTranslations();

    return (
        <section
            aria-labelledby="hero-title"
            className="grid items-center gap-12 pt-10 pb-14 md:pt-16 lg:grid-cols-[1fr_20rem] lg:gap-16 lg:pt-20 xl:grid-cols-[1fr_23rem]"
        >
            <div className="animate-fade-up">
                <Overline tone="brand" className="tracking-normal normal-case">
                    <span className="relative flex size-2" aria-hidden="true">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-solid opacity-50 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-2 rounded-full bg-brand-solid" />
                    </span>
                    {t("profile.headline")}
                </Overline>
                <Heading id="hero-title" size="display" className="mt-5">
                    {t("profile.name")}
                </Heading>
                <p className="mt-3 font-serif text-2xl text-tertiary italic md:text-3xl">{t("profile.field")}</p>
                <p className="mt-7 max-w-2xl text-lg text-pretty text-secondary">{t("profile.bio")}</p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                    <Button href="/research" size="lg" iconTrailing={ArrowRight}>
                        {t("home.actions.viewResearch")}
                    </Button>
                    <Button href={PROFILE.cvUrl} target="_blank" rel="noopener" size="lg" color="secondary" iconLeading={Download01}>
                        {t("common.downloadCv")}
                    </Button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <EmailPill />
                    <TextLink href={`#${SIMULATION_ANCHOR}`} tone="neutral" arrow className="text-sm">
                        {t("home.actions.trySimulation")}
                    </TextLink>
                </div>
            </div>

            <div className="relative mx-auto w-full max-w-[18rem] animate-fade-up [animation-delay:120ms] sm:max-w-xs lg:max-w-none">
                <div
                    aria-hidden="true"
                    className="absolute -inset-3 -z-10 rotate-3 rounded-[2rem] bg-brand-primary ring-1 ring-brand-600/10 dark:bg-brand-950"
                />
                <img
                    src={portrait}
                    alt={t("profile.portraitAlt")}
                    width={960}
                    height={1199}
                    fetchPriority="high"
                    className="aspect-[4/5] w-full rounded-[1.75rem] object-cover object-top shadow-xl ring-1 ring-secondary"
                />
                <p className="absolute -bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-secondary shadow-lg ring-1 ring-secondary">
                    <MarkerPin02 aria-hidden="true" className="size-3.5 text-fg-brand-primary" />
                    {t("profile.location")}
                </p>
            </div>
        </section>
    );
};

export const HomePage = () => {
    const t = useTranslations();
    const { formatDate, formatPeriod } = usePeriod();
    const formatPeople = usePeople();

    return (
        <>
            <PageMeta />
            <Hero />
            <EpidemicSimulator />

            <Section id="focus" index="01" title={t("home.focus.title")}>
                <ul className="grid gap-4 sm:grid-cols-2">
                    {FOCUS_AREA_IDS.map((id) => (
                        <li key={id}>
                            <CardLink href={`/research?area=${id}`} className="flex h-full flex-col">
                                <IconTile icon={AREA_ICONS[id]} />
                                <Heading size="title" className="mt-5">
                                    {t(`areas.${id}.title`)}
                                </Heading>
                                <p className="mt-2 flex-1 text-sm text-tertiary">{t(`areas.${id}.description`)}</p>
                                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary">
                                    {t("home.focus.projectCount", { count: countProjectsInArea(id) })}
                                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-150 group-hover/card:translate-x-0.5" />
                                </span>
                            </CardLink>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section id="current" index="02" title={t("home.current.title")}>
                <ul className="flex flex-col gap-4">
                    {CURRENT_POSITIONS.map((position) => (
                        <li key={position.id}>
                            <Card>
                                <Overline>{formatPeriod(position.period)}</Overline>
                                <Heading size="title" className="mt-2">
                                    {t(`positions.${position.id}.role`)}
                                    <span className="font-normal text-tertiary"> · {t(`positions.${position.id}.organization`)}</span>
                                </Heading>
                                <p className="mt-2 text-md text-tertiary">{t(`positions.${position.id}.description`)}</p>
                                <p className="mt-3 text-sm text-quaternary">{formatPeople(position.people)}</p>
                                {position.projectIds && (
                                    <div className="mt-5 border-t border-secondary pt-4">
                                        <Overline className="mb-2.5">{t("home.current.projects")}</Overline>
                                        <ul className="flex flex-col gap-2">
                                            {position.projectIds.map((projectId) => (
                                                <li key={projectId} className="text-sm">
                                                    <TextLink href={`/research#${projectId}`} tone="neutral" arrow className="font-medium">
                                                        {t(`research.projects.${projectId}.title`)}
                                                    </TextLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Card>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section
                id="selected-publications"
                index="03"
                title={t("home.selected.title")}
                action={
                    <TextLink href="/publications" arrow>
                        {t("home.selected.viewAll")}
                    </TextLink>
                }
            >
                <ul className="flex flex-col divide-y divide-secondary">
                    {FEATURED_PUBLICATIONS.map((publication) => (
                        <li key={publication.id} className="py-6 first:pt-0 last:pb-0">
                            <PublicationItem publication={publication} compact />
                        </li>
                    ))}
                </ul>
            </Section>

            <Section id="education" index="04" title={t("home.education.title")}>
                <Timeline>
                    {EDUCATION.map((entry) => {
                        const date = formatDate(entry.date, "long");
                        return (
                            <Timeline.Item
                                key={entry.id}
                                current={entry.expected}
                                meta={`${entry.expected ? t("common.expected", { date }) : date} · ${t(`education.${entry.id}.location`)}`}
                                title={t(`education.${entry.id}.degree`)}
                            >
                                <p className="text-secondary">{t(`education.${entry.id}.institution`)}</p>
                                {entry.notes.map((note) => (
                                    // Notes are keyed per entry; the catalog guarantees they exist.
                                    <p key={note}>{t(`education.${entry.id}.notes.${note}` as Parameters<typeof t>[0])}</p>
                                ))}
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </Section>

            <CtaBanner />
        </>
    );
};
