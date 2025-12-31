import { generateInt } from "./number.js";

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

type TypingOptions = {
  character?: {
    min: number;
    max: number;
  },
  word?: {
    min: number;
    max: number;
  },
  sentence?: {
    min: number;
    max: number;
  },
  acceleration?: {
    /** ms */
    strength: number,
    frequency: number,
  },
  clamp?: {
    min: number;
    max: number; 
  }
};

export async function typing(
  value: string,
  callback: (character: string, index: number, string: string) => void | Promise<void>,
  options?: TypingOptions,
): Promise<void> {
  const defaultOptions: Required<TypingOptions> = {
    character: { min: 35, max: 95 },
    word: { min: 120, max: 200 },
    sentence: { min: 220, max: 380 },
    acceleration: { strength: 18, frequency: 3.2 },
    clamp: { min: 28, max: 420 },
  }

  const resolveOptions = (options?: TypingOptions) => {
    return {
      character: { ...defaultOptions.character, ...options?.character },
      word: { ...defaultOptions.word, ...options?.word },
      sentence: { ...defaultOptions.sentence, ...options?.sentence },
      acceleration: { ...defaultOptions.acceleration, ...options?.acceleration },
      clamp: { ...defaultOptions.clamp, ...options?.clamp },
    }
  }

  const createDelay = (char: string, index: number) => {
    let base: number;

    if (/[.,!?]/.test(char)) {
      base = generateInt(opts.sentence.min, opts.sentence.max);
    } else if (char === " ") {
      base = generateInt(opts.word.min, opts.word.max);
    } else {
      base = generateInt(opts.character.min, opts.character.max);
    }

    const accel = Math.sin(index / opts.acceleration.frequency) * opts.acceleration.strength;
    base -= accel;

    // Clamp
    return Math.max(opts.clamp.min, Math.min(base, opts.clamp.max));
  }

  const opts = resolveOptions(options);

  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    const d = createDelay(c, i);

    await callback(c, i, value);
    await sleep(d);
  }
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
  add(fn: () => void | Promise<void>): void {
    this.queue.push(fn);
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
      const task = this.queue.shift();
      
      if (!task) {
        break;
      }

      await task();
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