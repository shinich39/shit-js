/**
 * Prefer the native `Array.prototype.flat` if available (Node.js 11+, modern browsers).
 *
 * This function is a fallback for older environments.
 *
 * @example
 * flattenArray([1, [2, 3], 4]);
 * // [1, 2, 3, 4]
 *
 * flattenArray([[1, 2], [3, 4], [5, 6]]);
 * // [1, 2, 3, 4, 5, 6]
 */
export declare function flattenArray<T>(arr: (T | T[])[]): T[];
//# sourceMappingURL=flatten-array.d.ts.map