/**
 * @returns min <= n < max
 */
export declare function getRandomFloat(min: number, max: number): number;
/**
 * @returns min <= n < max
 */
export declare function getRandomInt(min: number, max: number): number;
export declare function getLengthFromInt(num: number): number;
export declare function getLengthFromFloat(num: number): number;
/**
 * mulberry32 PRNG (Pseudo Random Number Generator)
 *
 * https://github.com/cprosche/mulberry32
 */
export declare function getRandomSeed(seed: number): number;
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
export declare function toBytes(num: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): number;
export declare function toFileSize(bytes: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): number;
export declare function humanizeFileSize(num: number, format: "Bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"): string;
export declare function getContainedSize(sourceWidth: number, sourceHeight: number, destinationWidth: number, destinationHeight: number): [number, number];
export declare function getCoveredSize(sourceWidth: number, sourceHeight: number, destinationWidth: number, destinationHeight: number): [number, number];
export declare function getAdjustedSize(sourceWidth: number, sourceHeight: number, maxWidth: number, maxHeight: number, minWidth: number, minHeight: number): [number, number];
//# sourceMappingURL=number.d.ts.map