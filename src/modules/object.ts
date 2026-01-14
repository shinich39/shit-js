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
 * @example
 * const t = createTable({
 *   en: { heading: "Hello, world!" },
 *   ko: { heading: "세상아, 안녕!" }
 * }, "en");
 * 
 * t("en", "heading"); // "Hello, world!"
 * t(null, "heading"); // "Hello, world!"
 * t("ko", "heading"); // "세상아, 안녕!"
 * t("en", "missing"); // "missing"
 */
export function createTable(
  obj: Record<string, Record<string, string>>,
  defaultPrimaryKey: string,
): (primaryKey: string | null | undefined, secondaryKey: string) => string {
  return (primaryKey, secondaryKey) => 
    obj[primaryKey ?? ""]?.[secondaryKey] ??
    obj[defaultPrimaryKey]?.[secondaryKey] ??
    secondaryKey;
}

type StoreHandlers<T extends object> = {
  [K in keyof T]?: (
    oldValue: T[K],
    newValue: T[K],
  ) => void | Promise<void>;
}
/**
 * Create an observed object
 * 
 * @example
 * const initial = { count: 1 };
 * const store = createStore<typeof initial>(initial, {
 *   count: (oldValue, newValue) => { ... },
 * });
 * store.count++;
 */
export function createStore<T extends object>(
  initial: T,
  handlers: StoreHandlers<T>,
): T {
  return new Proxy({ ...initial }, {
    set(target, key, value) {
      const typedKey = key as keyof T;
      const oldValue = target[typedKey];

      if (oldValue !== value) {
        target[typedKey] = value;

        const handler = handlers[typedKey];
        
        if (handler) {
          handler(oldValue, value);
        }
      }

      return true;
    },
  });
}