/**
 * @example
 * minBy([{ start: 3 }, { start: 1 }, { start: 2 }], (r) => r.start);
 * // 1
 */
export function minBy<T>(
  arr: Iterable<T>,
  fn: (value: T, index: number) => number,
): number | undefined {
  let result: number | undefined;

  let i = 0;
  for (const item of arr) {
    const value = fn(item, i++);

    if (result === undefined || value < result) {
      result = value;
    }
  }

  return result;
}
