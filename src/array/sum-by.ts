/**
 * @example
 * sumBy([{ start: 3 }, { start: 1 }, { start: 2 }], (r) => r.start);
 * // 6
 */
export function sumBy<T>(arr: Iterable<T>, fn: (value: T, index: number) => number): number {
  let result: number = 0;

  let i = 0;
  for (const item of arr) {
    result += fn(item, i++);
  }

  return result;
}
