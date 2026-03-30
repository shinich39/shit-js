/**
 * @example
 * toFixed(1.2345, 2); // 1.23
 * toFixed(1.005, 2);  // 1.01
 * toFixed(1.5);       // 2
 */
export function toFixed(value: number, digits: number = 0): number {
  // const factor = Math.pow(10, digits);
  // return Math.round((value + Number.EPSILON) * factor) / factor;
  return Number(Math.round(Number(`${value}e${digits}`)) + `e-${digits}`);
}
