/**
 * Deep clones a value.
 *
 * Prefer the native `structuredClone` if available (Node.js 17+, modern browsers).
 *
 * This function is a fallback for environments where `structuredClone` is not supported.
 *
 * @example
 * const a = {};
 * const b = structuredClone(a);
 * a == b; // false
 *
 * @example
 * const a = {};
 * const b = clone(a);
 * a == b; // false
 */
export function clone<T>(obj: T): T {
  const cache: WeakMap<object, any> = new WeakMap();

  const fn = (o: T) => {
    if (o === null || typeof o !== "object") {
      return o;
    }

    if (cache.has(o as any)) {
      return cache.get(o as any);
    }

    if (o instanceof Date) {
      return new Date(o.getTime()) as any;
    }

    if (o instanceof RegExp) {
      return new RegExp(o.source, o.flags) as any;
    }

    if (Array.isArray(o)) {
      return o.map((item) => clone(item)) as any;
    }

    const result = Object.create(Object.getPrototypeOf(o));
    cache.set(o as any, result);

    for (const key of Object.keys(o as any)) {
      result[key] = fn((o as any)[key]);
    }

    return result;
  };

  return fn(obj);
}
