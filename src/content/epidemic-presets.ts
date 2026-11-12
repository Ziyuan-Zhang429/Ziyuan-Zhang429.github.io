import type en from "@/i18n/messages/en.json";

export type PresetId = keyof (typeof en)["home"]["simulator"]["presets"]["items"];

/** A published source behind a preset number. Bibliographic data, reproduced as published and not translated. */
export interface PresetSource {
    authors: string;
    title: string;
    venue: string;
    /** Year, volume, issue and pages, or "accessed" information for web pages. */
    details: string;
    url: string;
}

/**
 * Sources for every number in the presets. Keep a source here only if a preset cites it;
 * the reference list numbers them in the order presets first cite them.
 */
export const PRESET_SOURCES = {
    "lloyd-smith-2005": {
        authors: "Lloyd-Smith JO, Schreiber SJ, Kopp PE, Getz WM",
        title: "Superspreading and the effect of individual variation on disease emergence",
        venue: "Nature",
        details: "2005;438:355–359",
        url: "https://doi.org/10.1038/nature04153",
    },
    "liu-2020": {
        authors: "Liu Y, Gayle AA, Wilder-Smith A, Rocklöv J",
        title: "The reproductive number of COVID-19 is higher compared to SARS coronavirus",
        venue: "Journal of Travel Medicine",
        details: "2020;27(2):taaa021",
        url: "https://doi.org/10.1093/jtm/taaa021",
    },
    "he-2020": {
        authors: "He X, et al.",
        title: "Temporal dynamics in viral shedding and transmissibility of COVID-19",
        venue: "Nature Medicine",
        details: "2020;26(5):672–675",
        url: "https://doi.org/10.1038/s41591-020-0869-5",
    },
    "liu-rocklov-2022": {
        authors: "Liu Y, Rocklöv J",
        title: "The effective reproductive number of the Omicron variant of SARS-CoV-2 is several times relative to Delta",
        venue: "Journal of Travel Medicine",
        details: "2022;29(3):taac037",
        url: "https://doi.org/10.1093/jtm/taac037",
    },
    "boucau-2022": {
        authors: "Boucau J, et al.",
        title: "Duration of shedding of culturable virus in SARS-CoV-2 Omicron (BA.1) infection",
        venue: "New England Journal of Medicine",
        details: "2022;387:275–277",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9258747/",
    },
    "covid-forecasting-2022": {
        authors: "COVID-19 Forecasting Team",
        title: "Variation in the COVID-19 infection–fatality ratio by age, time, and geography during the pre-vaccine era: a systematic analysis",
        venue: "The Lancet",
        details: "2022;399(10334):1469–1488",
        url: "https://doi.org/10.1016/S0140-6736(21)02867-1",
    },
    "levin-2020": {
        authors: "Levin AT, et al.",
        title: "Assessing the age specificity of infection fatality rates for COVID-19: systematic review, meta-analysis, and public policy implications",
        venue: "European Journal of Epidemiology",
        details: "2020;35(12):1123–1138",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7721859/",
    },
    "liu-ijid-2022": {
        authors: "Liu Y, et al.",
        title: "Reduction in the infection fatality rate of Omicron variant compared with previous variants in South Africa",
        venue: "International Journal of Infectious Diseases",
        details: "2022;120:146–149",
        url: "https://research.polyu.edu.hk/en/publications/reduction-in-the-infection-fatality-rate-of-omicron-variant-compa/",
    },
    "biggerstaff-2014": {
        authors: "Biggerstaff M, Cauchemez S, Reed C, Gambhir M, Finelli L",
        title: "Estimates of the reproduction number for seasonal, pandemic, and zoonotic influenza: a systematic review of the literature",
        venue: "BMC Infectious Diseases",
        details: "2014;14:480",
        url: "https://doi.org/10.1186/1471-2334-14-480",
    },
    "thompson-2022": {
        authors: "Thompson R, Wood JG, Tempia S, Muscatello DJ",
        title: "Global variation in early epidemic growth rates and reproduction number of seasonal influenza",
        venue: "International Journal of Infectious Diseases",
        details: "2022;122:382–388",
        url: "https://pubmed.ncbi.nlm.nih.gov/35718299/",
    },
    "cdc-flu": {
        authors: "Centers for Disease Control and Prevention",
        title: "How flu spreads",
        venue: "cdc.gov",
        details: "Influenza (Flu)",
        url: "https://www.cdc.gov/flu/spread/index.html",
    },
    "cdc-flu-burden-2024": {
        authors: "Centers for Disease Control and Prevention",
        title: "Preliminary estimated flu disease burden, 2023–2024 flu season",
        venue: "cdc.gov",
        details: "Updated 20 November 2024",
        url: "https://archive.cdc.gov/www_cdc_gov/flu-burden/php/data-vis/2023-2024.html",
    },
    "guerra-2017": {
        authors: "Guerra FM, et al.",
        title: "The basic reproduction number (R0) of measles: a systematic review",
        venue: "The Lancet Infectious Diseases",
        details: "2017;17(12):e420–e428",
        url: "https://pubmed.ncbi.nlm.nih.gov/28757186/",
    },
    "cdc-measles": {
        authors: "Centers for Disease Control and Prevention",
        title: "Clinical overview of measles",
        venue: "cdc.gov",
        details: "Measles (Rubeola), for healthcare providers",
        url: "https://www.cdc.gov/measles/hcp/clinical-overview/index.html",
    },
    "cdc-measles-global": {
        authors: "Centers for Disease Control and Prevention",
        title: "Measles: global health topics",
        venue: "cdc.gov (archived)",
        details: "Last reviewed 12 December 2019",
        url: "https://archive.cdc.gov/www_cdc_gov/globalhealth/newsroom/topics/measles/index.html",
    },
    "zhang-2024": {
        authors: "Zhang X-S, et al.",
        title: "Transmission dynamics and effect of control measures on the 2022 outbreak of mpox among gay, bisexual, and other men who have sex with men in England: a mathematical modelling study",
        venue: "The Lancet Infectious Diseases",
        details: "2024;24(1):65–74",
        url: "https://www.thelancet.com/journals/laninf/article/PIIS1473-3099(23)00451-6/fulltext",
    },
    "cdc-mpox": {
        authors: "Centers for Disease Control and Prevention",
        title: "Clinical signs and symptoms of mpox",
        venue: "cdc.gov",
        details: "Mpox, for healthcare providers",
        url: "https://www.cdc.gov/mpox/hcp/clinical-signs/index.html",
    },
    "who-mpox-2022": {
        authors: "World Health Organization",
        title: "Multi-country outbreak of mpox, external situation report #12",
        venue: "who.int",
        details: "14 December 2022",
        url: "https://www.who.int/docs/default-source/coronaviruse/situation-reports/20221214_mpox_external-sitrep-12-.pdf",
    },
    "who-ebola-nejm-2014": {
        authors: "WHO Ebola Response Team",
        title: "Ebola virus disease in West Africa — the first 9 months of the epidemic and forward projections",
        venue: "New England Journal of Medicine",
        details: "2014;371(16):1481–1495",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4235004/",
    },
    "who-ebola-factsheet": {
        authors: "World Health Organization",
        title: "Ebola disease fact sheet",
        venue: "who.int",
        details: "Key facts",
        url: "https://www.who.int/en/news-room/fact-sheets/detail/Ebola-virus-disease",
    },
} satisfies Record<string, PresetSource>;

