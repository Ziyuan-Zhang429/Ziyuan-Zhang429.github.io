import { useDeferredValue, useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { SearchLg } from "@untitledui/icons";
import { useTranslations } from "use-intl";
import { Button } from "@/components/base/buttons/button";
import { Card } from "@/components/base/card/card";
import { Chip, ChipGroup } from "@/components/base/chip-group/chip-group";
import { EmptyState } from "@/components/base/empty-state/empty-state";
import { Heading, Overline } from "@/components/base/heading/heading";
import { Input } from "@/components/base/input/input";
import { HighlightBadge } from "@/components/base/tag/tag";
import { Timeline } from "@/components/base/timeline/timeline";
import { PageHeader } from "@/components/layout/page-header";
import { PageMeta } from "@/components/layout/page-meta";
import { Section } from "@/components/layout/section";
import { PublicationItem } from "@/components/patterns/publication-item";
import { AWARDS, PUBLICATIONS, TALKS, isFirstAuthor } from "@/content/publications";
import type { Publication } from "@/content/types";
import { usePeriod } from "@/i18n/use-period";
import { matchesAllTerms } from "@/utils/format/search";

type Authorship = "all" | "first";

const matches = (publication: Publication, query: string) =>
    matchesAllTerms([publication.title, publication.venue, publication.year, ...publication.authors], query);

/** Focus the search field with "/" unless the user is already typing somewhere. */
const useSlashToFocus = (ref: React.RefObject<HTMLInputElement | null>) => {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (event.key !== "/" || event.metaKey || event.ctrlKey || target.closest("input, textarea, [contenteditable]")) return;
            event.preventDefault();
            ref.current?.focus();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [ref]);
};

const PublicationList = ({ items }: { items: Publication[] }) => (
    <ul className="flex flex-col divide-y divide-secondary">
        {items.map((publication) => (
            <li key={publication.id} className="py-7 first:pt-0 last:pb-0">
                <PublicationItem publication={publication} />
            </li>
        ))}
    </ul>
);

export const PublicationsPage = () => {
    const t = useTranslations("publications");
    const { formatDate } = usePeriod();
    const searchRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [authorship, setAuthorship] = useState<Authorship>("all");
    const deferredQuery = useDeferredValue(query);
    useSlashToFocus(searchRef);

    const visible = PUBLICATIONS.filter((publication) => (authorship === "all" || isFirstAuthor(publication)) && matches(publication, deferredQuery));
    const years = [...new Set(visible.filter((publication) => publication.status === "published").map((publication) => publication.year))].sort(
        (a, b) => b - a,
    );
    const inPreparation = visible.filter((publication) => publication.status === "in-preparation");

    return (
        <>
            <PageMeta title={t("title")} description={t("description")} />
            <PageHeader eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} />

            <div className="sticky top-16 z-20 -mx-5 flex flex-col gap-3 border-y border-secondary bg-page/90 px-5 py-3 backdrop-blur-xl sm:flex-row sm:items-center md:-mx-8 md:px-8">
                <Input
                    ref={searchRef}
                    type="search"
                    icon={SearchLg}
                    shortcut="/"
                    aria-label={t("toolbar.searchLabel")}
                    placeholder={t("toolbar.searchPlaceholder")}
                    value={query}
                    onChange={setQuery}
                    className="w-full sm:max-w-sm"
                />
                <ChipGroup aria-label={t("toolbar.filterLabel")} size="sm" value={authorship} onChange={(key) => setAuthorship(key as Authorship)}>
                    <Chip id="all">{t("toolbar.all")}</Chip>
                    <Chip id="first">{t("toolbar.firstAuthor")}</Chip>
                </ChipGroup>
                {/* Announced to screen readers only; the list itself shows the result visually. */}
                <p aria-live="polite" className="sr-only">
                    {t("toolbar.results", { count: visible.length })}
                </p>
            </div>

            {years.map((year) => (
                <Section key={year} id={`year-${year}`} title={String(year)}>
                    <PublicationList items={visible.filter((publication) => publication.status === "published" && publication.year === year)} />
                </Section>
            ))}

            {inPreparation.length > 0 && (
                <Section id="in-preparation" title={t("groups.inPreparation")}>
                    <PublicationList items={inPreparation} />
                </Section>
            )}

            {visible.length === 0 && (
                <div className="py-12">
                    <EmptyState
                        icon={MagnifyingGlassIcon}
                        title={t("empty.title")}
                        description={t("empty.description", { query: deferredQuery })}
                        action={
                            <Button
                                color="secondary"
                                size="sm"
                                onClick={() => {
                                    setQuery("");
                                    setAuthorship("all");
                                }}
                            >
                                {t("empty.action")}
                            </Button>
                        }
                    />
                </div>
            )}

            <Section id="talks" title={t("talks.title")}>
                <Timeline>
                    {TALKS.map((talk) => (
                        <Timeline.Item key={talk.title} meta={`${formatDate(talk.date, "long")} · ${talk.venue}`} title={talk.title} />
                    ))}
                </Timeline>
            </Section>

            <Section id="awards" title={t("awards.title")}>
                <ul className="flex flex-col gap-4">
                    {AWARDS.map((award) => (
                        <li key={award.title}>
                            <Card className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <Heading size="subtitle" as="h3">
                                        {award.title}
                                    </Heading>
                                    <Overline className="mt-1.5">
                                        {award.venue} · {award.year}
                                    </Overline>
                                </div>
                                <HighlightBadge>{t("badges.award")}</HighlightBadge>
                            </Card>
                        </li>
                    ))}
                </ul>
            </Section>
        </>
    );
};
