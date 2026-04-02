/**
 * @param salt salt.length must be greater than 0
 * @example
 * const original = "text";
 * const encrypted = xor(original, "this is salt!");
 * const decrypted = xor(encrypted, "this is salt!"); // "text"
 */
export declare function xor(str: string, salt: string): string;
//# sourceMappingURL=xor.d.ts.map