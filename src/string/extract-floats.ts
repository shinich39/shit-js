/**
 * @example
 * extractFloats("ftp://192.168.0.1 1 2 3"); // [192.168, 0.1]
 */
export function extractFloats(str: string): number[] {
  return str.match(/[0-9]+\.[0-9]+/g)?.map((item) => parseFloat(item)) || [];
}
