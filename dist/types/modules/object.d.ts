/**
 * Deep clone
 *
 * @example
 * const a = {};
 * const b = copyObject(a);
 * a == b; // false
 */
export declare function copyObject<T>(obj: T): T;
type StoreHandlers<T extends object> = {
    [K in keyof T]?: (oldValue: T[K] | undefined, newValue: T[K]) => void | Promise<void>;
};
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
export declare function createStore<T extends object>(initial: T, handlers: StoreHandlers<T>): T;
export {};
//# sourceMappingURL=object.d.ts.map