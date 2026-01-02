/**
 * AND gate
 * 
 * @example
 * checkBit(0b1100, 0b1000); // true
 */
export function checkBit(a: number, b: number): boolean {
  return (a & b) !== 0;
}
/**
 * OR gate
 * 
 * @example
 * setBit(0b1100, 0b1000); // 0b1100
 */
export function setBit(a: number, b: number): number {
  return a | b;
}
/**
 * AND-NOT gate
 * 
 * @example
 * clearBit(0b1100, 0b1110); // 0b0000
 */
export function clearBit(a: number, b: number): number {
  return a & ~b;
}
/**
 * XOR gate
 * 
 * @example
 * toggleBit(0b1100, 0b1110); // 0b0010
 */
export function toggleBit(a: number, b: number): number {
  return a ^ b;
}
/**
 * @example
 * toBitString(0b1100); // "1100"
 * toBitString(0b1111); // "1111"
 * toBitString(0b1111, 4); // "1111"
 * toBitString(0b1111, 8); // "00001111"
 * toBitString(0b10101010); // "10101010"
 */
export function toBitString(bit: number, size?: number): string {
  return bit
    .toString(2)
    .padStart(Math.max(bit === 0 ? 1 : Math.floor(Math.log2(bit)) + 1, size || 1), "0");
}