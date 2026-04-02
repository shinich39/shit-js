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
