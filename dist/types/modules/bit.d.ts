/**
 * AND gate
 *
 * @example
 * checkBit(0b1100, 0b1000); // true
 */
export declare function checkBit(a: number, b: number): boolean;
/**
 * OR gate
 *
 * @example
 * setBit(0b1100, 0b1000); // 0b1100
 */
export declare function setBit(a: number, b: number): number;
/**
 * AND-NOT gate
 *
 * @example
 * clearBit(0b1100, 0b1110); // 0b0000
 */
export declare function clearBit(a: number, b: number): number;
/**
 * XOR gate
 *
 * @example
 * toggleBit(0b1100, 0b1110); // 0b0010
 */
export declare function toggleBit(a: number, b: number): number;
/**
 * @example
 * toBitString(0b1100); // "1100"
 * toBitString(0b1111); // "1111"
 * toBitString(0b1111, 4); // "1111"
 * toBitString(0b1111, 8); // "00001111"
 * toBitString(0b10101010); // "10101010"
 */
export declare function toBitString(bit: number, size?: number): string;
//# sourceMappingURL=bit.d.ts.map