/**
 * @example
 * await sleep(1000); // 1s
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @example
 * const func = await function(arg: any) => arg;
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
 * worker.add(() => console.log('Task 1'));
 * worker.add(async () => {
 *   await fetch('/api/data');
 *   console.log('Task 2');
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
    if (!this.inProgress) {
      this.run();
    }
  }

  async run(): Promise<void> {
    this.inProgress = true;
    while(this.queue.length > 0) {
      await this.queue.shift()!();
    }
    this.inProgress = false;
  }
}