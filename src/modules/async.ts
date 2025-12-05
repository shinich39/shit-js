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
 * const result = await wrappedFunc(1);
 * console.log(result); // 1
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
 * input.addEventListener("input", debounce((e) => { ... }, 100));
 */
export function debounce(
  func: (...args: any[]) => any,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
/**
 * @example
 * const worker = new QueueWorker();
 * worker.add((index) => console.log(`Task ${index}`));
 * worker.add(async (index) => {
 *   await fetch('/api/data');
 *   console.log(`Task ${index}`);
 * });
 */
export class QueueWorker {
  inProgress: boolean;
  queue: ((index: number) => void | Promise<void>)[];
  index: number;

  constructor() {
    this.inProgress = false;
    this.queue = [];
    this.index = 0;
  }

  add(func: (index: number) => void | Promise<void>): void {
    this.queue.push(func);
    this.index++;
  }

  async start(): Promise<void> {
    this.inProgress = true;
    while(this.inProgress && this.queue.length > 0) {
      const index = this.index - this.queue.length - 1;
      const func = this.queue.shift()!;
      await func(index);
    }
    this.inProgress = false;
  }

  stop(): void {
    this.queue = [];
    this.inProgress = false;
  }

  pause(): void {
    this.inProgress = false;
  }
}