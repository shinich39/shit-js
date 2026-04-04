/**
 * @example
 * uniqueBy([1, 2, 2, 3], (value) => value);
 * // [1, 2, 3]
 */
export function uniqueBy<T>(arr: T[], fn: (value: T, index: number, array: T[]) => any): T[] {
  const map = new Map();

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = fn(arr[i], i, arr);

    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
}
