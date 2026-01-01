/**
 * @example
 * const result = getMaxValue([1,2,3]); // 3
 */
export function getMaxValue(arr: number[]): number {
  return arr.reduce((acc, cur) => acc > cur ? acc : cur, Number.MIN_SAFE_INTEGER);
}
/**
 * @example
 * const result = getMinValue([1,2,3]); // 1
 */
export function getMinValue(arr: number[]): number {
  return arr.reduce((acc, cur) => acc < cur ? acc : cur, Number.MAX_SAFE_INTEGER);
}
/**
 * @example
 * const result = getSumValue([1,2,3]); // 6
 */
export function getSumValue(arr: number[]): number {
  return arr.reduce((acc, cur) => acc + cur, 0);
}
/**
 * @example
 * const result = getMeanValue([1,2,3]); // 2
 */
export function getMeanValue(arr: number[]): number {
  return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
}
/**
 * @example
 * const result = getModeValueWithCount(["a", "a", "b"]); // { count: 2, value: "a" }
 */
export function getModeValueWithCount<T>(arr: T[]): { count: number, value: T | undefined } {
  const seen = new Map<T, number>();

  let maxValue;
  let maxCount = 0;

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
export function getModeCount<T>(arr: T[]): number {
  return getModeValueWithCount(arr).count;
}
/**
 * @example
 * const result = getModeValue(["a", "a", "b"]); // "a"
 */
export function getModeValue<T>(arr: T[]): T | undefined {
  return getModeValueWithCount(arr).value;
}
/**
 * @example
 * const result = splitArray([1,2,3,4,5,6,7,8,9,10], 3); // [[1,2,3],[4,5,6],[7,8,9],[10]]
 */
export function splitArray<T>(arr: T[], size: number): T[][] {
  return arr.reduce<T[][]>((acc, curr) => {
    if (!acc[acc.length - 1] || acc[acc.length - 1].length >= size) {
      acc.push([curr]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  }, []);
}
/**
 * @example
 * const result = getCombinations([1, 2]);
 * // [[1], [2], [1, 2]]
 */
export function getCombinations<T>(arr: T[]): T[][] {
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
 * const result = getCases(["a", "b", "c"], [1]);
 * // [["a", 1],["b", 1],["c", 1]]
 */
export function getCases<T>(...args: T[][]): T[][] {
  args = args.filter((arg) => arg.length > 0);

  if (args.length === 0) {
    return [];
  }

  const indexes: number[] = Array(args.length).fill(0);
  const result: T[][] = [[]];

  // Append first item of arrays
  for (let i = 0; i < args.length; i++) {
    const item = args[i][indexes[i]];
    result[0].push(item);
  }

  let i = args.length - 1;
  
  while (true) {
    if (indexes[i] < args[i].length - 1) {
      // Increase index
      indexes[i] += 1;

      // Store values
      result.push(args.map((arg, idx) => arg[indexes[idx]]));

      i = args.length - 1;
    } else {
      // Reset index
      indexes[i] = 0;

      // Change place
      i--;

      if (i < 0) {
        return result;
      }
    }
  }
}
/**
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * 
 * @example
 * const result = shuffleArray([1, 2, 3]);
 * // [2, 1, 3]
 */
export function shuffleArray<T>(arr: T[]): T[] {
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
  fn: (item: T, index: number, array: T[]) => any,
): T[] {
  const map = new Map();

  for (let i = 0; i < arr.length; i++) {
    const key = fn(arr[i], i, arr);

    if (!map.has(key)) {
      map.set(key, arr[i]);
    }
  }

  return Array.from(map.values());
}
/**
 * @example
 * const result = groupBy([1, 2, 2, 3], (item) => item);
 * // { 1: [1], 2: [2, 2], 3: [3]}
 */
export function groupBy<T>(
  arr: T[],
  fn: (item: T, index: number, array: T[]) => string
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