import type { TeachingInterestId, TeachingRole } from "./types";

export const TEACHING_ROLES: TeachingRole[] = [
    { id: "clinical-trials-tf", period: { start: "2025-01", end: "2025-03" } },
    { id: "methods-tutor", period: { start: "2024-09", end: "2025-05" } },
];

export const TEACHING_INTEREST_IDS: TeachingInterestId[] = ["infectious-disease", "simulation", "causal-inference", "nlp-ml"];
