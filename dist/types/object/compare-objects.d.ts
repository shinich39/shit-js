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
export declare function diffObjects(a: any, b: any): Diff[];
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
export declare function compareObjects(a: any, b: any): CompareResult;
export {};
//# sourceMappingURL=compare-objects.d.ts.map