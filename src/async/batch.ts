/**
 * @example
 * const queue = [1, 2, 3, 4, 5].map((v) => () => Promise.resolve(v));
 * await batch(queue, 3);
 * // [1, 2, 3, 4, 5]
 */
export async function batch<T>(
  tasks: (() => Promise<T>)[],
  limit: number = Infinity,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const current = index++;
      results[current] = await tasks[current]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));

  return results;
}
