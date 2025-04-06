export function parseNumbers(arr: number[]) {
  if (arr.length === 0) {
    throw new Error(`Invalid argument: arr.length === 0`);
  }

  let max = Number.MIN_SAFE_INTEGER,
    min = Number.MAX_SAFE_INTEGER,
    mode = 0, // most frequent value
    modeCount = 0,
    sum = 0,
    seen: Record<string, number> = {};

  for (const num of arr) {
    if (max < num) {
      max = num;
    }

    if (min > num) {
      min = num;
    }

    if (!seen[num]) {
      seen[num] = 1;
    } else {
      seen[num] += 1;
    }

    if (modeCount < seen[num]) {
      modeCount = seen[num];
      mode = num;
    }

    sum += num;
  }

  return {
    max,
    min,
    sum,
    mean: sum / arr.length, // average, arithmetic mean
    mode,
    modeCount,
  };
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

export function plotBy(...args: any[][]) {
  if (args.length === 0) {
    return [];
  }
  for (const arg in args) {
    if (arg.length === 0) {
      throw new Error(`Invalid argument: argument cannot be empty`);
    }
  }

  const indexes: number[] = Array(args.length).fill(0);
  const result = [args.map((arg, idx) => indexes[idx])];

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

export function groupBy<T>(arr: T[], func: (arg: T) => string) {
  const group: Record<string, T[]> = {};
  for (const obj of arr) {
    const key = func(obj);
    if (!group[key]) {
      group[key] = [obj];
    } else {
      group[key].push(obj);
    }
  }
  return group;
}
