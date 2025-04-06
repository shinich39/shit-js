/**
 * @returns min <= n < max
 */
export function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
/**
 * @returns min <= n <= max
 */
export function getClampedNumber(num: number, min: number, max: number) {
  return Math.min(max, Math.max(num, min));
}
/**
 * @returns min <= n < max
 */
export function getLoopedNumber(num: number, min: number, max: number) {
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
