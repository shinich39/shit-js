/**
 * @example
 * extractNumbers("ftp://192.168.0.1 1 2 3"); // [192.168, 0.1, 1, 2, 3]
 */
export function extractNumbers(str: string): number[] {
  return str.match(/[0-9]+(\.[0-9]+)?/g)?.map((item) => parseFloat(item)) || [];
}
