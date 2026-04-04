/**
 * @example
 * mode(["a", "a", "b"]);
 * // { count: 2, value: "a" }
 *
 * mode(["a", "a", "b", "b", "b"]);
 * // { count: 3, value: "b" }
 */
export function mode<T>(arr: T[]): { count: number; value: T | undefined } {
  const seen = new Map<T, number>();

  let maxValue: T | undefined;
  let maxCount: number = 0;

  for (const v of arr) {
    const c = (seen.get(v) || 0) + 1;

    seen.set(v, c);

    if (maxCount < c) {
      maxCount = c;
      maxValue = v;
    }
  }

  return { count: maxCount, value: maxValue };
}
