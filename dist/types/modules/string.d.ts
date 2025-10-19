/**
 * find top level string
 *
 * skip inside of bracket and quotes
 */
export declare function findString(str: string, target: string, fromIndex?: number): number;
export declare function getUUID(): string;
export declare function getRandomChar(charset: string): string;
export declare function getRandomString(charset: string, size: number): string;
export declare function getInts(str: string): number[];
export declare function getFloats(str: string): number[];
export declare function getXORString(str: string, salt: string): string;
/**
 * change full-width characters to half-width characters
 */
export declare function normalizeString(str: string): string;
/**
 * @param str "/abc/gi"
 */
export declare function toRegExp(str: string): RegExp;
/**
 * myers Algorithm
 *
 * \-1: number of deleted characters
 *
 * 0: number of matched characters
 *
 * 1: number of inserted characters
 *
 * @example
 * const result = compareString("Lorem", "ore"); // [[-1, "L"], [0, "ore"], [-1, "m"]]
 */
export declare function compareString(from: string, to: string): [0 | 1 | -1, string][];
export declare function matchStrings(from: string, to: string): {
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
//# sourceMappingURL=string.d.ts.map