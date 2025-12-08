/**
 * @example
 * await sleep(1000); // 1s
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @example
 * const func = await (arg: any) => arg;
 * const wrappedFunc = retry(func, 10, 1000);
 * const result = await wrappedFunc(1); // 1
 */
export function retry<T extends (...args: any[]) => any>(
  func: T,
  count: number,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async function wrapped(
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    let error: any;

    for (let i = 1; i <= count; i++) {
      try {
        return await func(...args);
      } catch (err) {
        error = err;
        if (i < count) {
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }

    throw error;
  };
}
/**
 * @example
 * const worker = new QueueWorker();
 * worker.add(() => console.log(`Task 0`));
 * worker.add(async () => {
 *   await fetch('/api/data');
 *   console.log(`Task 1`);
 * });
 */
export class QueueWorker {
  inProgress: boolean;
  queue: (() => void | Promise<void>)[];

  constructor() {
    this.inProgress = false;
    this.queue = [];
  }

  add(func: () => void | Promise<void>): void {
    this.queue.push(func);
  }

  async start(): Promise<void> {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    while(this.inProgress && this.queue.length > 0) {
      await this.queue.shift()!();
    }

    this.inProgress = false;
  }
  
  pause(): void {
    this.inProgress = false;
  }
  
  stop(): void {
    this.queue = [];
    this.inProgress = false;
  }
}