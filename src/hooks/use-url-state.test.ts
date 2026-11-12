import { describe, expect, it } from "vitest";
import { URL_CODECS, parseUrlValues, withUrlValues } from "./use-url-state";

describe("URL codecs", () => {
    it("number accepts values in range and rejects anything else", () => {
        const codec = URL_CODECS.number({ min: 0, max: 1 });
        expect(codec.parse("0.25")).toBe(0.25);
        expect(codec.parse("1")).toBe(1);
        for (const raw of ["", " ", "1.5", "-0.1", "abc", "NaN", "Infinity"]) expect(codec.parse(raw)).toBeUndefined();
    });

    it("number serializes without floating-point noise", () => {
        const codec = URL_CODECS.number({ min: 0, max: 1 });
        expect(codec.serialize(0.1 + 0.2)).toBe("0.3");
        expect(codec.serialize(0.000054)).toBe("0.000054");
    });

    it("integer rejects decimals and out-of-range values", () => {
        const codec = URL_CODECS.integer({ min: 0, max: 5 });
        expect(codec.parse("3")).toBe(3);
        for (const raw of ["3.5", "6", "-1", "1e1", ""]) expect(codec.parse(raw)).toBeUndefined();
    });

    it("boolean is 1/0 only", () => {
        expect(URL_CODECS.boolean.parse("1")).toBe(true);
        expect(URL_CODECS.boolean.parse("0")).toBe(false);
        expect(URL_CODECS.boolean.parse("true")).toBeUndefined();
        expect(URL_CODECS.boolean.serialize(true)).toBe("1");
    });

    it("oneOf accepts only listed values", () => {
        const codec = URL_CODECS.oneOf(["a", "b"] as const);
        expect(codec.parse("a")).toBe("a");
        expect(codec.parse("c")).toBeUndefined();
    });
});

describe("parseUrlValues / withUrlValues", () => {
    const schema = { n: URL_CODECS.integer({ min: 0, max: 9 }), flag: URL_CODECS.boolean };

    it("parses valid keys and drops invalid ones", () => {
        expect(parseUrlValues(schema, new URLSearchParams("n=4&flag=maybe&other=x"))).toEqual({ n: 4 });
    });

    it("replaces schema keys, removes undefined ones, and keeps other params and the hash", () => {
        const url = withUrlValues(schema, { n: 7, flag: undefined }, "https://example.org/?flag=1&keep=yes#simulation");
        expect(url.searchParams.get("n")).toBe("7");
        expect(url.searchParams.has("flag")).toBe(false);
        expect(url.searchParams.get("keep")).toBe("yes");
        expect(url.hash).toBe("#simulation");
    });
});
