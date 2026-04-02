/**
 * @example
 * const debounced = debounce((arg: string) => {
 *   console.log(arg);
 * }, 300);
 *
 * debounced("a"); // skip
 * debounced("ab"); // skip
 * debounced("abc"); // only "abc" runs after 300ms
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}
