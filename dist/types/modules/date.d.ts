/**
 * @example
 * const result = parseDate(new Date());
 * // {
 * //   YYYY: '2025',
 * //   YY: '25',
 * //   M: '10',
 * //   MM: '10',
 * //   D: '27',
 * //   DD: '27',
 * //   d: '1',
 * //   E: 'Mon',
 * //   EEEE: 'Monday',
 * //   H: '18',
 * //   HH: '18',
 * //   h: '6',
 * //   hh: '06',
 * //   m: '4',
 * //   mm: '04',
 * //   s: '37',
 * //   ss: '37',
 * //   SSS: '022',
 * //   A: 'PM',
 * //   a: 'pm',
 * //   Q: '4',
 * //   Z: '+09:00',
 * //   ZZ: '+0900',
 * //   W: '44',
 * //   WW: '44'
 * // }
 */
export declare function parseDate(date: Date | number | string): {
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
//# sourceMappingURL=date.d.ts.map