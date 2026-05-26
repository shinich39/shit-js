/**
 * @example
 * meanBy([{ start: 3 }, { start: 1 }, { start: 2 }], (value) => value.start);
 * // 2
 */
export function meanBy<T>(arr: Iterable<T>, fn: (value: T, index: number) => number): number {
  let result: number = 0;

  let i = 0;
  for (const item of arr) {
    result += fn(item, i++);
  }

  if (i === 0) {
    return 0;
  }

  return result / i;
}
