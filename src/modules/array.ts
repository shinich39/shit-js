export function getMaxValue(arr: number[]) {
  return arr.reduce((acc, cur) => {
    return acc > cur ? acc : cur;
  }, Number.MIN_SAFE_INTEGER);
}

export function getMinValue(arr: number[]) {
  return arr.reduce((acc, cur) => {
    return acc < cur ? acc : cur;
  }, Number.MAX_SAFE_INTEGER);
}

export function getSumValue(arr: number[]) {
  return arr.reduce((acc, cur) => acc + cur, 0);
}

export function getMeanValue(arr: number[]) {
  return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
}

export function getModeValueWithCount(arr: any[]) {
  if (arr.length === 0) {
    return {
      count: undefined,
      value: undefined,
    };
  }

  const seen: Record<string, number> = {};

  let value,
    count = 0;

  for (const item of arr) {
    seen[item] = seen[item] ? seen[item] + 1 : 1;

    if (count < seen[item]) {
      count = seen[item];
      value = item;
    }
  }

  return { count, value };
}

export function getModeCount(arr: any[]) {
  return getModeValueWithCount(arr).count;
}

export function getModeValue(arr: any[]) {
  return getModeValueWithCount(arr).value;
}
/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
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

export function plotBy(...args: any[][]): number[][] {
  if (args.length === 0) {
    return [];
  }

  const indexes: number[] = Array(args.length).fill(0);

  const result: number[][] = [[]];

  for (let i = 0; i < args.length; i++) {
    if (args[i].length === 0) {
      throw new Error(`Invalid argument: argument cannot be empty`);
    }

    // create first plot
    // append first item of arrays
    result[0].push(indexes[i]);
  }

  let i = args.length - 1;
  while (true) {
    if (indexes[i] < args[i].length - 1) {
      // increase index
      indexes[i] += 1;

      // store indexes
      result.push(args.map((arg, idx) => indexes[idx]));

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
