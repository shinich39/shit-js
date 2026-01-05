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

type StoreCallback<T extends object> = <K extends keyof T>(
  key: K,
  oldValue: T[K] | undefined,
  newValue: T[K],
) => void | Promise<void>;

/**
 * Create an observed object
 * 
 * @example
 * const initial = { count: 1 };
 * const store = createStore<typeof initial>(initial, (key, oldValue, newValue) => { ... });
 * store.count++;
 */
export function createStore<T extends object>(
  initial: T,
  callback: StoreCallback<T>,
): T {
  return new Proxy({ ...initial }, {
    set(target, key, value) {
      const k = key as keyof T;
      const oldValue = target[k];

      if (oldValue !== value) {
        target[k] = value;
        callback(k, oldValue, value);
      }

      return true;
    },
  });
}