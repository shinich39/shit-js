/**
 * @returns min <= n < max
 *
 * @example
 * randomFloat(0, 1); // 0.12451251251251
 */
export declare function randomFloat(min: number, max: number): number;
/**
 * @returns min <= n < max
 *
 * @example
 * randomInt(0, 10); // 5
 */
export declare function randomInt(min: number, max: number): number;
/**
 * @param charset default: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-"
 * @param size default: 1
 * @example
 * randomString("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", 1); // "a"
 * randomString(); // "a"
 */
export declare function randomString(charset?: string, size?: number): string;
//# sourceMappingURL=random.d.ts.map