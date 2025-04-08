/**
 * @param key use dot natation.
 *
 * e.g. "a.b.c"
 */
export declare function getObjectValue(obj: Record<string, any>, key: string): any;
/**
 * includes: Array, object, Set, Map
 *
 * equals: undefined, null, boolean, number, string, Date,
 */
export declare function compareObject(a: any, b: any, seen?: WeakMap<object, any>): boolean;
//# sourceMappingURL=object.d.ts.map