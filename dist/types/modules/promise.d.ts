/**
 * @example
 * await sleep(1000);
 * // wait 1s...
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * @param options.count default: 3
 * @param options.delay default: 1000
 * @example
 * const fn = async () => { ... };
 * const wrappedFn = retry(fn, 10, 1000);
 * await wrappedFn((index) => {
 *   console.log(index); // 0...1...2
 * });
 */
export declare function retry<T>(fn: () => Promise<T>, options?: {
    count?: number;
    delay?: number;
    onRetry?: (error: unknown, index: number) => void | Promise<void>;
}): Promise<T>;
/**
 * @example
 * const queue = createQueue();
 * queue(() => console.log("Task 0"));
 * queue(async () => { await fetch("/api/data"); });
 */
export declare function createQueue(): (fn: () => Promise<void>) => Promise<void>;
//# sourceMappingURL=promise.d.ts.map