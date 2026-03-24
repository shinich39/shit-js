/**
 * @returns min <= n < max
 *
 * @example
 * randomFloat(0, 1); // 0.12451251251251
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * @returns min <= n < max
 *
 * @example
 * randomInt(0, 10); // 5
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * @param charset default: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-"
 * @param size default: 1
 * @example
 * randomString("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", 1); // "a"
 * randomString(); // "a"
 */
export function randomString(
  charset: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-",
  size: number = 1,
): string {
  const charsetSize = charset.length;

  let result = "";
  for (let i = 0; i < size; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetSize));
  }

  return result;
}
