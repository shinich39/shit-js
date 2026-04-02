/**
 * Cartesian product
 *
 * @example
 * product(["a", "b", "c"], [1]); // [["a", 1],["b", 1],["c", 1]]
 * product(); // []
 */
export function cartesianProduct<T>(...arrays: T[][]): T[][] {
  const filtered = arrays.filter((arr) => arr.length > 0);

  if (filtered.length < 1) {
    return [];
  }

  return filtered.reduce<T[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]],
  );
}
