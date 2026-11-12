import { useFormatter, useTranslations } from "use-intl";
import type { People } from "@/content/types";

/** "Supervisors: A and B" with a locale-aware list conjunction. */
export const usePeople = () => {
    const t = useTranslations("common.people");
    const format = useFormatter();

    return (people: People) => t(people.role, { names: format.list(people.names, { type: "conjunction" }) });
};
