/**
 * @example
 * getType(undefined); // "undefined"
 * getType(null); // "null"
 * getType([]); // "array"
 * getType(new Date()); // "date"
 * getType(new RegExp()); // "regexp"
 * getType(new RegExp()); // "regexp"
 */
export declare function getType(e: unknown): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null" | "array" | "date" | "regexp";
/**
 * @example
 * isNumeric("1"); // true
 * isNumeric(1); // false
 */
export declare function isNumeric(e: any): e is string;
/**
 * @example
 * isNumber("1"); // true
 * isNumber(1); // true
 * isNumber(true); // true
 * isNumber(null); // true
 * isNumber(undefined); // true
 */
export declare function isNumber(e: any): e is number | string | boolean | null | undefined;
/**
 * @example
 * toNumber("1.1"); // 1.1
 * toNumber(1.1); // 1.1
 */
export declare function toNumber(e: any): number;
/**
 * @example
 * isNumber("1"); // true
 * isNumber(1); // true
 */
export declare function isBuffer(e: any): boolean;
/**
 * @example
 * const u8 = new Uint8Array([255, 128, 64]);
 * toBuffer(u8); // <Buffer 68 65 6c 6c 6f>
 *
 * const ab = new ArrayBuffer(4);
 * const view = new Uint8Array(ab);
 * view.set([1, 2, 3, 4]);
 * toBuffer(ab); // <Buffer 01 02 03 04>
 */
export declare function toBuffer(e: any): Buffer;
/**
 * @example
 * toError("MESSAGE"); // new Error("MESSAGE");
 */
export declare function toError(err: any): Error;
//# sourceMappingURL=type.d.ts.map