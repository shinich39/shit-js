/**
 * @returns min <= n < max
 *
 * @example
 * randomInt(0, 10); // 5
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
