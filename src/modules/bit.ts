export class Bit {
  /**
   * include
   */
  static check(a: number, b: number) {
    return !!(a & b);
  }
  /**
   * or
   */
  static set(a: number, b: number) {
    return a | b;
  }
  /**
   * and-not
   */
  static clear(a: number, b: number) {
    return a & ~b;
  }
  /**
   * xor
   */
  static invert(a: number, b: number) {
    return a ^ b;
  }
}
