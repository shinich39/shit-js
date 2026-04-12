type Interval = { start: number; end: number };

/**
 * @example
 * mergeIntervals([
 *   { start: 1, end: 5 },
 *   { start: 3, end: 8 },
 *   { start: 10, end: 12 },
 * ]);
 * // [{ start: 1, end: 8 }, { start: 10, end: 12 }]
 */
export function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) {
    return [];
  }

  const sorted = [...intervals]
    .filter((i) => i.start <= i.end) // drop invalid intervals
    .sort((a, b) => a.start - b.start);

  const result: Interval[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = result[result.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } // add a new interval
    else {
      result.push({ ...current });
    }
  }

  return result;
}
