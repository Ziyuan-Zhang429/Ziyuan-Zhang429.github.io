import type { Publication } from "@/content/types";

export const DOI_RESOLVER = "https://doi.org/";

export const doiUrl = (doi: string) => `${DOI_RESOLVER}${doi}`;

/** Ends a citation element with a period, unless it already ends in one (e.g. "et al."). */
export const withPeriod = (text: string) => (/[.?!]$/.test(text) ? text : `${text}.`);

/**
 * Plain-text AMA-style citation, used by the "Copy citation" action.
 * `inPreparationLabel` comes from the message catalog so the output follows the active locale.
 */
export const formatCitation = (publication: Publication, inPreparationLabel: string) => {
    const parts = [withPeriod(publication.authors.join(", ")), withPeriod(publication.title)];

    if (publication.status === "in-preparation") {
        parts.push(inPreparationLabel);
    } else {
        parts.push(withPeriod(publication.venue), withPeriod(publication.citation ?? String(publication.year)));
    }

    if (publication.doi) parts.push(`doi:${publication.doi}`);

    return parts.join(" ");
};
