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
export declare function createTable(obj: Record<string, Record<string, string>>, defaultPrimaryKey: string): (primaryKey: string | null | undefined, secondaryKey: string) => string;
type StoreHandlers<T extends object> = {
    [K in keyof T]?: (oldValue: T[K], newValue: T[K]) => void | Promise<void>;
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