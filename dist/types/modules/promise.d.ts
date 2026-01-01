/**
 * @example
 * await sleep(1000);
 * // Wait 1s...
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * @example
 * const fn = await (arg: any) => arg;
 * const wrappedFn = retry(fn, 10, 1000);
 * await wrappedFn(1); // 1
 */
export declare function retry<T extends (...args: any[]) => any>(fn: T, count: number, delay: number): (...args: Parameters<T>) => Promise<ReturnType<T>>;
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