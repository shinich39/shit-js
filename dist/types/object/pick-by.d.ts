/**
 * @example
 * pickBy({ a: 1, b: 2, c: 3 }, (value) => value > 1);
 * // { b: 2, c: 3 }
 *
 * pickBy({ a: 1, b: null, c: "x" }, (value) => value);
 * // { a: 1, c: "x" }
 */
export declare function pickBy<T>(obj: Record<string, T>, fn: (key: string, value: T, object: Record<string, T>) => unknown): Record<string, T>;
//# sourceMappingURL=pick-by.d.ts.map