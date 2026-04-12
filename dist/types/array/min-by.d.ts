/**
 * @example
 * minBy([{ start: 3 }, { start: 1 }, { start: 2 }], (r) => r.start);
 * // 1
 */
export declare function minBy<T>(arr: Iterable<T>, fn: (value: T, index: number) => number): number | undefined;
//# sourceMappingURL=min-by.d.ts.map