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
 * const result = matchObject(
 *   { str: "abc", num: 1 }, 
 *   { num: 1 }
 * ); // true
 */
export function matchObject(obj: any, query: any) {
  const func = function (a: any, b: any, seen = new WeakMap()) {
    // same address
    if (Object.is(a, b)) {
      return true;
    }

    // type mismatch
    if (typeof a !== typeof b) {
      return false;
    }

    // boolean, number, string, undefined
    if (typeof b !== "object") {
      return a === b;
    }

    // null
    if (b === null) {
      return a === null;
    }

    // handle circular references
    if (seen.has(b)) {
      return seen.get(b) === a;
    }
    seen.set(b, a);

    // include
    if (Array.isArray(b)) {
      if (!Array.isArray(a) || a.length < b.length) {
        return false;
      }
      for (const j of b) {
        let isExists = false;
        for (const i of a) {
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

    if (b instanceof Date) {
      if (!(a instanceof Date)) {
        return false;
      }
      return a.valueOf() === b.valueOf();
    }

    // include
    if (b instanceof Set) {
      if (!(a instanceof Set) || a.size < b.size) {
        return false;
      }
      return func(Array.from(a), Array.from(b), seen);
    }

    // include
    if (b instanceof Map) {
      if (!(a instanceof Map) || a.size < b.size) {
        return false;
      }
      for (const [key, value] of b) {
        if (!a.has(key) || !func(a.get(key), value, seen)) {
          return false;
        }
      }
      return true;
    }

    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
      return false;
    }

    // plain object
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length < keysB.length) {
      return false;
    }

    for (const key of keysB) {
      if (keysA.indexOf(key) === -1 || !func(a[key], b[key], seen)) {
        return false;
      }
    }

    return true;
  };

  return func(obj, query);
}
