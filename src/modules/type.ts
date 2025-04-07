export function isNumeric(e: any): e is string {
  return (
    typeof e === "string" &&
    !Number.isNaN(parseFloat(e)) &&
    Number.isFinite(parseFloat(e))
  );
}

export function toNumber(e?: any) {
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
