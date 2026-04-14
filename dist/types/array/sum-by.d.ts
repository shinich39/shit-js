/**
 * @example
 * sumBy([{ start: 3 }, { start: 1 }, { start: 2 }], (r) => r.start);
 * // 6
 */
export declare function sumBy<T>(arr: Iterable<T>, fn: (value: T, index: number) => number): number;
//# sourceMappingURL=sum-by.d.ts.map