export type SourceId = keyof typeof PRESET_SOURCES;

export interface EpidemicPreset {
    id: PresetId;
    /** R₀ the simulator targets, taken from the first source. */
    r0: number;
    /** Mean infectious period (days) of infections that end in recovery. */
    recoveryDays: number;
    /**
     * Mean infectious period (days) of infections that end in death. Equal to `recoveryDays` unless a source gives
     * an outcome-specific estimate (Ebola: infectious until death, which comes sooner than recovery).
     */
    deathDays: number;
    /** Share of infections that end in death, read from the third source. */
    ifr: number;
    /**
     * Nearest contacts per person. Each person can infect at most their contacts, so the network's R₀ ceiling is
     * roughly its mean excess degree: highly transmissible diseases need dense networks to reach their R₀.
     */
    contacts: number;
    /** A source for every number. What each says is written out under `presets.details` in the catalog. */
    sources: { r0: SourceId; recovery: SourceId; death: SourceId; fatality: SourceId };
    /** Age-specific fatality, for diseases with published age data (COVID-19, influenza). */
    ageProfile?: PresetAgeProfile;
    /** Kept in the data (and type-checked) but not offered in the UI. */
    hidden?: boolean;
}

/** Population presets shared by every disease with age data; each disease maps them to the ages its source reports. */
export type AgeGroupId = Exclude<keyof (typeof en)["home"]["simulator"]["populations"]["items"], "all">;
export type PopulationId = AgeGroupId | "all";

/** Population chips, in display order. */
export const POPULATION_IDS: PopulationId[] = ["all", "infants", "adults", "middle-aged", "elderly"];

