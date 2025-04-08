/**
 * - equals: and
 * - set: or
 * - unset: a and (not b)
 * - invert: xor
 * @param a
 * @returns
 */
export declare function bitwise(a: number): {
    equals: (b: number) => boolean;
    set: (b: number) => number;
    unset: (b: number) => number;
    invert: (b: number) => number;
};
//# sourceMappingURL=bit.d.ts.map