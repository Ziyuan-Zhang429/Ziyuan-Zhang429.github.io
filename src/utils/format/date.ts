import type { YearMonth } from "@/content/types";

/** True for "YYYY-MM", false for a bare year. */
export const hasMonth = (value: YearMonth) => value.includes("-");

/** "YYYY" or "YYYY-MM" as a UTC date on the first of the month (format it in UTC to avoid off-by-one months). */
export const parseYearMonth = (value: YearMonth) => {
    const [year, month = "1"] = value.split("-");
    return new Date(Date.UTC(Number(year), Number(month) - 1, 1));
};
