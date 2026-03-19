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
 * const queue = createQueue();
 * queue(() => console.log("Task 0"));
 * queue(async () => { await fetch("/api/data"); });
 */
export function createQueue(): (fn: () => Promise<void>) => Promise<void> {
  let queue: Promise<void> = Promise.resolve();
  return (fn) => {
    return new Promise<void>((resolve, reject) => {
      queue = queue.then(fn).then(resolve).catch(reject);
    });
  };
}
