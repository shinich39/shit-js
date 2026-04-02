/**
 * @example
 * lerp(0, 100, 0);   // 0
 * lerp(0, 100, 0.5); // 50
 * lerp(0, 100, 1);   // 100
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
