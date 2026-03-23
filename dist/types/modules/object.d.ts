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
 * Create internationalization(i18n) object
 *
 * @example
 * const t = createI18n({
 *   en: { heading: "Hello, world!" },
 *   ko: { heading: "세상아, 안녕!" }
 * }, "en");
 *
 * t("en", "heading"); // "Hello, world!"
 * t(null, "heading"); // "Hello, world!"
 * t("ko", "heading"); // "세상아, 안녕!"
 * t("en", "missing"); // "missing"
 */
export declare function createI18n(obj: Record<string, Record<string, string>>, defaultLocale: string): (locale: string | null | undefined, key: string) => string;
type StoreHandlers<T extends object> = {
    [K in keyof T]?: (oldValue: T[K], newValue: T[K]) => void | Promise<void>;
};
/**
 * Create an observed object
 *
 * @example
 * const store = createStore<typeof initial>({ count: 1 }, {
 *   count: (oldValue, newValue) => { ... },
 * });
 * store.count++;
 */
export declare function createStore<T extends object>(initial: T, handlers: StoreHandlers<T>): T;
/**
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { a: 1, c: 3 }
 */
export declare function pick<T>(obj: T, keys: (keyof T)[]): Pick<T, keyof T>;
/**
 * @example
 * pickBy({ a: 1, b: 2, c: 3 }, (value) => value > 1); // { b: 2, c: 3 }
 * pickBy({ a: 1, b: null, c: "x" }, (value) => value); // { a: 1, c: "x" }
 */
export declare function pickBy<T>(obj: Record<string, T>, fn: (value: T, key: string, object: Record<string, T>) => unknown): Record<string, T>;
export {};
//# sourceMappingURL=object.d.ts.map