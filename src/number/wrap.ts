/**
 * @returns min <= n < max
 *
 * @example
 * wrap(5, 0, 10);  // 5
 * wrap(-1, 0, 10); // 9
 * wrap(10, 0, 10); // 0
 * wrap(11, 0, 10); // 1
 */
export function wrap(num: number, min: number, max: number): number {
  num -= min;
  max -= min;

  if (num < 0) {
    num = (num % max) + max;
  }

  if (num >= max) {
    num = num % max;
  }

  return num + min;
}
