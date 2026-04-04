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
export declare function diffStrings(from: string, to: string): Diff[];
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
export declare function compareStrings(from: string, to: string): CompareResult;
export {};
//# sourceMappingURL=compare-strings.d.ts.map