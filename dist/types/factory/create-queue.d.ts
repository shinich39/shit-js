/**
 * @example
 * const queue = createQueue();
 *
 * queue(() => console.log("Task 0"));
 * queue(async () => { await fetch("/api/data"); });
 */
export declare function createQueue(): (fn: () => Promise<void>) => Promise<void>;
//# sourceMappingURL=create-queue.d.ts.map