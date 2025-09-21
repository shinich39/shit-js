export declare function sleep(ms: number): Promise<unknown>;
/**
 * @example
 * const func = await function(arg: any) => arg;
 * const wrappedFunc = retry(func, 10, 1000);
 * const result = await wrappedFunc(1);
 * console.log(result); // 1
 */
export declare function retry<T extends (...args: any[]) => any>(func: T, count: number, delay: number): (...args: Parameters<T>) => Promise<ReturnType<T>>;
/**
 * @example
 * input.addEventListener("input", debounce((e) => { ... }, 100));
 */
export declare function debounce(func: (...args: any[]) => any, delay: number): (...args: any[]) => void;
//# sourceMappingURL=async.d.ts.map