/**
 * @param salt salt.length must be greater than 0
 *
 * @example
 * const encrypted = xor("Hello, world!", "this is salt!");
 * // "OESW"
 *
 * const decrypted = xor(encrypted, "this is salt!");
 * // "Hello, world!"
 */
export declare function xor(str: string, salt: string): string;
//# sourceMappingURL=xor.d.ts.map