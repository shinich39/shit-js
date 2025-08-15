export declare function sleep(ms: number): Promise<unknown>;
export declare function retry<T extends (...args: any[]) => any>(func: T, count: number, delay: number): (...args: Parameters<T>) => Promise<ReturnType<T>>;
//# sourceMappingURL=async.d.ts.map