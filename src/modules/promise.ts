/**
 * @example
 * await sleep(1000); // 1s
 */
export function sleep(ms: number): Promise<void> {
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
  delay: number,
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
          await new Promise((resolve) => setTimeout(resolve, delay));
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
 * worker.add(async () => { await fetch('/api/data'); });
 */
export class QueueWorker {
  inProgress: boolean;
  queue: (() => void | Promise<void>)[];

  constructor() {
    this.inProgress = false;
    this.queue = [];
  }
  /**
   * @example
   * worker.add(() => console.log(`Task 0`));
   * worker.add(async () => { await fetch(`/api/data`); })
   */
  add(func: () => void | Promise<void>): void {
    this.queue.push(func);
  }
  /**
   * @example
   * const isFirst = !worker.inProgress;
   * await worker.start();
   * if (isFirst) {
   *   // Write code here to running after end of task.
   * }
   */
  async start(): Promise<void> {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    while(this.inProgress) {
      const queue = this.queue.shift();
      
      if (!queue) {
        break;
      }

      await queue();
    }

    this.inProgress = false;
  }
  /**
   * worker.inProgress = false;
   */
  pause(): void {
    this.inProgress = false;
  }
  /**
   * worker.queue = [];
   */
  clear(): void {
    this.queue = [];
  }
  /**
   * worker.queue = [];
   * worker.inProgress = false;
   */
  stop(): void {
    this.clear();
    this.pause();
  }
}