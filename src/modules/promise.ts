/**
 * @example
 * await sleep(1000); // 1s
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @example
 * const fn = await (arg: any) => arg;
 * const wrappedFn = retry(fn, 10, 1000);
 * const result = await wrappedFn(1); // 1
 */
export function retry<T extends (...args: any[]) => any>(
  fn: T,
  count: number,
  delay: number,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async function wrapped(
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    let error: any;

    for (let i = 1; i <= count; i++) {
      try {
        return await fn(...args);
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

type QueueFunction<T = void> = () => T | Promise<T>;

interface QueueItem<T> {
  fn: QueueFunction<T>,
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}
/**
 * @example
 * const worker = new QueueWorker();
 * worker.add(() => console.log(`Task 0`));
 * worker.add(async () => { await fetch('/api/data'); });
 */
export class QueueWorker {
  queue: QueueItem<any>[] = [];
  running: boolean = false;
  /**
   * @example
   * worker.add(() => console.log(`Task 0`));
   * worker.add(async () => { await fetch(`/api/data`); })
   */
  add<T>(fn: QueueFunction<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });

      if (!this.running) {
        this.running = true;
        this.run();
      }
    });
  }

  private async run(): Promise<void> {
    while (this.queue.length > 0) {
      const item = this.queue.shift()!;

      try {
        const result = await item.fn();
        item.resolve(result);
      } catch (err) {
        item.reject(err);
      }
    }

    this.running = false;
  }
}