/**
 * @example
 * await sleep(1000); // 1s
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * @example
 * const fn = await (arg: any) => arg;
 * const wrappedFn = retry(fn, 10, 1000);
 * const result = await wrappedFn(1); // 1
 */
export declare function retry<T extends (...args: any[]) => any>(fn: T, count: number, delay: number): (...args: Parameters<T>) => Promise<ReturnType<T>>;
type TypingOptions = {
    character?: {
        min: number;
        max: number;
    };
    word?: {
        min: number;
        max: number;
    };
    sentence?: {
        min: number;
        max: number;
    };
    acceleration?: {
        /** ms */
        strength: number;
        frequency: number;
    };
    clamp?: {
        min: number;
        max: number;
    };
};
/**
 * @example
 * await typing("Lorem ipsum dolor sit amet, consectetur adipiscing elit.", (char, i, str) => {
 *   process.stdout.write(char);
 * });
 */
export declare function typing(value: string, callback: (character: string, index: number, string: string) => void | Promise<void>, options?: TypingOptions): Promise<void>;
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
    add(fn: () => void | Promise<void>): void;
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
export {};
//# sourceMappingURL=promise.d.ts.map