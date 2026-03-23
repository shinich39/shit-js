/**
 * Myers algorithm
 *
 * \-1: Number of deleted characters
 *
 * 0: Number of matched characters
 *
 * 1: Number of inserted characters
 *
 * @example
 * getDiffs("Lorem", "ore"); // [[-1, "L"], [0, "ore"], [-1, "m"]]
 */
export function getDiffs(from: string, to: string): [number, string][] {
  const backtrack = (
    from: string,
    to: string,
    trace: number[][],
    d: number,
  ): [-1 | 0 | 1, string][] => {
    const result: [-1 | 0 | 1, string][] = [];

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
    for (let depth = d; depth >= 0; depth--) {
      const v = trace[depth];
      const k = x - y;

      let prevK: number;

      if (k === -depth || (k !== depth && v[k - 1 + max] < v[k + 1 + max])) {
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

      if (depth === 0) break;

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
  };

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
