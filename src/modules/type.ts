/**
 * @example
 * const result = getType(undefined); // "undefined"
 * const result = getType(null); // "null"
 * const result = getType([]); // "array"
 * const result = getType(new Date()); // "date"
 * const result = getType(new RegExp()); // "regexp"
 * const result = getType(new RegExp()); // "regexp"
 */
export function getType(e: unknown) {
  if (e === undefined) {
    return "undefined";
  } else if (e === null) {
    return "null";
  } else if (Array.isArray(e)) {
    return "array";
  } else if (e instanceof Date) {
    return "date";
  } else if (e instanceof RegExp) {
    return "regexp";
  } else {
    return typeof e;
  }
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
export function toNumber(e: any) {
  if (isNumeric(e)) {
    return parseFloat(e);
  } else if (typeof e === "number") {
    return e;
  } else if (typeof e === "boolean") {
    return e ? 1 : 0;
  } else if (!e) {
    return 0; // undefined, null
  }
  // Invalid string, object, Array, function
  throw new Error(`Invalid argument type: ${typeof e}`);
}
/**
 * @example
 * const result = toError("MESSAGE"); // == new Error("MESSAGE");
 */
export function toError(err: any): Error {
  if (err instanceof Error) {
    return err;
  }

  const error = new Error("An error occurred");

  if (typeof err === "string") {
    error.message = err;
  } else if (typeof err === "object") {
    if (typeof err.name === "string") {
      error.name = err.name;
    }
    if (typeof err.message === "string") {
      error.message = err.message;
    }
    if (typeof err.stack === "string") {
      error.stack = err.stack;
    }
  }

  return error;
}
