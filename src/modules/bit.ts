/**
 * - equals: and
 * - set: or
 * - unset: a and (not b)
 * - invert: xor
 * @param a
 * @returns
 */
export function bitwise(a: number) {
  return {
    equals: (b: number) => !!(a & b),
    set: (b: number) => (a |= b),
    unset: (b: number) => (a &= ~b),
    invert: (b: number) => (a ^= b),
  };
}
