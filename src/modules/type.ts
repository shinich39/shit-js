/**
 * @example
 * getType(undefined); // "undefined"
 * getType(null); // "null"
 * getType([]); // "array"
 * getType(new Date()); // "date"
 * getType(new RegExp()); // "regexp"
 * getType(new RegExp()); // "regexp"
 */
export function getType(e: unknown): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null" | "array" | "date" | "regexp" {
  if (e === undefined) {
    return "undefined";
  }
  
  if (e === null) {
    return "null";
  }
  
  if (Array.isArray(e)) {
    return "array";
  }
  
  if (e instanceof Date) {
    return "date";
  }
  
  if (e instanceof RegExp) {
    return "regexp";
  }

  return typeof e;
}
/**
 * @example
 * isNumeric("1"); // true
 * isNumeric(1); // false
 */
export function isNumeric(e: any): e is string {
  return typeof e === "string"
    && !Number.isNaN(parseFloat(e))
    && Number.isFinite(parseFloat(e));
}
/**
 * @example
 * isNumber("1"); // true
 * isNumber(1); // true
 * isNumber(true); // true
 * isNumber(null); // true
 * isNumber(undefined); // true
 */
export function isNumber(e: any): e is number | string | boolean | null | undefined {
  return typeof e === "number"
    || isNumeric(e)
    || typeof e === "boolean"
    || e === null
    || typeof e === "undefined";
}
/**
 * @example
 * toNumber("1.1"); // 1.1
 * toNumber(1.1); // 1.1
 */
export function toNumber(e: any): number {
  // string
  if (isNumeric(e)) {
    return parseFloat(e);
  }
  
  // number
  if (typeof e === "number") {
    return e;
  }
  
  // boolean
  if (typeof e === "boolean") {
    return e ? 1 : 0;
  }
  
  // null, undefined
  if (!e) {
    return 0;
  }

  // string, object, Array, function
  throw new Error(`Invalid argument type: ${typeof e}`);
}
/**
 * @example
 * isBuffer(Buffer.from("hello")); // true
 * isBuffer(new Uint8Array([1, 2, 3])); // true
 * isBuffer(new ArrayBuffer(8)); // true
 * isBuffer(new DataView(new ArrayBuffer(8))); // true
 * isBuffer("hello"); // false
 * isBuffer(1); // false
 * isBuffer(null); // false
 */
export function isBuffer(e: any): boolean {
  if (!e) {
    return false;
  }

  // ArrayBuffer
  if (e instanceof ArrayBuffer) {
    return true;
  }

  // SharedArrayBuffer (if supported)
  if (typeof SharedArrayBuffer !== "undefined" && e instanceof SharedArrayBuffer) {
    return true;
  }

  // Buffer, TypedArray, DataView
  if (ArrayBuffer.isView(e)) {
    return true;
  }

  return false;
}
/**
 * @example
 * const view = new Uint8Array([255, 128, 64]);
 * toBuffer(view); // <Buffer 68 65 6c 6c 6f>
 * 
 * const ab = new ArrayBuffer(4);
 * const view = new Uint8Array(ab);
 * view.set([1, 2, 3, 4]);
 * toBuffer(ab); // <Buffer 01 02 03 04>
 */
export function toBuffer(e: any): Buffer {
  // Buffer
  if (Buffer.isBuffer(e)) {
    return e;
  }

  // ArrayBuffer
  if (e instanceof ArrayBuffer) {
    return Buffer.from(e);
  }

  // SharedArrayBuffer
  if (typeof SharedArrayBuffer !== "undefined" && e instanceof SharedArrayBuffer) {
    return Buffer.from(new Uint8Array(e)); // safer copy
  }

  // TypedArray / DataView
  if (ArrayBuffer.isView(e)) {
    return Buffer.from(e.buffer, e.byteOffset, e.byteLength);
  }

  throw new Error(`Cannot convert to Buffer: ${Object.prototype.toString.call(e)}`);
}