export interface AgeProfile {
    /** Source of the age-specific values. */
    source: SourceId;
    /** What the rate is per: an infection (IFR) or a symptomatic illness (CDC influenza burden). */
    measure: "infection" | "illness";
    /** For each group: the age(s) the source reports, the fatality rate there, and a source if it differs. */
    groups: Record<AgeGroupId, { ages: string; ifr: number; source?: SourceId }>;
}

export interface PresetAgeProfile {
    profile: AgeProfile;
    /** Multiplies the profile (Omicron's lower fatality); `scaleSource` cites it. */
    scale?: number;
    scaleSource?: SourceId;
}

/**
 * COVID-19 infection fatality by age, ancestral strain before vaccines: the published meta-regression [Levin 2020],
 * which starts at age 10; infants use the age-1 estimate, 0.0054% (95% UI 0.0021–0.0114) [COVID-19 Forecasting Team 2022, table 1].
 */
export const COVID_AGE_PROFILE: AgeProfile = {
    source: "levin-2020",
    measure: "infection",
    groups: {
        infants: { ages: "1", ifr: 0.000054, source: "covid-forecasting-2022" },
        adults: { ages: "25", ifr: 0.0001 },
        "middle-aged": { ages: "55", ifr: 0.004 },
        elderly: { ages: "75", ifr: 0.046 },
    },
};

/** Influenza deaths per symptomatic illness by age, US 2023–24 season, preliminary [CDC burden table 1]. */
export const FLU_AGE_PROFILE: AgeProfile = {
    source: "cdc-flu-burden-2024",
    measure: "illness",
    groups: {
        infants: { ages: "0–4", ifr: 268 / 2_903_633 },
        adults: { ages: "18–49", ifr: 2_705 / 16_351_383 },
        "middle-aged": { ages: "50–64", ifr: 5_701 / 9_042_884 },
        elderly: { ages: "65+", ifr: 19_038 / 2_610_181 },
    },
};

/**
 * Omicron's fatality relative to earlier variants: 1 − 0.787 [Liu, IJID 2022], to two significant figures like
 * every displayed rate, so the arithmetic shown on screen ("4.6% × 0.21 ≈ 0.97%") adds up.
 */
export const OMICRON_FATALITY_SCALE = 0.21;

/** The fatality rate a preset uses for a population: the age-specific value when there is one, else the preset's own. */
export const presetIfr = (preset: EpidemicPreset, population: PopulationId) => {
    if (!preset.ageProfile || population === "all") return preset.ifr;
    return preset.ageProfile.profile.groups[population].ifr * (preset.ageProfile.scale ?? 1);
};

/** The figure opens on the elderly, where age-dependent fatality is easiest to see. */
export const DEFAULT_POPULATION_ID: PopulationId = "elderly";

/**
 * Diseases other than Ebola have no outcome-specific infectious-period estimate, so fatal cases use the same period.
 *
 * - COVID-19 ancestral: pooled median R₀ 2.79 (mean 3.28) [Liu 2020]; infectiousness from ≈2 days before to ≈7 days
 *   after symptom onset [He 2020]; median country all-age IFR 0.47% in April 2020, before vaccines [COVID-19 Forecasting Team 2022].
 * - COVID-19 Omicron: mean R₀ 9.5, range 5.5–24 [Liu & Rocklöv 2022]; culturable virus for a median of ≈8 days [Boucau 2022];
 *   IFR ≈79% lower than earlier variants in South Africa [Liu, IJID 2022], i.e. 0.47% × 0.21 ≈ 0.1%.
 * - Influenza A: seasonal influenza median R 1.28, IQR 1.19–1.37 [Biggerstaff 2014]; infectious ≈1 day before to 5–7 days
 *   after onset [CDC]; ≈27,965 deaths among ≈40.2 million symptomatic illnesses in the US 2023–24 season (≈0.07%) [CDC].
 * - Influenza B: median early-epidemic Rₑ 1.23, range 1.06–1.58 [Thompson 2022]; same infectious period and season
 *   burden ratio (CDC estimates cover all influenza types) [CDC].
 * - Measles: R₀ often cited as 12–18 [Guerra 2017]; contagious 4 days before to 4 days after rash onset [CDC];
 *   1–2 deaths per 1,000 children who get measles (0.15%) [CDC].
 * - Mpox: R₀ 1.94 (95% CrI 1.81–2.19) among high-risk GBMSM, England 2022 [Zhang 2024]; illness lasts 2–4 weeks [CDC];
 *   65 deaths among 82,624 confirmed cases, Jan–Dec 2022 (≈0.08%) [WHO].
 * - Ebola (West Africa 2014): R₀ 1.71 Guinea, 1.83 Liberia, 2.02 Sierra Leone; infectious from symptom onset until death
 *   (mean 7.5 days) or hospital discharge (16.4 days) [WHO Ebola Response Team 2014];
 *   average case fatality ≈50%, 25–90% across past outbreaks [WHO fact sheet]. Close-contact spread, so few contacts.
 */
