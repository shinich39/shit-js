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
 * -1 = deletion, 0 = match, 1 = insertion
 *
 * @example
 * diffObjects(
 *   { user: { name: "Alice", age: 20 } },
 *   { user: { name: "Bob" }, city: "Seoul" }
 * );
 * // [
 * //   [-1, "user.name"],
 * //   [1, "user.name"],
 * //   [-1, "user.age"],
 * //   [0, "active"],
 * //   [1, "city"],
 * // ]
 */
export function diffObjects(a: any, b: any): Diff[] {
  const diffs: Diff[] = [];

  function fn(a: any, b: any, path: string) {
    if (Object.is(a, b)) {
      diffs.push([0, path]);
      return;
    }

    if (isObject(a) && isObject(b)) {
      const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

      for (const key of keys) {
        const nextPath = path ? `${path}.${key}` : key;

        if (!(key in a)) {
          diffs.push([1, nextPath]);
        } else if (!(key in b)) {
          diffs.push([-1, nextPath]);
        } else {
          fn(a[key], b[key], nextPath);
        }
      }
      return;
    }

    diffs.push([-1, path]);
    diffs.push([1, path]);
  }

  fn(a, b, "");

  return diffs;
}

/**
 * @example
 * const a = { user: { name: "Alice", age: 20 } };
 * const b = { user: { name: "Bob" }, city: "Seoul" };
 *
 * compareObjects(a, b);
 * // {
 * //   diffs: [
 * //     [-1, "user.name"],
 * //     [1, "user.name"],
 * //     [-1, "user.age"],
 * //     [0, "active"],
 * //     [1, "city"],
 * //   ],
 * //   matchRate: 0.2,
 * //   similarity: 0.2,
 * //   diceSimilarity: 0.3333333333333333,
 * //   jaccardSimilarity: 0.2,
 * //   distance: 4,
 * //   normalizedDistance: 0.8,
 * //   matches: 1,
 * //   insertions: 2,
 * //   deletions: 2
 * // }
 */
export function compareObjects(a: any, b: any): CompareResult {
  const diffs = diffObjects(a, b);

  let matches = 0;
  let insertions = 0;
  let deletions = 0;

  for (const [op] of diffs) {
    if (op === 0) {
      matches++;
    } else if (op === 1) {
      insertions++;
    } else if (op === -1) {
      deletions++;
    }
  }

  const total = matches + insertions + deletions;
  const similarity = total === 0 ? 1 : matches / total;
  const distance = insertions + deletions;
  const normalizedDistance = total === 0 ? 0 : distance / total;
  const diceSimilarity = total === 0 ? 1 : (2 * matches) / (2 * matches + insertions + deletions);
  const jaccardSimilarity = total === 0 ? 1 : matches / (matches + insertions + deletions);

  return {
    diffs,
    matchRate: similarity,
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

function isObject(arg: any): arg is Record<string, any> {
  return arg !== null && typeof arg === "object" && !Array.isArray(arg);
}
