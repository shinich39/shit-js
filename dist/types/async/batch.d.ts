/**
 * @example
 * const queue = [1, 2, 3, 4, 5].map((v) => () => Promise.resolve(v));
 * const result = await batch(queue, 3); // [1, 2, 3, 4, 5]
 */
export declare function batch<T>(tasks: (() => Promise<T>)[], limit?: number): Promise<T[]>;
//# sourceMappingURL=batch.d.ts.map