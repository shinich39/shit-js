export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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