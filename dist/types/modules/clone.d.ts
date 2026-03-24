/**
 * Deep clones a value.
 *
 * Prefer the native `structuredClone` if available (Node.js 17+, modern browsers).
 *
 * This function is a fallback for environments where `structuredClone` is not supported.
 *
 * @example
 * const a = {};
 * const b = structuredClone(a);
 * a == b; // false
 *
 * @example
 * const a = {};
 * const b = clone(a);
 * a == b; // false
 */
export declare function clone<T>(obj: T): T;
//# sourceMappingURL=clone.d.ts.map