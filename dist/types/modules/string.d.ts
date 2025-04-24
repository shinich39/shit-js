/**
 * find top level string
 *
 * skip inside of bracket and quotes
 */
export declare function findString(str: string, target: string, fromIndex?: number): number;
export declare function getUUID(): string;
export declare function getRandomCharacter(charset: string): string;
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
 * analyze diff between two strings
 *
 * \-1: Number of deleted characters
 *
 * 0: Number of matched characters
 *
 * 1: Number of inserted characters
 */
export declare function compareString(from: string, to: string): [0 | 1 | -1, string][];
//# sourceMappingURL=string.d.ts.map