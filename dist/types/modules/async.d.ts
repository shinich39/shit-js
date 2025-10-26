/**
 * @example
 * await sleep(1000); // 1s
 */
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
/**
 * @example
 * const worker = new QueueWorker();
 * worker.add((index) => console.log(`Task ${index}`));
 * worker.add(async (index) => {
 *   await fetch('/api/data');
 *   console.log(`Task ${index}`);
 * });
 */
export declare class QueueWorker {
    inProgress: boolean;
    queue: ((index: number) => void | Promise<void>)[];
    _n: number;
    constructor();
    add(func: (index: number) => void | Promise<void>): void;
    run(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=async.d.ts.map