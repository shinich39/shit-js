/**
 * @example
 * modeBy([{ start: 3 }, { start: 3 }, { start: 2 }], (value) => value.start);
 * // [
 * //   { value: 3, count: 2 },
 * //   { value: 2, count: 1 },
 * // ]
 */
export declare function modeBy<T, U>(arr: Iterable<T>, fn: (value: T, index: number) => U): {
    count: number;
    value: U;
}[];
//# sourceMappingURL=mode-by.d.ts.map