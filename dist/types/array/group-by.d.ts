/**
 * Prefer the native `Object.groupBy` if available (Node.js 21+, modern browsers).
 *
 * This function is a fallback for older environments.
 *
 * @example
 * groupBy([1, 2, 2, 3], (value) => String(value)); // { "1": [1], "2": [2, 2], "3": [3] }
 * groupBy([], (value) => String(value)); // {}
 * groupBy([{id: 1, type: "a"}, {id: 2, type: "b"}, {id: 3, type: "a"}], (value) => value.type); // { "a": [{id: 1, type: "a"}, {id: 3, type: "a"}], "b": [{id: 2, type: "b"}] }
 */
export declare function groupBy<T>(arr: Iterable<T>, fn: (value: T, index: number) => string | number): Record<string, T[]>;
//# sourceMappingURL=group-by.d.ts.map