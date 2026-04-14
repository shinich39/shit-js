/**
 * @example
 * const rng = createMulberry32(39);
 *
 * rng(10, 100); // 16.73...
 * rng(10, 100); // 77.76...
 * rng(10, 100); // 58.69...
 */
export declare function createMulberry32(initialSeed: number): (min: number, max: number) => number;
//# sourceMappingURL=create-mulberry32.d.ts.map