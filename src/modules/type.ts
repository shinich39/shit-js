/**
 * @example
 * const result = getType(undefined); // "undefined"
 * const result = getType(null); // "null"
 * const result = getType([]); // "array"
 * const result = getType(new Date()); // "date"
 * const result = getType(new RegExp()); // "regexp"
 * const result = getType(new RegExp()); // "regexp"
 */
export function getType(e: any) {
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
 */
export function isNumeric(e: any): e is string {
  return (
    typeof e === "string" &&
    !Number.isNaN(parseFloat(e)) &&
    Number.isFinite(parseFloat(e))
  );
}
/**
 * @example
 * const result = toNumber("1.1"); // 1.1
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
  // invalid string, object, Array, function
  throw new Error(`Invalid argument type: ${typeof e}`);
}
/**
 * @example
 * const result = toError("MESSAGE"); // == new Error("MESSAGE");
 */
export function toError(e: any): Error {
  if (e instanceof Error) {
    return e;
  } else if (typeof e === "string") {
    return new Error(e);
  } else if (typeof e !== "object") {
    return new Error("Unknown Error");
  } else if (Array.isArray(e)) {
    return new Error("Unknown Error");
  } else if (!e.name || !e.message) {
    return new Error("Unknown Error");
  }

  const err = new Error();

  if (typeof e.name === "string") {
    err.name = e.name;
  }

  if (typeof e.message === "string") {
    err.message = e.message;
  }

  if (typeof e.stack === "string") {
    err.stack = e.stack;
  }

  return err;
}
