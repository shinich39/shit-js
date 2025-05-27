export function getType(e: any) {
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

export function isNumeric(e: any): e is string {
  return (
    typeof e === "string" &&
    !Number.isNaN(parseFloat(e)) &&
    Number.isFinite(parseFloat(e))
  );
}

export function toNumber(e: any) {
  if (isNumeric(e)) {
    return parseFloat(e);
  }

  if (typeof e === "number") {
    return e;
  }

  if (typeof e === "boolean") {
    return e ? 1 : 0;
  }

  if (!e) {
    return 0; // undefined, null
  }

  // invalid string, object, Array, function
  throw new Error(`Invalid argument type: ${typeof e}`);
}

export function toError(e: any): Error {
  if (e instanceof Error) {
    return e;
  }

  if (typeof e === "string") {
    return new Error(e);
  }

  if (typeof e !== "object") {
    return new Error("Unknown Error");
  }

  if (Array.isArray(e)) {
    return new Error("Unknown Error");
  }

  if (!e.name || !e.message) {
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
