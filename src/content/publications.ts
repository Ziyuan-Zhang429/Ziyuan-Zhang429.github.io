import type { Award, Publication, Talk } from "./types";

/** The author string that identifies Ziyuan in author lists. */
export const SELF_AUTHOR = "Zhang Z";

export const PUBLICATIONS: Publication[] = [
    {
        id: "tnd-scalar-immune",
        authors: ["Zhang Z", "Boyer CB", "Lipsitch M"],
        title: "Use of the test-negative design to estimate the protective effect of a scalar immune measure: a simulation analysis",
        venue: "American Journal of Epidemiology",
        year: 2026,
        doi: "10.1093/aje/kwag036",
        status: "published",
        featured: true,
    },
    {
        id: "nlp-sdoh-review",
        authors: ["Rajwal S", "Pandey AK", "Zhang Z", "Chen Y", "Liu MX", "Das S", "Rogers H", "Sarker A", "Xiao Y"],
        title: "Applications of Natural Language Processing and Large Language Models for Social Determinants of Health: Systematic Review",
        venue: "Journal of Medical Internet Research",
        year: 2026,
        citation: "2026;28:e83793",
        doi: "10.2196/83793",
        status: "published",
        featured: true,
    },
    {
        id: "csf-mngs-pediatric",
        authors: ["Li G", "Puumala E", "Zhang Z", "Rajapakse NS", "Ristagno EH", "Wolf MJ", "Rodning AA", "Simner PJ", "Gaensbauer JT", "Patel R"],
        title: "Cerebrospinal Fluid Metagenomic Next-Generation Sequencing in Pediatric Central Nervous System Infection: Clinical Experience and Diagnostic Stewardship Strategies",
        venue: "Open Forum Infectious Diseases",
        year: 2026,
        citation: "2026;13(2)",
        doi: "10.1093/ofid/ofag054",
        status: "published",
    },
    {
        id: "seraph-adenovirus",
        authors: ["Li G", "Hanna C", "Dinnes LM", "Allen-Rhoades WA", "Kohorst MA", "Levy ER", "Van Dorn CS", "Zhang Z", "Gaensbauer JT"],
        title: "Seraph® 100 Microbind® utilization in immunocompromised toddler with adenovirus viremia in conjunction with continuous renal replacement therapy and extracorporeal membrane oxygenation",
        venue: "IDCases",
        year: 2025,
        citation: "2025;42:e02380",
        doi: "10.1016/j.idcr.2025.e02380",
        status: "published",
    },
    {
        id: "16s-rrna-pediatric",
        authors: ["Li G", "Reis CA", "Kruc RM", "Zhang Z", "Streck NT", "Ristagno EH", "Mandrekar J", "Wolf MJ", "Gaensbauer JT", "Patel R"],
        title: "16S Ribosomal RNA Gene PCR and Sequencing for Pediatric Infection Diagnosis, United States, 2020–2023",
        venue: "Emerging Infectious Diseases",
        year: 2025,
        citation: "2025;31(13):129–136",
        doi: "10.3201/eid3113.241101",
        status: "published",
    },
    {
        id: "behavioral-dynamics-abm",
        authors: ["Zhang Z", "Jalali MS", "Ghaffarzadegan N"],
        title: "Behavioral Dynamics of Epidemic Trajectories and Vaccination Strategies: A Simulation-based Analysis",
        venue: "Journal of Artificial Societies and Social Simulation",
        year: 2025,
        citation: "2025;28(1):3",
        doi: "10.18564/jasss.5583",
        status: "published",
        featured: true,
    },
    {
        id: "nlp-sdoh-protocol",
        authors: ["Rajwal S", "Zhang Z", "Chen Y", "Rogers H", "Sarker A", "Xiao Y"],
        title: "Applications of Natural Language Processing and Large Language Models for Social Determinants of Health: Protocol for a Systematic Review",
        venue: "JMIR Research Protocols",
        year: 2025,
        doi: "10.2196/66094",
        status: "published",
    },
    {
        id: "buprenorphine-overdose-model",
        authors: ["Stringfellow EJ", "Lim TY", "DiGennaro C", "Zhang Z", "Paramasivam P", "Bearnot B", "Humphreys K", "Jalali MS"],
        title: "Long-Term Effects of Increasing Buprenorphine Treatment Seeking, Duration, and Capacity on Opioid Overdose Fatalities: A Model-based Analysis",
        venue: "Journal of Addiction Medicine",
        year: 2023,
        citation: "2023;17(4):439–446",
        doi: "10.1097/ADM.0000000000001153",
        status: "published",
    },
    {
        id: "buprenorphine-waivered-providers",
        authors: ["Stringfellow EJ", "Lim TY", "Dong H", "Zhang Z", "Jalali MS"],
        title: "The Association Between Longitudinal Trends in Receipt of Buprenorphine for Opioid Use Disorder and Buprenorphine-Waivered Providers in the United States",
        venue: "Addiction",
        year: 2023,
        citation: "2023;118(11):2215–2219",
        doi: "10.1111/add.16291",
        status: "published",
    },
    {
        id: "suicide-intent-disclosure",
        authors: ["Zhang Z", "Keyes KM", "Sarker A", "Tsai AC", "Brown T", "Mann JJ", "Xiao Y"],
        title: "Trends in Disclosure of Suicidal Intent Among U.S. Suicide Decedents, 2003–2023",
        venue: "",
        year: 2026,
        status: "in-preparation",
    },
];

export const TALKS: Talk[] = [
    {
        date: "2025-06",
        venue: "Society for Epidemiologic Research",
        title: "Use of the test-negative design to estimate the protective effect of a scalar immune measure: identification and estimation",
    },
    {
        date: "2024-10",
        venue: "IDWeek",
        title: "Clinical Experience with 16S Ribosomal RNA Gene PCR Sequencing of Normally Sterile Body Fluids and Tissues in Pediatric Patients",
    },
    {
        date: "2022-11",
        venue: "American Public Health Association Annual Meeting",
        title: "Trends in Suicide Deaths with and without Warning from 2003–2019: Identifying the Missing Link for Effective Suicide Prevention",
    },
];

export const AWARDS: Award[] = [{ title: "IDWeek Travel Award for Top Abstracts in Diagnostics", venue: "IDWeek", year: 2024 }];

export const isFirstAuthor = (publication: Publication) => publication.authors[0] === SELF_AUTHOR;

export const getPublication = (id: string) => PUBLICATIONS.find((publication) => publication.id === id);