export const EPIDEMIC_PRESETS: EpidemicPreset[] = [
    {
        id: "covid-ancestral",
        r0: 2.79,
        recoveryDays: 8,
        deathDays: 8,
        ifr: 0.0047,
        contacts: 4,
        sources: { r0: "liu-2020", recovery: "he-2020", death: "he-2020", fatality: "covid-forecasting-2022" },
        ageProfile: { profile: COVID_AGE_PROFILE },
    },
    {
        id: "covid-omicron",
        r0: 9.5,
        recoveryDays: 8,
        deathDays: 8,
        ifr: 0.001,
        contacts: 10,
        sources: { r0: "liu-rocklov-2022", recovery: "boucau-2022", death: "boucau-2022", fatality: "liu-ijid-2022" },
        ageProfile: { profile: COVID_AGE_PROFILE, scale: OMICRON_FATALITY_SCALE, scaleSource: "liu-ijid-2022" },
    },
    {
        id: "influenza-a",
        r0: 1.28,
        recoveryDays: 5,
        deathDays: 5,
        ifr: 0.0007,
        contacts: 4,
        sources: { r0: "biggerstaff-2014", recovery: "cdc-flu", death: "cdc-flu", fatality: "cdc-flu-burden-2024" },
        ageProfile: { profile: FLU_AGE_PROFILE },
    },
    {
        id: "influenza-b",
        r0: 1.23,
        recoveryDays: 5,
        deathDays: 5,
        ifr: 0.0007,
        contacts: 4,
        sources: { r0: "thompson-2022", recovery: "cdc-flu", death: "cdc-flu", fatality: "cdc-flu-burden-2024" },
        ageProfile: { profile: FLU_AGE_PROFILE },
        // Influenza B behaves almost exactly like influenza A in this model (R 1.23 vs 1.28, same fatality data), so it is not shown.
        hidden: true,
    },
    {
        id: "measles",
        r0: 15,
        recoveryDays: 8,
        deathDays: 8,
        ifr: 0.0015,
        contacts: 12,
        sources: { r0: "guerra-2017", recovery: "cdc-measles", death: "cdc-measles", fatality: "cdc-measles-global" },
    },
    {
        id: "mpox",
        r0: 1.94,
        recoveryDays: 21,
        deathDays: 21,
        ifr: 0.0008,
        contacts: 3,
        sources: { r0: "zhang-2024", recovery: "cdc-mpox", death: "cdc-mpox", fatality: "who-mpox-2022" },
    },
    {
        id: "ebola",
        r0: 1.83,
        recoveryDays: 16.4,
        deathDays: 7.5,
        ifr: 0.5,
        contacts: 3,
        sources: { r0: "who-ebola-nejm-2014", recovery: "who-ebola-nejm-2014", death: "who-ebola-nejm-2014", fatality: "who-ebola-factsheet" },
    },
];

/** True when the preset gives fatal infections their own infectious period. */
export const hasOutcomeSpecificPeriods = (preset: EpidemicPreset) => preset.deathDays !== preset.recoveryDays;

export const getPreset = (id: PresetId) => EPIDEMIC_PRESETS.find((preset) => preset.id === id)!;

/** The presets offered in the UI. */
export const VISIBLE_PRESETS = EPIDEMIC_PRESETS.filter((preset) => !preset.hidden);

/** Sources in order of first citation, so reference numbers read 1, 2, 3… down the preset list. */
/** Cited by the superspreader toggle's info tooltip. */
export const SUPERSPREADING_SOURCE: SourceId = "lloyd-smith-2005";

export const SOURCE_ORDER: SourceId[] = [
    ...new Set([
        // Only presets shown in the UI contribute references, so the list never cites a hidden preset.
        ...VISIBLE_PRESETS.flatMap((preset) => [...Object.values(preset.sources), ...(preset.ageProfile ? [preset.ageProfile.profile.source] : [])]),
        SUPERSPREADING_SOURCE,
    ]),
];

export const sourceNumber = (id: SourceId) => SOURCE_ORDER.indexOf(id) + 1;
