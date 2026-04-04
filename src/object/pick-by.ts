/**
 * @example
 * pickBy({ a: 1, b: 2, c: 3 }, (value) => value > 1);
 * // { b: 2, c: 3 }
 *
 * pickBy({ a: 1, b: null, c: "x" }, (value) => value);
 * // { a: 1, c: "x" }
 */
export function pickBy<T>(
  obj: Record<string, T>,
  fn: (key: string, value: T, object: Record<string, T>) => unknown,
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const key in obj) {
    if (fn(key, obj[key], obj)) {
      result[key] = obj[key];
    }
  }

  return result;
}
