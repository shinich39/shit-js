/**
 * @example
 * toLzw("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
 * // [
 * //    76, 111, 114, 101, 109,  32, 105, 112, 115,
 * //   117, 260, 100, 111, 108, 257,  32, 115, 105,
 * //   116,  32,  97, 109, 101, 116,  44,  32,  99,
 * //   111, 110, 115, 101,  99, 116, 278, 117, 114,
 * //   275, 100, 262, 105, 115,  99, 105, 110, 103,
 * //    32, 101, 108, 273,  46
 * // ]
 */
export declare function toLzw(input: string): number[];
/**
 * @example
 * fromLzw([76, 111, 114, 101, 109, ...]); // "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
 */
export declare function fromLzw(compressed: number[]): string;
//# sourceMappingURL=lzw.d.ts.map