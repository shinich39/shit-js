export function clone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => clone(item)) as any;
  }

  return Object.entries(obj).reduce<Record<string, any>>((acc, cur) => {
    acc[cur[0]] = clone(cur[1]);
    return acc;
  }, {}) as T;
}
/**
 * @param key use dot natation.
 * 
 * @example
 * const result = getObjectValue({ arr: [1, 2, 3] }, "arr.0");
 * // 1
 * 
 * const result = getObjectValue({ obj: { o: 1, b: 2, j: 3 } }, "obj.o");
 * // 1
 */
export function getObjectValue(obj: Record<string, any>, key: string): any {
  let cur = obj;

  for (const k of key.split(".")) {
    if (typeof cur !== "object" || cur === null) {
      break;
    }

    cur = cur[k];
  }

  return cur;
}
    const a = {
      str: "abc",
      num: 1,
      obj: {
        key: "value",
      },
      arr: [1, 2, 3],
      date: new Date(),
      set: new Set([1, 2, 3]),
      map: new Map([
        [1, "one"],
        [2, "two"],
        [3, "three"],
      ]),
    };
/**
 * includes: Array, object, Set, Map
 *
 * equals: undefined, null, boolean, number, string, Date,
 * 
 * @example
 * const result = compareObject({
 *   str: "abc",
 *   num: 1
 * }, {
 *   num: 1,
 * });
 * // true
 */
export function compareObject(a: any, b: any) {
  const func = function (m: any, n: any, seen = new WeakMap()) {
    // same address
    if (Object.is(m, n)) {
      return true;
    }

    // type mismatch
    if (typeof m !== typeof n) {
      return false;
    }

    // boolean, number, string, undefined
    if (typeof n !== "object") {
      return m === n;
    }

    // null
    if (n === null) {
      return m === null;
    }

    // handle circular references
    if (seen.has(n)) {
      return seen.get(n) === m;
    }
    seen.set(n, m);

    // include
    if (Array.isArray(n)) {
      if (!Array.isArray(m) || m.length < n.length) {
        return false;
      }
      for (const j of n) {
        let isExists = false;
        for (const i of m) {
          if (func(i, j, seen)) {
            isExists = true;
            break;
          }
        }
        if (!isExists) {
          return false;
        }
      }
      return true;
    }

    if (n instanceof Date) {
      if (!(m instanceof Date)) {
        return false;
      }
      return m.valueOf() === n.valueOf();
    }

    // include
    if (n instanceof Set) {
      if (!(m instanceof Set) || m.size < n.size) {
        return false;
      }
      return func(Array.from(m), Array.from(n), seen);
    }

    // include
    if (n instanceof Map) {
      if (!(m instanceof Map) || m.size < n.size) {
        return false;
      }
      for (const [key, value] of n) {
        if (!m.has(key) || !func(m.get(key), value, seen)) {
          return false;
        }
      }
      return true;
    }

    if (Object.getPrototypeOf(m) !== Object.getPrototypeOf(n)) {
      return false;
    }

    // plain object
    const keysA = Object.keys(m);
    const keysB = Object.keys(n);

    if (keysA.length < keysB.length) {
      return false;
    }

    for (const key of keysB) {
      if (keysA.indexOf(key) === -1 || !func(m[key], n[key], seen)) {
        return false;
      }
    }

    return true;
  };

  return func(a, b);
}
