/**
 * @example
 * extractInts("ftp://192.168.0.1 1 2 3"); // [192, 168, 0, 1, 1, 2, 3]
 */
export function extractInts(str: string): number[] {
  return str.match(/([0-9]+)/g)?.map((item) => parseInt(item, 10)) || [];
}
