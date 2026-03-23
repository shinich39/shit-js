/**
 * @example
 * const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * const b = "sit amet, adipiscing";
 * compareStrings(a, b);
 * // {
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
export declare function compareStrings(from: string, to: string): {
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
//# sourceMappingURL=compare-strings.d.ts.map