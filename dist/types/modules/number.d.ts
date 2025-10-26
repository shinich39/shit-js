/**
 * @returns min <= n < max
 */
export declare function getRandomFloat(min: number, max: number): number;
/**
 * Mulberry32 PRNG (Pseudo Random Number Generator)
 *
 * @returns min <= n < max
 */
export declare function getRandomFloatWithSeed(min: number, max: number, seed: number): number;
/**
 * @returns min <= n < max
 */
export declare function getRandomInt(min: number, max: number): number;
/**
 * Mulberry32 PRNG (Pseudo Random Number Generator)
 *
 * @returns min <= n < max
 */
export declare function getRandomIntWithSeed(min: number, max: number, seed: number): number;
export declare function getLengthFromInt(num: number): number;
export declare function getLengthFromFloat(num: number): number;
/**
 * @returns min <= n <= max
 */
export declare function getClampedNumber(num: number, min: number, max: number): number;
/**
 * @returns min <= n < max
 */
export declare function getLoopedNumber(num: number, min: number, max: number): number;
/**
 * @example
 * const result = toBytes(1, "MB"); // 1024 * 1024
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
//# sourceMappingURL=number.d.ts.map