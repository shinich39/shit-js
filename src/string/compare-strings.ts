type Diff = [-1 | 0 | 1, string];

type CompareResult = {
  diffs: [-1 | 0 | 1, string][];
  matchRate: number;
  similarity: number;
  diceSimilarity: number;
  jaccardSimilarity: number;
  distance: number;
  normalizedDistance: number;
  matches: number;
  insertions: number;
  deletions: number;
};

/**
 * Myers algorithm
 *
 * -1 = deletion, 0 = match, 1 = insertion
 *
 * @example
 * diffStrings("Lorem", "ore"); // [[-1, "L"], [0, "ore"], [-1, "m"]]
 */
export function diffStrings(from: string, to: string): Diff[] {
  const n = from.length;
  const m = to.length;
  const max = n + m;

  // v array: maximum x coordinate reachable on each k-line
  const v: number[] = Array(2 * max + 1).fill(0);

  // array for path tracing
  const trace: number[][] = [];

  // find shortest edit path
  for (let d = 0; d <= max; d++) {
    trace.push([...v]);

    for (let k = -d; k <= d; k += 2) {
      let x: number;

      if (k === -d || (k !== d && v[k - 1 + max] < v[k + 1 + max])) {
        x = v[k + 1 + max];
      } else {
        x = v[k - 1 + max] + 1;
      }

      let y = x - k;

      while (x < n && y < m && from[x] === to[y]) {
        x++;
        y++;
      }

      v[k + max] = x;

      if (x >= n && y >= m) {
        return backtrack(from, to, trace, d);
      }
    }
  }

  // in theory, does not reach here.
  return [];
}

/**
 * @example
 * compareStrings(
 *   "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
 *   "sit amet, adipiscing"
 * );
 * // {
 * //   diffs: [[-1, "L"], [0, "ore"], [-1, "m"], ...],
 * //   matchRate: 0.35714285714285715,
 * //   similarity: 0.35714285714285715,
 * //   diceSimilarity: 0.5263157894736842,
 * //   jaccardSimilarity: 0.35714285714285715,
 * //   distance: 36,
 * //   normalizedDistance: 0.6428571428571429,
 * //   matches: 20,
 * //   insertions: 0,
 * //   deletions: 36
 * // }
 */
export function compareStrings(from: string, to: string): CompareResult {
  const diffs = diffStrings(from, to);

  let matches = 0;
  let insertions = 0;
  let deletions = 0;

  for (const [op, str] of diffs) {
    const len = str.length;
    if (op === 0) {
      matches += len;
    } else if (op === 1) {
      insertions += len;
    } else {
      deletions += len;
    }
  }

  const totalOperations = matches + insertions + deletions;
  const matchRate = totalOperations > 0 ? matches / totalOperations : 1;
  const similarity =
    Math.max(from.length, to.length) > 0 ? matches / Math.max(from.length, to.length) : 1;
  const diceSimilarity =
    from.length + to.length > 0 ? (2 * matches) / (from.length + to.length) : 1;
  const jaccardSimilarity =
    from.length + to.length - matches > 0 ? matches / (from.length + to.length - matches) : 1;
  const distance = insertions + deletions;
  const normalizedDistance =
    Math.max(from.length, to.length) > 0
      ? (insertions + deletions) / Math.max(from.length, to.length)
      : 0;

  return {
    diffs,
    matchRate,
    similarity,
    diceSimilarity,
    jaccardSimilarity,
    distance,
    normalizedDistance,
    matches,
    insertions,
    deletions,
  };
}

function backtrack(from: string, to: string, trace: number[][], depth: number): Diff[] {
  const result: Diff[] = [];

  let x = from.length;
  let y = to.length;
  const max = from.length + to.length;

  // current operation being accumulated
  let currentOp: -1 | 0 | 1 | null = null;
  let currentStr = "";

  const push = (op: -1 | 0 | 1, char: string) => {
    if (currentOp === op) {
      // if same operation, prepend character
      currentStr = char + currentStr;
    } else {
      // if different operation, push previous to result and start new
      if (currentOp !== null && currentStr) {
        result.push([currentOp, currentStr]);
      }
      currentOp = op;
      currentStr = char;
    }
  };

  // trace path in reverse
  for (let d = depth; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;

    let prevK: number;

    if (k === -d || (k !== d && v[k - 1 + max] < v[k + 1 + max])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = v[prevK + max];
    const prevY = prevX - prevK;

    // diagonal move (match)
    while (x > prevX && y > prevY) {
      x--;
      y--;
      push(0, from[x]);
    }

    if (d === 0) break;

    // vertical move (insertion)
    if (x === prevX) {
      y--;
      push(1, to[y]);
    } // horizontal move (deletion)
    else {
      x--;
      push(-1, from[x]);
    }
  }

  // add last accumulated operation
  if (currentOp !== null && currentStr) {
    result.push([currentOp, currentStr]);
  }

  return result.reverse();
}
