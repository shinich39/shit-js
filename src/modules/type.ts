/**
 * @example
 * const result = getType(undefined); // "undefined"
 * const result = getType(null); // "null"
 * const result = getType([]); // "array"
 * const result = getType(new Date()); // "date"
 * const result = getType(new RegExp()); // "regexp"
 * const result = getType(new RegExp()); // "regexp"
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
 * const result = isNumeric("1"); // true
 * const result = isNumeric(1); // false
 */
export function isNumeric(e: any): e is string {
  return typeof e === "string"
    && !Number.isNaN(parseFloat(e))
    && Number.isFinite(parseFloat(e));
}
/**
 * @example
 * const result = isNumber("1"); // true
 * const result = isNumber(1); // true
 */
export function isNumber(e: any): e is number | string {
  return typeof e === "number" || isNumeric(e);
}
/**
 * @example
 * const result = toNumber("1.1"); // 1.1
 * const result = toNumber(1.1); // 1.1
 */
export function toNumber(e: any): number {
  // String
  if (isNumeric(e)) {
    return parseFloat(e);
  }
  
  // Number
  if (typeof e === "number") {
    return e;
  }
  
  // Boolean
  if (typeof e === "boolean") {
    return e ? 1 : 0;
  }
  
  // Null, undefined
  if (!e) {
    return 0;
  }

  // Invalid string, object, Array, function
  throw new Error(`Invalid argument type: ${typeof e}`);
}
/**
 * @example
 * const result = isNumber("1"); // true
 * const result = isNumber(1); // true
 */
export function isBuffer(e: any): boolean {
  if (!e) {
    return false;
  }

  // Node Buffer
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(e)) {
    return true;
  }

  // ArrayBuffer
  if (e instanceof ArrayBuffer) {
    return true;
  }

  // SharedArrayBuffer (if supported)
  if (typeof SharedArrayBuffer !== "undefined" && e instanceof SharedArrayBuffer) {
    return true;
  }

  // TypedArray / DataView
  if (ArrayBuffer.isView(e)) {
    return true;
  }

  return false;
}
/**
 * 
 * @param e 
 * @returns 
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
    return Buffer.from(e);
  }

  // TypedArray / DataView
  if (ArrayBuffer.isView(e)) {
    return Buffer.from(e.buffer, e.byteOffset, e.byteLength);
  }

  throw new TypeError("Not binary data");
}
/**
 * @example
 * const result = toError("MESSAGE"); // == new Error("MESSAGE");
 */
export function toError(err: any): Error {
  if (err instanceof Error) {
    return err;
  }

  if (typeof err === "string") {
    return new Error(err);
  }

  if (typeof err === "number") {
    return new Error(
      {
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        412: "Precondition Failed",
        413: "Payload Too Large",
        415: "Unsupported Media Type",
        418: "I'm a teapot",
        422: "Unprocessable Entity",
        429: "Too Many Requests",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
      }[err] || "An unexpected error occurred."
    );
  }
  
  if (typeof err === "object") {
    const error = new Error(err);

    if (typeof err.name === "string") {
      error.name = err.name;
    }

    if (typeof err.message === "string") {
      error.message = err.message;
    }

    if (typeof err.stack === "string") {
      error.stack = err.stack;
    }

    return error;
  }

  return new Error("An unexpected error occurred.");
}
