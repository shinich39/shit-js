/**
 * @example
 * meanBy([{ start: 3 }, { start: 1 }, { start: 2 }], (r) => r.start);
 * // 2
 */
export declare function meanBy<T>(arr: Iterable<T>, fn: (value: T, index: number) => number): number;
//# sourceMappingURL=mean-by.d.ts.map