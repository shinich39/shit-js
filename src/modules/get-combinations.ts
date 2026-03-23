/**
 * Cartesian product
 *
 * @example
 * getCombinations(["a", "b", "c"], [1]); // [["a", 1],["b", 1],["c", 1]]
 * getCombinations(); // []
 */
export function getCombinations<T>(...arrays: T[][]): T[][] {
  const filtered = arrays.filter((arr) => arr.length > 0);

  if (filtered.length < 1) {
    return [];
  }

  return filtered.reduce<T[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]],
  );
}
