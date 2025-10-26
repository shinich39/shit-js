/**
 * @example
 * const result = getMaxValue([1,2,3]); // 3
 */
export function getMaxValue(arr: number[]) {
  return arr.reduce((acc, cur) => {
    return acc > cur ? acc : cur;
  }, Number.MIN_SAFE_INTEGER);
}
/**
 * @example
 * const result = getMinValue([1,2,3]); // 1
 */
export function getMinValue(arr: number[]) {
  return arr.reduce((acc, cur) => {
    return acc < cur ? acc : cur;
  }, Number.MAX_SAFE_INTEGER);
}
/**
 * @example
 * const result = getSumValue([1,2,3]); // 6
 */
export function getSumValue(arr: number[]) {
  return arr.reduce((acc, cur) => acc + cur, 0);
}
/**
 * @example
 * const result = getMeanValue([1,2,3]); // 2
 */
export function getMeanValue(arr: number[]) {
  return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
}
/**
 * @example
 * const result = getModeValueWithCount(["a", "a", "b"]); // { count: 2, value: "a" }
 */
export function getModeValueWithCount<T>(arr: T[]) {
  if (arr.length === 0) {
    return;
  }

  const seen = new Map<T, number>();

  let maxValue, maxCount = 0;

  for (const v of arr) {
    const c = (seen.get(v) || 0) + 1;
    seen.set(v, c);

    if (maxCount < c) {
      maxCount = c;
      maxValue = v;
    }
  }

  return { count: maxCount, value: maxValue };
}
/**
 * @example
 * const result = getModeCount(["a", "a", "b"]); // 2
 */
export function getModeCount<T>(arr: T[]) {
  return getModeValueWithCount(arr)?.count || 0;
}
/**
 * @example
 * const result = getModeValue(["a", "a", "b"]); // "a"
 */
export function getModeValue<T>(arr: T[]) {
  return getModeValueWithCount(arr)?.value;
}
/**
 * @example
 * const result = getAllCombinations([1, 2]);
 * // [[1], [2], [1, 2]]
 */
export function getAllCombinations<T>(arr: T[]) {
  const result: T[][] = [];
  const n = arr.length;
  for (let i = 1; i < (1 << n); i++) {
    const combo = [];
    for (let j = 0; j < n; j++) {
      if ((i >> j) & 1) {
        combo.push(arr[j]);
      }
    }
    result.push(combo);
  }
  return result;
}
/**
 * @example
 * const result = getAllCases(["a", "b", "c"], [1]);
 * // [["a", 1],["b", 1],["c", 1]]
 */
export function getAllCases<T>(...args: T[][]): T[][] {
  if (args.length === 0) {
    return [];
  }

  const indexes: number[] = Array(args.length).fill(0);
  const result: T[][] = [[]];

  // create first plot
  for (let i = 0; i < args.length; i++) {
    if (args[i].length === 0) {
      throw new Error(`Invalid argument: argument cannot be empty`);
    }

    // append first item of arrays
    const item = args[i][indexes[i]];
    result[0].push(item);
  }

  let i = args.length - 1;
  while (true) {
    if (indexes[i] < args[i].length - 1) {
      // increase index
      indexes[i] += 1;

      // store values
      result.push(args.map((arg, idx) => arg[indexes[idx]]));

      i = args.length - 1;
    } else {
      // reset index
      indexes[i] = 0;

      // change place
      i--;

      if (i < 0) {
        return result;
      }
    }
  }
}
/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * 
 * @example
 * const result = shuffleArray([1, 2, 3]);
 * // [2, 1, 3]
 */
export function shuffleArray<T>(arr: T[]) {
  let i = arr.length;

  while (i > 0) {
    const j = Math.floor(Math.random() * i);

    i--;

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
/**
 * @example
 * const result = uniqueBy([1, 2, 2, 3], (item) => item);
 * // [1, 2, 3]
 */
export function uniqueBy<T>(
  arr: T[],
  func: (item: T, index: number, array: T[]) => any
): T[] {
  const map = new Map();

  for (let i = 0; i < arr.length; i++) {
    const key = func(arr[i], i, arr);

    if (!map.has(key)) {
      map.set(key, arr[i]);
    }
  }

  return Array.from(map.values()) as T[];
}
/**
 * @example
 * const result = groupBy([1, 2, 2, 3], (item) => item);
 * // { 1: [1], 2: [2, 2], 3: [3]}
 */
export function groupBy<T>(
  arr: T[],
  func: (item: T, index: number, array: T[]) => string
) {
  const group: Record<string, T[]> = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i],
      key = func(item, i, arr);
    if (!group[key]) {
      group[key] = [item];
    } else {
      group[key].push(item);
    }
  }
  return group;
}