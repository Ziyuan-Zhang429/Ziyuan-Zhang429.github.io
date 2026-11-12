import type en from "@/i18n/messages/en.json";

/**
 * Content is split in two:
 * - Structure (ids, dates, links, ordering, bibliographic records) lives in `src/content/*.ts`.
 * - Every translatable string lives in `src/i18n/messages/<locale>.json`, keyed by the ids below.
 *
 * Ids are typed against the English catalog so a missing or misspelled key fails type-checking.
 */
type Messages = typeof en;

export type AreaId = keyof Messages["areas"];
export type EducationId = keyof Messages["education"];
export type PositionId = keyof Messages["positions"];
export type AffiliationId = keyof Messages["affiliations"]["items"];
export type AffiliationStatus = keyof Messages["affiliations"]["status"];
export type ProjectId = keyof Messages["research"]["projects"];
export type SkillGroupId = keyof Messages["research"]["skills"];
export type TagId = keyof Messages["tags"];
export type TeachingRoleId = keyof Messages["teaching"]["roles"];
export type TeachingInterestId = keyof Messages["teaching"]["interests"];
export type PeopleRole = keyof Messages["common"]["people"];

/** "YYYY" or "YYYY-MM". */
export type YearMonth = `${number}` | `${number}-${number}`;

export interface Period {
    start: YearMonth;
    /** Omit for ongoing work. */
    end?: YearMonth;
}

export interface People {
    role: PeopleRole;
    names: string[];
}

export interface EducationEntry {
    id: EducationId;
    /** Graduation date. */
    date: YearMonth;
    expected?: boolean;
    notes: string[];
}

export interface Position {
    id: PositionId;
    period: Period;
    people: People;
    /** Current projects under this position, linked from the home page. */
    projectIds?: ProjectId[];
}

export interface Affiliation {
    id: AffiliationId;
    status: AffiliationStatus;
}

export interface SkillGroup {
    id: SkillGroupId;
    items: string[];
}

export interface Project {
    id: ProjectId;
    period: Period;
    status: "current" | "previous";
    /** Supervisors or collaborators, when listed. */
    people?: People;
    tags: TagId[];
    areas: AreaId[];
    /** Ids of related entries in `publications`. */
    publicationIds?: string[];
}

/** Bibliographic records are reproduced as published and are not translated. */
export interface Publication {
    id: string;
    authors: string[];
    title: string;
    venue: string;
    year: number;
    /** Volume/issue/pages, e.g. "2025;28(1):3". Falls back to the year when omitted. */
    citation?: string;
    doi?: string;
    status: "published" | "in-preparation";
    featured?: boolean;
}

export interface Talk {
    date: YearMonth;
    venue: string;
    title: string;
}

export interface Award {
    title: string;
    venue: string;
    year: number;
}

export interface TeachingRole {
    id: TeachingRoleId;
    period: Period;
}
