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
 * @returns bytes
 */
export declare function calcStringSize(str: string): number;
export declare function toBytes(bytes: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): number;
export declare function toFileSize(bytes: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): number;
export declare function humanizeFileSize(num: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): string;
export declare function getContainedSize(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number): [number, number];
export declare function getCoveredSize(srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number): [number, number];
export declare function getAdjustedSize(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number, minWidth: number, minHeight: number): [number, number];
//# sourceMappingURL=number.d.ts.map