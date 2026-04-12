/**
 * @example
 * maxBy([{ end: 3 }, { end: 8 }, { end: 5 }], (r) => r.end);
 * // 8
 */
export declare function maxBy<T>(arr: Iterable<T>, fn: (value: T, index: number) => number): number | undefined;
//# sourceMappingURL=max-by.d.ts.map