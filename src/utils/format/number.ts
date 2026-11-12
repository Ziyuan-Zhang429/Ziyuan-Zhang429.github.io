/** Every rate and ratio in the simulator is shown to the same precision. */
export const SIGNIFICANT_DIGITS = 2;

/** 0.0054% · 0.47% · 4.6% · 15% · 95% */
export const PERCENT_FORMAT = { style: "percent", maximumSignificantDigits: SIGNIFICANT_DIGITS } as const;

/** 1.3 · 2.8 · 13 · 0.21 */
export const DECIMAL_FORMAT = { maximumSignificantDigits: SIGNIFICANT_DIGITS } as const;

/** "7.5 days" · "16.4 days" · "8 days" */
export const DAYS_FORMAT = { style: "unit", unit: "day", unitDisplay: "long", maximumFractionDigits: 1 } as const;
