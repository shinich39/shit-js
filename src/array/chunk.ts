/**
 * @example
 * chunk([1,2,3,4,5], 3);
 * // [[1,2,3],[4,5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}
