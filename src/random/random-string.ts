/**
 * @param charset default: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-"
 * @param size default: 1
 * @example
 * randomString(1, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-");
 * // "a"
 *
 * randomString();
 * // "a"
 */
export function randomString(
  size: number = 1,
  charset: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-",
): string {
  const charsetSize = charset.length;

  let result = "";

  for (let i = 0; i < size; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetSize));
  }

  return result;
}
