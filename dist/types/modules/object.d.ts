/**
 * Deep clone
 *
 * @example
 * const a = {};
 * const b = copyObject(a);
 * a == b; // false
 */
export declare function copyObject<T>(obj: T): T;
/**
 * Key-Value observer
 *
 * @example
 * const store = createStore<number>((key, oldValue, newValue) => { ... });
 * store.set("a", 1);
 * store.get("a"); // 1
 */
export declare function createStore<T = any>(callback: (key: string, oldValue: T | undefined, newValue: T) => void | Promise<void>): {
    get(key: string): T | undefined;
    set(key: string, newValue: T): void;
};
//# sourceMappingURL=object.d.ts.map