/**
 * @example
 * const rng = createMulberry32(39);
 *
 * rng.int(10, 100); // 16
 * rng.int(10, 100); // 77
 * rng.int(10, 100); // 58
 */
export declare function createMulberry32(initialSeed: number): {
    /** exclusive (e.g., min <= n < max) */
    float: (min: number, max: number) => number;
    /** exclusive (e.g., min <= n < max) */
    int: (min: number, max: number) => number;
};
//# sourceMappingURL=create-mulberry32.d.ts.map