/**
 * @example
 * modeBy([{ start: 3 }, { start: 3 }, { start: 2 }], (value) => value.start);
 * // [
 * //   { value: 3, count: 2 },
 * //   { value: 2, count: 1 },
 * // ]
 */
export function modeBy<T, U>(
  arr: Iterable<T>,
  fn: (value: T, index: number) => U,
): { count: number; value: U }[] {
  const seen = new Map<U, { count: number; value: U }>();

  let i = 0;
  for (const item of arr) {
    const value = fn(item, i++);

    const prev = seen.get(value);

    if (prev) {
      prev.count++;
      continue;
    }

    seen.set(value, { value, count: 1 });
  }

  return Array.from(seen.values()).sort((a, b) => a.count - b.count);
}
