/**
 * @example
 * const uuid = getUUID(); // "ce0e915d-0b16-473c-bd89-d3d7492bb1b9"
 */
export declare function getUUID(): string;
export declare function getRandomChar(charset: string): string;
/**
 * @example
 * const result = getRandomString("abc", 1); // "a"
 */
export declare function getRandomString(charset: string, size: number): string;
export declare function getInts(str: string): number[];
export declare function getFloats(str: string): number[];
/**
 * @example
 * const encrypted = getXORString("text", "this is salt!");
 * const decrypted = getXORString(encrypted, "this is salt!"); // "text"
 */
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
/**
 * @example
 * const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
 * const b = "sit amet, adipiscing";
 * const result = matchStrings(a, b);
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
/**
 * find top level string
 *
 * skip inside of bracket and quotes
 *
 * @example
 * const result = findString("<div>div</div>", "d"); // 5
 */
export declare function findString(str: string, target: string, fromIndex?: number): number;
/**
 * @example
 * const result = splitString("[artist] title (subtitle (subsubtitle)) vol.1.zip");
 * // ['artist', ' title ', 'subtitle ', 'subsubtitle', ' vol.1.zip']
 */
export declare function splitString(str: string, pairs?: Record<string, string>): string[];
//# sourceMappingURL=string.d.ts.map