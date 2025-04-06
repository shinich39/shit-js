export declare function generateUuid(seed?: number): string;
/**
 * change full-width characters to half-width characters
 */
export declare function normalizeString(str: string): string;
/**
 * https://www.w3schools.com/xml/xml_syntax.asp
 */
export declare function escapeXML(str: string, whitespace?: boolean): string;
/**
 * @param str "/abc/gi"
 */
export declare function toRegExp(str: string): RegExp;
/**
 * https://www.w3schools.com/xml/xml_syntax.asp
 */
export declare function unescapeXML(str: string): string;
/**
 * analyze diff between two strings
 *
 * - \-1: Number of deleted characters
 * - 0: Number of matched characters
 * - 1: Number of inserted characters
 */
export declare function compareString(from: string, to: string): [0 | 1 | -1, string][];
//# sourceMappingURL=string.d.ts.map