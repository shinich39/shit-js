export type StoreHandlers<T extends object> = {
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
//# sourceMappingURL=create-store.d.ts.map