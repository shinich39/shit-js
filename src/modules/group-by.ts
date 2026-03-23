/**
 * @example
 * groupBy([1, 2, 2, 3], (value) => String(value)); // { "1": [1], "2": [2, 2], "3": [3] }
 * groupBy([], (value) => String(value)); // {}
 * groupBy([{id: 1, type: "a"}, {id: 2, type: "b"}, {id: 3, type: "a"}], (value) => value.type); // { "a": [{id: 1, type: "a"}, {id: 3, type: "a"}], "b": [{id: 2, type: "b"}] }
 */
export function groupBy<T>(
  arr: T[],
  fn: (value: T, index: number, array: T[]) => string | number,
): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = fn(item, i, arr);

    if (!result[key]) {
      result[key] = [item];
    } else {
      result[key].push(item);
    }
  }

  return result;
}
