/**
 * Deep clone
 *
 * @example
 * const a = {};
 * const b = copyObject(a);
 * a == b; // false
 */
export declare function copyObject<T>(obj: T): T;
type StoreCallback<T extends object> = <K extends keyof T>(key: K, oldValue: T[K] | undefined, newValue: T[K]) => void | Promise<void>;
/**
 * Create an observed object
 *
 * @example
 * const initial = { count: 1 };
 * const store = createStore<typeof initial>(initial, (key, oldValue, newValue) => { ... });
 * store.count++;
 */
export declare function createStore<T extends object>(initial: T, callback: StoreCallback<T>): T;
export {};
//# sourceMappingURL=object.d.ts.map