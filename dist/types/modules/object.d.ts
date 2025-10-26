export declare function clone<T>(obj: T): T;
/**
 * @param key use dot natation.
 *
 * @example
 * const result = getObjectValue({ arr: [1, 2, 3] }, "arr.0");
 * // 1
 *
 * const result = getObjectValue({ obj: { o: 1, b: 2, j: 3 } }, "obj.o");
 * // 1
 */
export declare function getObjectValue(obj: Record<string, any>, key: string): any;
/**
 * includes: Array, object, Set, Map
 *
 * equals: undefined, null, boolean, number, string, Date,
 *
 * @example
 * const result = matchObject(
 *   { str: "abc", num: 1 },
 *   { num: 1 }
 * ); // true
 */
export declare function matchObject(obj: any, query: any): boolean;
//# sourceMappingURL=object.d.ts.map