/**
 * @example
 * await sleep(1000);
 * // wait 1s...
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @example
 * const fn = async () => { ... };
 * const wrappedFn = retry(fn, 10, 1000);
 * await wrappedFn((index) => {
 *   console.log(index); // 0...1...2
 * });
 */
export async function retry<T>(
  fn: () => Promise<T>,
  count: number,
  delay: number,
  callback?: (index: number, error: unknown) => void | Promise<void>,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < count; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < count - 1) {
        await callback?.(i, err);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * @example
 * const worker = new QueueWorker();
 *
 * worker.add(() => console.log("Task 0"));
 *
 * worker.add(async () => {
 *   await fetch("/api/data");
 * });
 *
 * worker.add(async () => { await sleep(100); console.log("1"); });
 * worker.add(async () => { await sleep(50);  console.log("2"); });
 */
export class QueueWorker {
  _: Promise<void> = Promise.resolve();

  add(fn: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ = this._.then(fn).then(resolve).catch(reject);
    });
  }
}
