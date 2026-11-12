import type { Icon } from "@phosphor-icons/react";
import { BrainIcon, ChartLineUpIcon, ChatsCircleIcon, DnaIcon, GraphIcon, VirusIcon } from "@phosphor-icons/react";
import type { AreaId, TeachingInterestId } from "@/content/types";

/** Subject-matter glyphs (Phosphor, duotone). UI controls use @untitledui/icons instead. */
export const AREA_ICONS: Record<AreaId, Icon> = {
    "infectious-disease": VirusIcon,
    "phylodynamics-vaccines": DnaIcon,
    suicide: BrainIcon,
    sdoh: ChatsCircleIcon,
};

export const TEACHING_INTEREST_ICONS: Record<TeachingInterestId, Icon> = {
    "infectious-disease": VirusIcon,
    simulation: GraphIcon,
    "causal-inference": ChartLineUpIcon,
    "nlp-ml": ChatsCircleIcon,
};
