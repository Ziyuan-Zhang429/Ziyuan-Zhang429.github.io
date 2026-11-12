import en from "./messages/en.json";

export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** All dates in content are calendar months/years, so format them in UTC to avoid off-by-one shifts. */
export const TIME_ZONE = "UTC";

export const MESSAGES_BY_LOCALE = { en } satisfies Record<Locale, typeof en>;
