/** Combining diacritical marks (U+0300–U+036F), stripped so "Muller" finds "Müller". */
const DIACRITICS = /[̀-ͯ]/g;

/** Lower-case, accent-free text for forgiving search comparisons. */
export const normalizeForSearch = (value: string) => value.normalize("NFD").replace(DIACRITICS, "").toLowerCase();

/** True when every whitespace-separated term of `query` appears somewhere in `fields`. An empty query matches. */
export const matchesAllTerms = (fields: (string | number)[], query: string) => {
    const haystack = normalizeForSearch(fields.join(" "));
    return normalizeForSearch(query)
        .split(/\s+/)
        .filter(Boolean)
        .every((term) => haystack.includes(term));
};
