/**
 * @example
 * await sleep(1000); 
 * // Wait 1s...
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @example
 * const fn = async () => { ... };
 * const wrappedFn = retry(fn, 10, 1000);
 * await wrappedFn((count) => {
 *   console.log(count); // 1...2...3...
 * });
 */
export function retry<T>(
  fn: () => Promise<T>,
  count: number,
  delay: number,
): (callback?: (count: number) => void | Promise<void>) => Promise<T> {
  return async function wrapped(cb): Promise<T> {
    let lastError: unknown;

    for (let i = 0; i < count; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err
        if (i < count - 1) {
          await cb?.(i);
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError;
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