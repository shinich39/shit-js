/**
 * @example
 * await sleep(1000);
 * // wait 1s...
 */
export declare function sleep(ms: number): Promise<void>;
export type RetryHandler = (error: unknown, index: number) => void | Promise<void>;
/**
 * @param options.count default: 3
 * @param options.delay default: 1000
 * @example
 * const fn = async () => { return 1; };
 * const count = 3;
 * const delay = 1000;
 * const onRetry: RetryHandler = (error, index) => {};
 * const result = await retry(fn, { count, delay, onRetry }); // 1
 */
export declare function retry<T>(fn: () => Promise<T>, options?: {
    count?: number;
    delay?: number;
    onRetry?: RetryHandler;
}): Promise<T>;
/**
 * @example
 * const queue = createQueue();
 * queue(() => console.log("Task 0"));
 * queue(async () => { await fetch("/api/data"); });
 */
export declare function createQueue(): (fn: () => Promise<void>) => Promise<void>;
//# sourceMappingURL=promise.d.ts.map