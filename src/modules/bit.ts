export function bitwise(a: number) {
  return {
    equal: (b: number) => !!(a & b),
    set: (b: number) => a |= b, // or
    unset: (b: number) => a &= ~b, // nand
    invert: (b: number) => a ^= b, // xor
  }
}