/**
 * @example
 * mode(["a", "a", "b"]);
 * // { count: 2, value: "a" }
 *
 * mode(["a", "a", "b", "b", "b"]);
 * // { count: 3, value: "b" }
 */
export declare function mode<T>(arr: T[]): {
    count: number;
    value: T;
} | undefined;
//# sourceMappingURL=mode.d.ts.map