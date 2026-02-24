/**
 * @example
 * await sleep(1000);
 * // Wait 1s...
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
export declare function retry<T>(fn: () => Promise<T>, count: number, delay: number): (callback?: (index: number, error: unknown) => void | Promise<void>) => Promise<T>;
type QueueFunction<T = void> = () => T | Promise<T>;
interface QueueItem<T> {
    fn: QueueFunction<T>;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
}
/**
 * @example
 * const worker = new QueueWorker();
 * worker.add(() => console.log(`Task 0`));
 * worker.add(async () => { await fetch('/api/data'); });
 */
export declare class QueueWorker {
    queue: QueueItem<any>[];
    running: boolean;
    /**
     * @example
     * worker.add(() => console.log(`Task 0`));
     * worker.add(async () => { await fetch(`/api/data`); })
     */
    add<T>(fn: QueueFunction<T>): Promise<T>;
    private run;
}
export {};
//# sourceMappingURL=promise.d.ts.map