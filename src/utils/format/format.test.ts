import { describe, expect, it } from "vitest";
import type { Publication } from "@/content/types";
import { doiUrl, formatCitation, withPeriod } from "./citation";
import { hasMonth, parseYearMonth } from "./date";
import { DECIMAL_FORMAT, PERCENT_FORMAT } from "./number";
import { matchesAllTerms, normalizeForSearch } from "./search";

const paper: Publication = {
    id: "x",
    authors: ["Zhang Z", "Lipsitch M"],
    title: "A study",
    venue: "Journal",
    year: 2026,
    citation: "2026;1(2):3",
    doi: "10.1/abc",
    status: "published",
};

describe("citations", () => {
    it("adds a period only when one is missing", () => {
        expect(withPeriod("Zhang Z")).toBe("Zhang Z.");
        expect(withPeriod("He X, et al.")).toBe("He X, et al.");
        expect(withPeriod("Why?")).toBe("Why?");
    });

    it("formats published and in-preparation papers", () => {
        expect(formatCitation(paper, "In preparation.")).toBe("Zhang Z, Lipsitch M. A study. Journal. 2026;1(2):3. doi:10.1/abc");
        expect(formatCitation({ ...paper, status: "in-preparation", doi: undefined }, "In preparation.")).toBe("Zhang Z, Lipsitch M. A study. In preparation.");
        expect(doiUrl("10.1/abc")).toBe("https://doi.org/10.1/abc");
    });
});

describe("dates", () => {
    it("parses years and year-months as UTC", () => {
        expect(hasMonth("2025-08")).toBe(true);
        expect(hasMonth("2025")).toBe(false);
        expect(parseYearMonth("2025-08").toISOString()).toBe("2025-08-01T00:00:00.000Z");
        expect(parseYearMonth("2024").toISOString()).toBe("2024-01-01T00:00:00.000Z");
    });
});

describe("search", () => {
    it("ignores case and accents and needs every term", () => {
        expect(normalizeForSearch("Müller")).toBe("muller");
        expect(matchesAllTerms(["Test-negative design", 2026, "Zhang Z"], "zhang 2026")).toBe(true);
        expect(matchesAllTerms(["Test-negative design"], "zhang")).toBe(false);
        expect(matchesAllTerms(["anything"], "  ")).toBe(true);
    });
});

describe("number formats", () => {
    const percent = new Intl.NumberFormat("en", PERCENT_FORMAT);
    const decimal = new Intl.NumberFormat("en", DECIMAL_FORMAT);

    it("shows every rate to two significant figures, never rounding small ones to 0%", () => {
        expect(percent.format(0.000054)).toBe("0.0054%");
        expect(percent.format(0.0047)).toBe("0.47%");
        expect(percent.format(0.046)).toBe("4.6%");
        expect(percent.format(0.15)).toBe("15%");
        expect(percent.format(0)).toBe("0%");
        expect(decimal.format(2.79)).toBe("2.8");
        expect(decimal.format(13.2)).toBe("13");
    });
});
