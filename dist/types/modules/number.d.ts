/**
 * @returns min <= n < max
 *
 * @example
 * const result = generateFloat(0, 1); // 0.12451251251251
 * const result = generateFloat(0, 1, 0); // 0.26642920868471265
 * const result = generateFloat(0, 1, 10); // 0.5019920116756111
 * const result = generateFloat(0, 1, 100); // 0.2043598669115454
 */
export declare function generateFloat(min: number, max: number, seed?: number | null | undefined): number;
/**
 * @returns min <= n < max
 *
 * @example
 * const result = generateInt(0, 10); // 5
 * const result = generateInt(0, 10, 0); // 2
 * const result = generateInt(0, 10, 10); // 5
 * const result = generateInt(0, 10, 100); // 2
 */
export declare function generateInt(min: number, max: number, seed?: number | null | undefined): number;
/**
 * @example
 * const result = getLengthFromInt(10); // 2
 * const result = getLengthFromInt(100); // 3
 */
export declare function getLengthFromInt(num: number): number;
/**
 * @example
 * const result = getLengthFromFloat(1.2); // 2
 * const result = getLengthFromFloat(1.23); // 3
 */
export declare function getLengthFromFloat(num: number): number;
/**
 * @returns min <= n <= max
 *
 * @example
 * const result = getClampedNumber(5, 0, 10); // 5
 * const result = getClampedNumber(10, 0, 10), 1; // 10
 */
export declare function getClampedNumber(num: number, min: number, max: number): number;
/**
 * @returns min <= n < max
 *
 * @example
 * const result = getLoopedNumber(-5, 0, 10); // 5
 * const result = getLoopedNumber(-2.5, 0, 10); // 7.5
 * const result = getLoopedNumber(0, 0, 10); // 0
 * const result = getLoopedNumber(5, 0, 10); // 5
 * const result = getLoopedNumber(10, 0, 10); // 0
 * const result = getLoopedNumber(20, 0, 10); // 0
 */
export declare function getLoopedNumber(num: number, min: number, max: number): number;
/**
 * @example
 * const result = toBytes(1, "MB"); // 1048576
 */
export declare function toBytes(bytes: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): number;
/**
 * @example
 * const result = toFileSize(1024 * 1024, "MB"); // 1
 */
export declare function toFileSize(bytes: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): number;
/**
 * @example
 * const result = humanizeFileSize(1024 * 1024, "Bytes"); // "1.00 MB"
 */
export declare function humanizeFileSize(num: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): string;
/**
 * @example
 * const result = getContainedSize(100, 100, 200, 100); // [100, 100]
 */
export declare function getContainedSize(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number): [number, number];
/**
 * @example
 * const result = getCoveredSize(100, 100, 200, 100); // [200, 200]
 */
export declare function getCoveredSize(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number): [number, number];
/**
 * @example
 * const result = getAdjustedSize(175, 175, 200, 200, 100, 100); // [175, 175]
 */
export declare function getAdjustedSize(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number, minWidth: number, minHeight: number): [number, number];
export declare function getLogScore(total: number, current: number): number;
export declare function getPowerScore(total: number, current: number, alpha?: number): number;
//# sourceMappingURL=number.d.ts.map