/**
 * @example
 * toDegrees(0);           // 0
 * toDegrees(Math.PI / 2); // 90
 * toDegrees(Math.PI);     // 180
 * toDegrees(Math.PI * 2); // 360
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
