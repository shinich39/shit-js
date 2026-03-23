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
