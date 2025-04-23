/**
 * and !== 0
 */
export function checkBit(a: number, b: number) {
  return (a & b) !== 0;
}
/**
 * or
 */
export function setBit(a: number, b: number) {
  return a | b;
}
/**
 * and-not
 */
export function clearBit(a: number, b: number) {
  return a & ~b;
}
/**
 * xor
 */
export function toggleBit(a: number, b: number) {
  return a ^ b;
}
