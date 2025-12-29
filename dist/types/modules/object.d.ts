/**
 * @example
 * const a = {};
 * const b = clone(a);
 * const result = a == b; // false
 */
export declare function clone<T>(obj: T): T;
/**
 * @param key Supports dot-notation.
 *
 * @example
 * const result = getObjectValue({ arr: [1, 2, 3] }, "arr.0"); // 1
 * const result = getObjectValue({ obj: { o: 1, b: 2, j: 3 } }, "obj.o"); // 1
 */
export declare function getObjectValue(obj: Record<string, any>, key: string): any;
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
export declare function matchObject(obj: any, query: any): boolean;
/**
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