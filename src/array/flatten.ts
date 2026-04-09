/**
 * Prefer the native `Array.prototype.flat` if available (Node.js 11+, modern browsers).
 *
 * This function is a fallback for older environments.
 *
 * @example
 * flatten([1, [2, 3], 4]);
 * // [1, 2, 3, 4]
 *
 * flatten([[1, 2], [3, 4], [5, 6]]);
 * // [1, 2, 3, 4, 5, 6]
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  const result: T[] = [];

  for (const v of arr) {
    if (Array.isArray(v)) {
      for (const inner of v) {
        result.push(inner);
      }
    } else {
      result.push(v);
    }
  }

  return result;
}
