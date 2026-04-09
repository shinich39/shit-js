/**
 * @example
 * const handlers: StoreHandlers = {
 *   count: (oldValue, newValue) => { ... },
 * }
 */
export type StoreHandlers<T extends object> = {
  [K in keyof T]?: (oldValue: T[K], newValue: T[K]) => void | Promise<void>;
};

/**
 * @example
 * const store = createStore({ count: 1 }, {
 *   count: (oldValue, newValue) => { ... },
 * });
 *
 * store.count++; // call count handler
 */
export function createStore<T extends object>(initial: T, handlers: StoreHandlers<T>): T {
  return new Proxy(
    { ...initial },
    {
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
    },
  );
}
