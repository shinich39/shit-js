/**
 * @example
 * maxBy([{ end: 3 }, { end: 8 }, { end: 5 }], (r) => r.end);
 * // 8
 */
export function maxBy<T>(
  arr: Iterable<T>,
  fn: (value: T, index: number) => number,
): number | undefined {
  let result: number | undefined;

  let i = 0;
  for (const item of arr) {
    const value = fn(item, i++);

    if (result === undefined || value > result) {
      result = value;
    }
  }

  return result;
}
