/**
 * @example
 * toNumber("1.1");     // 1.1
 * toNumber(1.1);       // 1.1
 * toNumber(true);      // 1
 * toNumber(false);     // 0
 * toNumber(null);      // 0
 * toNumber(undefined); // 0
 * toNumber({});        // throw Error
 */
export function toNumber(e: unknown): number {
  if (typeof e === "number") {
    return e;
  }

  if (typeof e === "string") {
    const num = Number(e);
    if (!Number.isNaN(num)) {
      return num;
    }
    throw new Error(`Invalid numeric string: ${e}`);
  }

  if (typeof e === "boolean") {
    return e ? 1 : 0;
  }

  if (e === null || e === undefined) {
    return 0;
  }

  throw new Error(`Invalid argument type: ${typeof e}`);
}
