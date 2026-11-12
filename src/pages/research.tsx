import { FunnelSimpleIcon } from "@phosphor-icons/react";
import { useSearchParams } from "react-router";
import { useTranslations } from "use-intl";
import { Button } from "@/components/base/buttons/button";
import { Chip, ChipGroup } from "@/components/base/chip-group/chip-group";
import { EmptyState } from "@/components/base/empty-state/empty-state";
import { Overline } from "@/components/base/heading/heading";
import { Tag, TagList } from "@/components/base/tag/tag";
import { PageHeader } from "@/components/layout/page-header";
import { PageMeta } from "@/components/layout/page-meta";
import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/patterns/project-card";
import { FOCUS_AREA_IDS, SKILLS } from "@/content/profile";
import { PROJECTS, countProjectsInArea } from "@/content/research";
import type { AreaId, Project } from "@/content/types";

type AreaFilter = AreaId | "all";

const isAreaId = (value: string | null): value is AreaId => FOCUS_AREA_IDS.includes(value as AreaId);

const ProjectList = ({ items }: { items: Project[] }) => (
    <ul className="flex flex-col gap-4">
        {items.map((project) => (
            <li key={project.id}>
                <ProjectCard project={project} />
            </li>
        ))}
    </ul>
);

export const ResearchPage = () => {
    const t = useTranslations();
    const [searchParams, setSearchParams] = useSearchParams();
    const areaParam = searchParams.get("area");
    const area: AreaFilter = isAreaId(areaParam) ? areaParam : "all";

    const setArea = (next: AreaFilter) => setSearchParams(next === "all" ? {} : { area: next }, { replace: true, preventScrollReset: true });

    const visible = area === "all" ? PROJECTS : PROJECTS.filter((project) => project.areas.includes(area));
    const current = visible.filter((project) => project.status === "current");
    const previous = visible.filter((project) => project.status === "previous");

    return (
        <>
            <PageMeta title={t("research.title")} description={t("research.description")} />
            <PageHeader eyebrow={t("research.eyebrow")} title={t("research.title")} description={t("research.description")}>
                <ChipGroup aria-label={t("research.filters.label")} value={area} onChange={(key) => setArea(key as AreaFilter)}>
                    <Chip id="all" count={PROJECTS.length}>
                        {t("research.filters.all")}
                    </Chip>
                    {FOCUS_AREA_IDS.map((id) => (
                        <Chip key={id} id={id} count={countProjectsInArea(id)}>
                            {t(`areas.${id}.shortTitle`)}
                        </Chip>
                    ))}
                </ChipGroup>
            </PageHeader>

            {current.length > 0 && (
                <Section id="current" title={t("research.sections.current")}>
                    <ProjectList items={current} />
                </Section>
            )}

            {previous.length > 0 && (
                <Section id="previous" title={t("research.sections.previous")}>
                    <ProjectList items={previous} />
                </Section>
            )}

            {visible.length === 0 && (
                <EmptyState
                    icon={FunnelSimpleIcon}
                    title={t("research.empty.title")}
                    description={t("research.empty.description")}
                    action={
                        <Button color="secondary" size="sm" onClick={() => setArea("all")}>
                            {t("research.empty.action")}
                        </Button>
                    }
                />
            )}

            <Section id="skills" title={t("research.sections.skills")}>
                <dl className="grid gap-px overflow-hidden rounded-2xl bg-border-secondary ring-1 ring-secondary sm:grid-cols-2">
                    {SKILLS.map((group) => (
                        <div key={group.id} className="bg-surface p-5 md:p-6">
                            <dt>
                                <Overline>{t(`research.skills.${group.id}`)}</Overline>
                            </dt>
                            <dd className="mt-3">
                                <TagList>
                                    {group.items.map((item) => (
                                        <li key={item}>
                                            <Tag>{item}</Tag>
                                        </li>
                                    ))}
                                </TagList>
                            </dd>
                        </div>
                    ))}
                </dl>
            </Section>
        </>
    );
};
