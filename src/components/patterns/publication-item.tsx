import { useTranslations } from "use-intl";
import { CopyButton } from "@/components/base/copy-button/copy-button";
import { HighlightBadge, Tag } from "@/components/base/tag/tag";
import { TextLink } from "@/components/base/text-link/text-link";
import { isFirstAuthor } from "@/content/publications";
import type { Publication } from "@/content/types";
import { cx } from "@/utils/cx";
import { doiUrl, formatCitation } from "@/utils/format/citation";
import { AuthorList } from "./author-list";

interface PublicationItemProps {
    publication: Publication;
    /** Heading level for the title, to fit the surrounding outline. */
    titleAs?: "h3" | "h4";
    /** Compact rows drop the actions (used for previews). */
    compact?: boolean;
    className?: string;
}

export const PublicationItem = ({ publication, titleAs: TitleTag = "h3", compact, className }: PublicationItemProps) => {
    const t = useTranslations("publications");
    const tCommon = useTranslations("common");
    const inPreparation = publication.status === "in-preparation";
    const firstAuthor = isFirstAuthor(publication);

    return (
        <article className={cx("group/pub flex flex-col gap-2", className)}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {inPreparation ? (
                    <Tag>{t("badges.inPreparation")}</Tag>
                ) : (
                    <p className="text-sm text-tertiary">
                        <span className="font-serif text-md text-secondary italic">{publication.venue}</span>
                        <span aria-hidden="true" className="mx-2 text-quaternary">
                            ·
                        </span>
                        <span className="font-mono text-xs whitespace-nowrap text-quaternary">{publication.citation ?? publication.year}</span>
                    </p>
                )}
                {firstAuthor && <HighlightBadge>{t("badges.firstAuthor")}</HighlightBadge>}
            </div>

            <TitleTag className="text-md leading-snug font-semibold text-pretty text-primary md:text-lg">
                {publication.doi ? (
                    <a
                        href={doiUrl(publication.doi)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xs outline-focus-ring transition duration-100 ease-linear hover:text-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        {publication.title}
                        <span className="sr-only"> {tCommon("opensInNewTab")}</span>
                    </a>
                ) : (
                    publication.title
                )}
            </TitleTag>

            <AuthorList authors={publication.authors} />

            {!compact && (
                <div className="mt-1 flex items-center gap-3">
                    {publication.doi && (
                        <TextLink href={doiUrl(publication.doi)} tone="neutral" className="font-mono text-xs">
                            {`doi:${publication.doi}`}
                        </TextLink>
                    )}
                    <CopyButton
                        size="xs"
                        value={formatCitation(publication, t("citation.inPreparation"))}
                        label={t("actions.copyCitation")}
                        copiedLabel={t("actions.citationCopied")}
                    />
                </div>
            )}
        </article>
    );
};
