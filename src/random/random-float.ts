/**
 * @returns min <= n < max
 *
 * @example
 * randomFloat(0, 1); // 0.12451251251251
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
