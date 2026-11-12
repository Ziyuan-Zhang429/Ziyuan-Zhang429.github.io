import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

/** How one query-string value is read and written. `parse` returns undefined for anything invalid. */
export interface UrlCodec<T> {
    parse: (raw: string) => T | undefined;
    serialize: (value: T) => string;
}

export type UrlSchema = Record<string, UrlCodec<any>>;

export type UrlValues<S extends UrlSchema> = { [K in keyof S]?: S[K] extends UrlCodec<infer T> ? T : never };

/** Significant digits kept when writing numbers, so floating-point noise never reaches the URL. */
const NUMBER_PRECISION = 6;

/** Ready-made codecs. Out-of-range or malformed values are ignored, never clamped silently. */
export const URL_CODECS = {
    number: ({ min, max }: { min: number; max: number }): UrlCodec<number> => ({
        parse: (raw) => {
            const value = Number(raw);
            return raw.trim() !== "" && Number.isFinite(value) && value >= min && value <= max ? value : undefined;
        },
        serialize: (value) => String(Number(value.toPrecision(NUMBER_PRECISION))),
    }),
    integer: ({ min, max }: { min: number; max: number }): UrlCodec<number> => ({
        parse: (raw) => {
            const value = Number(raw);
            return /^-?\d+$/.test(raw) && value >= min && value <= max ? value : undefined;
        },
        serialize: (value) => String(Math.round(value)),
    }),
    boolean: {
        parse: (raw: string) => (raw === "1" ? true : raw === "0" ? false : undefined),
        serialize: (value: boolean) => (value ? "1" : "0"),
    } satisfies UrlCodec<boolean>,
    oneOf: <T extends string>(values: readonly T[]): UrlCodec<T> => ({
        parse: (raw) => (values.includes(raw as T) ? (raw as T) : undefined),
        serialize: (value) => value,
    }),
};

interface UseUrlStateOptions {
    /** Wait this long after the last change before writing, so dragging a slider writes once. */
    debounceMs?: number;
}

/**
 * Query-string persistence for a set of typed values.
 *
 * - `initial`: the schema's values parsed from the URL on first render (invalid or missing keys are left out).
 * - `write(values)`: replaces the schema's keys in the URL (undefined removes a key), keeping every other
 *   parameter and the hash. It uses `history.replaceState`, so it adds no history entries and doesn't
 *   re-render the route the way a router navigation would.
 */
export const useUrlState = <S extends UrlSchema>(schema: S, { debounceMs = 300 }: UseUrlStateOptions = {}) => {
    const [searchParams] = useSearchParams();

    // Read once: afterwards the component owns the state and only writes it back.
    const [initial] = useState(() => parseUrlValues(schema, searchParams));

    const timeout = useRef<number | undefined>(undefined);

    const write = useCallback(
        (values: UrlValues<S>) => {
            window.clearTimeout(timeout.current);
            timeout.current = window.setTimeout(() => {
                const url = withUrlValues(schema, values, window.location.href);
                if (url.href !== window.location.href) {
                    // Keep the router's history state (its key and index) so back/forward keep working.
                    window.history.replaceState(window.history.state, "", url);
                }
            }, debounceMs);
        },
        [schema, debounceMs],
    );

    useEffect(() => () => window.clearTimeout(timeout.current), []);

    return { initial, write };
};

export const parseUrlValues = <S extends UrlSchema>(schema: S, searchParams: URLSearchParams): UrlValues<S> => {
    const values: UrlValues<S> = {};
    for (const key of Object.keys(schema) as (keyof S & string)[]) {
        const raw = searchParams.get(key);
        if (raw === null) continue;
        const value = schema[key].parse(raw);
        if (value !== undefined) values[key] = value;
    }
    return values;
};

/** `href` with the schema's keys replaced by `values` (undefined removes a key); other parameters and the hash are kept. */
export const withUrlValues = <S extends UrlSchema>(schema: S, values: UrlValues<S>, href: string) => {
    const url = new URL(href);
    for (const key of Object.keys(schema)) {
        const value = values[key];
        if (value === undefined) url.searchParams.delete(key);
        else url.searchParams.set(key, schema[key].serialize(value));
    }
    return url;
};
