import { useFormatter, useTranslations } from "use-intl";
import type { Period, YearMonth } from "@/content/types";
import { hasMonth, parseYearMonth } from "@/utils/format/date";

/**
 * Locale-aware formatting for the calendar periods used throughout the content
 * ("Aug 2024 – Apr 2026", "2025 – Present", "Jun 2025").
 */
export const usePeriod = () => {
    const format = useFormatter();
    const t = useTranslations("common");

    const formatDate = (value: YearMonth, month: "short" | "long" = "short") =>
        format.dateTime(parseYearMonth(value), hasMonth(value) ? { year: "numeric", month } : { year: "numeric" });

    const formatPeriod = ({ start, end }: Period) => {
        if (!end) return t("periodOngoing", { start: formatDate(start) });

        const withMonth = hasMonth(start) && hasMonth(end);
        return format.dateTimeRange(parseYearMonth(start), parseYearMonth(end), withMonth ? { year: "numeric", month: "short" } : { year: "numeric" });
    };

    return { formatDate, formatPeriod };
};
