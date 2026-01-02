/**
 * @example
 * getMaxValue([1,2,3]); // 3
 */
export function getMaxValue(arr: number[]): number {
  return arr.reduce((acc, cur) => acc > cur ? acc : cur, Number.MIN_SAFE_INTEGER);
}
/**
 * @example
 * getMinValue([1,2,3]); // 1
 */
export function getMinValue(arr: number[]): number {
  return arr.reduce((acc, cur) => acc < cur ? acc : cur, Number.MAX_SAFE_INTEGER);
}
/**
 * @example
 * getSumValue([1,2,3]); // 6
 */
export function getSumValue(arr: number[]): number {
  return arr.reduce((acc, cur) => acc + cur, 0);
}
/**
 * @example
 * getMeanValue([1,2,3]); // 2
 */
export function getMeanValue(arr: number[]): number {
  return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
}
/**
 * @example
 * getModeValueWithCount(["a", "a", "b"]); // { count: 2, value: "a" }
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
 * getModeCount(["a", "a", "b"]); // 2
 */
export function getModeCount<T>(arr: T[]): number {
  return getModeValueWithCount(arr).count;
}
/**
 * @example
 * getModeValue(["a", "a", "b"]); // "a"
 */
export function getModeValue<T>(arr: T[]): T | undefined {
  return getModeValueWithCount(arr).value;
}
/**
 * @see https://lodash.com/docs/4.17.21#chunk
 * 
 * @example
 * splitArray([1,2,3,4,5], 3); // [[1,2,3],[4,5]]
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
 * @see https://lodash.com/docs/4.17.21#flatten
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 * 
 * @example
 * joinArray([1,2,3,[4,5]]); // [1,2,3,4,5]
 */
export function joinArray<T>(arr: (T | T[])[], depth = 1): T[] {
  const result: T[] = [];

  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...joinArray(item, depth - 1));
    } else {
      result.push(item as T);
    }
  }

  return result;
}
/**
 * Cartesian product
 * 
 * @example
 * getCombinations(["a", "b", "c"], [1]); // [["a", 1],["b", 1],["c", 1]]
 * getCombinations(); // []
 */
export function getCombinations<T>(...arrays: T[][]): T[][] {
  const filtered = arrays.filter(arr => arr.length > 0);

  if (filtered.length < 1) {
    return [];
  }
  
  return filtered.reduce<T[][]>((acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])), [[]]);
}
/**
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * 
 * @example
 * shuffleArray([1, 2, 3]); // [2, 1, 3]
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
 * uniqueBy([1, 2, 2, 3], (item) => item); // [1, 2, 3]
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
 * groupBy([1, 2, 2, 3], (item) => item); // { 1: [1], 2: [2, 2], 3: [3]}
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