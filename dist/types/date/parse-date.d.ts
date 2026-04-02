type ParseResult = {
    YYYY: string;
    YY: string;
    M: string;
    MM: string;
    D: string;
    DD: string;
    d: string;
    E: string;
    EEEE: string;
    H: string;
    HH: string;
    h: string;
    hh: string;
    m: string;
    mm: string;
    s: string;
    ss: string;
    SSS: string;
    A: string;
    a: string;
    Q: string;
    Z: string;
    ZZ: string;
    W: string;
    WW: string;
};
/**
 * @example
 * parseDate(new Date("2026-01-01T00:00:00"));
 * // { YYYY: "2026", YY: "26", M: "1", MM: "01", D: "1", DD: "01", ... }
 * parseDate("2026-03-15T14:30:00");
 * // { H: "14", HH: "14", h: "2", hh: "02", A: "PM", a: "pm", Q: "1", ... }
 * parseDate(0);
 * // { YYYY: "1970", MM: "01", DD: "01", ... }
 * parseDate("invalid");
 * // Error: Invalid date: invalid
 */
export declare function parseDate(date: Date | number | string): ParseResult;
export {};
//# sourceMappingURL=parse-date.d.ts.map