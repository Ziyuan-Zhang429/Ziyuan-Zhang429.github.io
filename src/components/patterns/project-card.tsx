import { useTranslations } from "use-intl";
import { Card } from "@/components/base/card/card";
import { Heading, Overline } from "@/components/base/heading/heading";
import { Tag, TagList } from "@/components/base/tag/tag";
import { TextLink } from "@/components/base/text-link/text-link";
import { getPublication } from "@/content/publications";
import type { Project } from "@/content/types";
import { usePeople } from "@/i18n/use-people";
import { usePeriod } from "@/i18n/use-period";
import { doiUrl } from "@/utils/format/citation";

export const ProjectCard = ({ project }: { project: Project }) => {
    const t = useTranslations();
    const { formatPeriod } = usePeriod();
    const formatPeople = usePeople();
    const related = (project.publicationIds ?? []).map(getPublication).filter((publication) => publication !== undefined);

    return (
        <Card id={project.id} padding="none" className="grid gap-4 p-5 md:grid-cols-[10rem_1fr] md:gap-8 md:p-6">
            <div className="flex flex-wrap gap-x-3 gap-y-1 md:flex-col">
                <Overline>{formatPeriod(project.period)}</Overline>
                <Overline className="text-tertiary">{t(`research.projects.${project.id}.organization`)}</Overline>
            </div>

            <div className="min-w-0">
                <Heading size="title">{t(`research.projects.${project.id}.title`)}</Heading>
                <p className="mt-2 text-md text-pretty text-tertiary">{t(`research.projects.${project.id}.description`)}</p>
                {project.people && <p className="mt-3 text-sm text-quaternary">{formatPeople(project.people)}</p>}

                <TagList className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                        <li key={tag}>
                            <Tag>{t(`tags.${tag}`)}</Tag>
                        </li>
                    ))}
                </TagList>

                {related.length > 0 && (
                    <div className="mt-5 border-t border-secondary pt-4">
                        <Overline className="mb-2">{t("research.relatedPublications")}</Overline>
                        <ul className="flex flex-col gap-1.5">
                            {related.map((publication) => (
                                <li key={publication.id} className="text-sm">
                                    {publication.doi ? (
                                        <TextLink href={doiUrl(publication.doi)} tone="neutral" className="font-normal">
                                            <span>
                                                <span className="italic">{publication.venue}</span>, {publication.year}
                                            </span>
                                        </TextLink>
                                    ) : (
                                        <span className="text-tertiary">{t("research.inPreparation")}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Card>
    );
};
