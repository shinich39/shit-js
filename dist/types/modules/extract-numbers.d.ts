/**
 * @example
 * extractNumbers("ftp://192.168.0.1 1 2 3"); // [192.168, 0.1, 1, 2, 3]
 */
export declare function extractNumbers(str: string): number[];
/**
 * @example
 * extractFloats("ftp://192.168.0.1 1 2 3"); // [192.168, 0.1]
 */
export declare function extractFloats(str: string): number[];
/**
 * @example
 * extractInts("ftp://192.168.0.1 1 2 3"); // [192, 168, 0, 1, 1, 2, 3]
 */
export declare function extractInts(str: string): number[];
//# sourceMappingURL=extract-numbers.d.ts.map