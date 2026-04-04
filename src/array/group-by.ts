/**
 * Prefer the native `Object.groupBy` if available (Node.js 21+, modern browsers).
 *
 * This function is a fallback for older environments.
 *
 * @example
 * groupBy([1, 2, 2, 3], (value) => String(value));
 * // { "1": [1], "2": [2, 2], "3": [3] }
 *
 * groupBy([{id: 1, type: "a"}, {id: 2, type: "b"}, {id: 3, type: "a"}], (value) => value.type);
 * // { "a": [{id: 1, type: "a"}, {id: 3, type: "a"}], "b": [{id: 2, type: "b"}] }
 */
export function groupBy<T>(
  arr: Iterable<T>,
  fn: (value: T, index: number) => string | number,
): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  let i = 0;
  for (const item of arr) {
    const key = fn(item, i++);

    if (!result[key]) {
      result[key] = [item];
    } else {
      result[key].push(item);
    }
  }

  return result;
}
