/**
 * @example
 * await sleep(1000);
 * // wait 1s...
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * @example
 * const fn = async () => { ... };
 * const wrappedFn = retry(fn, 10, 1000);
 * await wrappedFn((index) => {
 *   console.log(index); // 0...1...2
 * });
 */
export declare function retry<T>(fn: () => Promise<T>, count: number, delay: number, callback?: (index: number, error: unknown) => void | Promise<void>): Promise<T>;
/**
 * @example
 * const worker = new QueueWorker();
 *
 * worker.add(() => console.log("Task 0"));
 *
 * worker.add(async () => {
 *   await fetch("/api/data");
 * });
 *
 * worker.add(async () => { await sleep(100); console.log("1"); });
 * worker.add(async () => { await sleep(50);  console.log("2"); });
 */
export declare class QueueWorker {
    _: Promise<void>;
    add(fn: () => Promise<void>): Promise<void>;
}
//# sourceMappingURL=promise.d.ts.map