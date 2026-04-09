/**
 * Tally occurrences of object values
 *
 * Counts the frequency of each value in an array, sorted by count in ascending order.
 *
 * @example
 * tally([1, 3, 2, 3, 2, 3, 4]);
 * // [
 * //   { value: 1, count: 1 },
 * //   { value: 4, count: 1 },
 * //   { value: 2, count: 2 },
 * //   { value: 3, count: 3 },
 * // ]
 */
export declare function tally<T>(arr: T[]): {
    count: number;
    value: T;
}[];
//# sourceMappingURL=tally.d.ts.map