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
  } else if (typeof e === "number") {
    return e;
  } else if (typeof e === "boolean") {
    return e ? 1 : 0;
  } else if (!e) {
    return 0; // undefined, null
  } else {
    // invalid string, object, Array, function
    throw new Error(`Invalid argument type: ${typeof e}`);
  }
}
