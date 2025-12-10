/**
 * @example
 * await sleep(1000); // 1s
 */
export declare function sleep(ms: number): Promise<unknown>;
/**
 * @example
 * const func = await (arg: any) => arg;
 * const wrappedFunc = retry(func, 10, 1000);
 * const result = await wrappedFunc(1); // 1
 */
export declare function retry<T extends (...args: any[]) => any>(func: T, count: number, delay: number): (...args: Parameters<T>) => Promise<ReturnType<T>>;
/**
 * @example
 * const worker = new QueueWorker();
 * worker.add(() => console.log(`Task 0`));
 * worker.add(async () => { await fetch('/api/data'); });
 */
export declare class QueueWorker {
    inProgress: boolean;
    queue: (() => void | Promise<void>)[];
    constructor();
    /**
     * @example
     * worker.add(() => console.log(`Task 0`));
     * worker.add(async () => { await fetch(`/api/data`); })
     */
    add(func: () => void | Promise<void>): void;
    /**
     * @example
     * const isFirst = !worker.inProgress;
     * await worker.start();
     * if (isFirst) {
     *   // Write code here to running after end of task.
     * }
     */
    start(): Promise<void>;
    /**
     * worker.inProgress = false;
     */
    pause(): void;
    /**
     * worker.queue = [];
     */
    clear(): void;
    /**
     * worker.queue = [];
     * worker.inProgress = false;
     */
    stop(): void;
}
//# sourceMappingURL=promise.d.ts.map