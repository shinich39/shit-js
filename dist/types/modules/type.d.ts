/**
 * @example
 * const result = getType(undefined); // "undefined"
 * const result = getType(null); // "null"
 * const result = getType([]); // "array"
 * const result = getType(new Date()); // "date"
 * const result = getType(new RegExp()); // "regexp"
 * const result = getType(new RegExp()); // "regexp"
 */
export declare function getType(e: unknown): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null" | "array" | "date" | "regexp";
/**
 * @example
 * const result = isNumeric("1"); // true
 * const result = isNumeric(1); // false
 */
export declare function isNumeric(e: any): e is string;
/**
 * @example
 * const result = isNumber("1"); // true
 * const result = isNumber(1); // true
 */
export declare function isNumber(e: any): e is number | string;
/**
 * @example
 * const result = toNumber("1.1"); // 1.1
 * const result = toNumber(1.1); // 1.1
 */
export declare function toNumber(e: any): number;
/**
 * @example
 * const result = toError("MESSAGE"); // == new Error("MESSAGE");
 */
export declare function toError(err: any): Error;
//# sourceMappingURL=type.d.ts.map