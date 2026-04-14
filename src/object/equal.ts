/**
 * @example
 * equal(1, 1);               // true
 * equal({ a: 1 }, { a: 1 }); // true
 * equal([1, 2], [1, 2]);     // true
 * equal({ a:{ b: 1 } }, { a: { b: 2 }}); // false
 * equal([1, 2], [1, 2, 3]);  // false
 */
export function equal(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a !== "object" || a === null || b === null) {
    return false;
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.hasOwn(objB, key)) {
      return false;
    }
    if (!equal(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}
