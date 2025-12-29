/**
 * @example
 * const a = {};
 * const b = clone(a);
 * const result = a == b; // false
 */
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
 * @param key Supports dot-notation.
 * 
 * @example
 * const result = getObjectValue({ arr: [1, 2, 3] }, "arr.0"); // 1
 * const result = getObjectValue({ obj: { o: 1, b: 2, j: 3 } }, "obj.o"); // 1
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
/**
 * Includes: Array, object, Set, Map
 *
 * Equals: undefined, null, boolean, number, string, Date,
 * 
 * @example
 * const result = matchObject(
 *   { str: "abc", num: 1 }, 
 *   { num: 1 }
 * ); // true
 */
export function matchObject(obj: any, query: any): boolean {
  const fn = function(a: any, b: any, seen = new WeakMap()) {
    // Same address
    if (Object.is(a, b)) {
      return true;
    }

    // Different type
    if (typeof a !== typeof b) {
      return false;
    }

    // Boolean, Number, String, undefined
    if (typeof b !== "object") {
      return a === b;
    }

    // null
    if (b === null) {
      return a === null;
    }

    // Handle circular references
    if (seen.has(b)) {
      return seen.get(b) === a;
    }
    seen.set(b, a);

    // Include
    if (Array.isArray(b)) {
      if (!Array.isArray(a) || a.length < b.length) {
        return false;
      }
      for (const j of b) {
        let isExists = false;
        for (const i of a) {
          if (fn(i, j, seen)) {
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

    // Include
    if (b instanceof Set) {
      if (!(a instanceof Set) || a.size < b.size) {
        return false;
      }
      return fn(Array.from(a), Array.from(b), seen);
    }

    // Include
    if (b instanceof Map) {
      if (!(a instanceof Map) || a.size < b.size) {
        return false;
      }
      for (const [key, value] of b) {
        if (!a.has(key) || !fn(a.get(key), value, seen)) {
          return false;
        }
      }
      return true;
    }

    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
      return false;
    }

    // Plain object
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length < keysB.length) {
      return false;
    }

    for (const key of keysB) {
      if (keysA.indexOf(key) === -1 || !fn(a[key], b[key], seen)) {
        return false;
      }
    }

    return true;
  }

  return fn(obj, query);
}
/**
 * @example
 * const store = createStore<number>((key, oldValue, newValue) => { ... });
 * store.set("a", 1);
 * store.get("a"); // 1
 */
export function createStore<T = any>(
  callback: (key: string, oldValue: T | undefined, newValue: T) => void | Promise<void>,
): {
  get(key: string): T | undefined;
  set(key: string, newValue: T): void;
} {
  const obj: Record<string, T> = {};

  return {
    get(key: string): T | undefined {
      return obj[key];
    },
    set(key: string, newValue: T) {
      const oldValue = obj[key];
      if (oldValue !== newValue) {
        obj[key] = newValue;
        callback(key, oldValue, newValue);
      }
    },
  };
}