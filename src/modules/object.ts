/**
 * Deep clone
 * 
 * @example
 * const a = {};
 * const b = copyObject(a);
 * a == b; // false
 */
export function copyObject<T>(obj: T): T {
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
      return o.map((item) => copyObject(item)) as any;
    }

    const result = Object.create(Object.getPrototypeOf(o));
    cache.set(o as any, result);

    for (const key of Object.keys(o as any)) {
      result[key] = fn((o as any)[key]);
    }

    return result;
  }

  return fn(obj);
}
/**
 * Key-Value observer
 * 
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