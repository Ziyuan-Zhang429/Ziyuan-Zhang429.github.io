import type { Affiliation, AreaId, EducationEntry, Position, SkillGroup } from "./types";

/** Non-translatable profile facts. Display copy lives under `profile` in the message catalog. */
export const PROFILE = {
    initials: "ZZ",
    email: "leozhang0429@berkeley.edu",
    cvUrl: "/CV_Ziyuan_Zhang.pdf",
};

export const FOCUS_AREA_IDS: AreaId[] = ["infectious-disease", "phylodynamics-vaccines", "suicide", "sdoh"];

export const EDUCATION: EducationEntry[] = [
    { id: "phd", date: "2028-05", expected: true, notes: ["emphasis", "concurrent"] },
    { id: "ms", date: "2025-05", notes: [] },
    { id: "ba", date: "2023-05", notes: ["concentration"] },
];

export const CURRENT_POSITIONS: Position[] = [
    {
        id: "berkeley-gsr",
        period: { start: "2025-08" },
        people: { role: "supervisors", names: ["Joseph A. Lewnard, Ph.D.", "Nicola F. Müller, Ph.D."] },
        projectIds: ["mpox", "rsv"],
    },
    {
        id: "weill-cornell-ra",
        period: { start: "2022" },
        people: { role: "supervisors", names: ["Yunyu Xiao, Ph.D.", "J. John Mann, M.D."] },
        projectIds: ["suicide-intent"],
    },
];

export const AFFILIATIONS: Affiliation[] = [
    { id: "berkeley", status: "primary" },
    { id: "harvard-chan", status: "alumnus" },
    { id: "weill-cornell", status: "active" },
    { id: "mayo", status: "prior" },
    { id: "mgh-ita", status: "prior" },
];

export const SKILLS: SkillGroup[] = [
    { id: "programming", items: ["R", "Python", "Java"] },
    { id: "modeling", items: ["NetLogo", "BEAST2"] },
    { id: "visualization", items: ["ArcGIS", "Tableau", "Adobe Illustrator", "Adobe Photoshop"] },
    { id: "other", items: ["Covidence", "Microsoft Office Suite"] },
];
