/**
 * @example
 * const a = {};
 * const b = copyObject(a);
 * a == b; // false
 */
export function copyObject<T>(
  obj: T,
  cache: WeakMap<object, any> = new WeakMap(),
): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (cache.has(obj as any)) {
    return cache.get(obj as any);
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => copyObject(item)) as any;
  }

  const result = Object.create(Object.getPrototypeOf(obj));
  cache.set(obj as any, result);

  for (const key of Object.keys(obj as any)) {
    result[key] = copyObject((obj as any)[key], cache);
  }

  return result;
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