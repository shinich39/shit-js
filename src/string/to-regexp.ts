/**
 * @example
 * toRegExp("abc");
 * // /abc/
 *
 * toRegExp("/abc/gi");
 * // /abc/gi
 */
export function toRegExp(str: string): RegExp {
  if (str.startsWith("/")) {
    const patternEnd = str.lastIndexOf("/");

    if (patternEnd === -1) {
      throw new Error("Invalid RegExp literal: missing '/'");
    }

    const pattern = str.substring(1, patternEnd);
    const flags = str.substring(patternEnd + 1);
    return new RegExp(pattern, flags);
  }

  return new RegExp(str);
}
