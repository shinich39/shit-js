/**
 * @example
 * const debounced = debounce((arg: string) => {
 *   console.log(arg);
 * }, 300);
 *
 * debounced("a"); // skip
 * debounced("ab"); // skip
 * debounced("abc"); // only "abc" runs after 300ms
 */
export declare function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=debounce.d.ts.map