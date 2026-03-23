/**
 * @example
 * toRegExp("/abc/gi"); // /abc/gi
 */
export function toRegExp(str: string): RegExp {
  const parts = str.split("/");

  if (parts.length < 3) {
    throw new Error(`Invalid argument: ${str}`);
  }

  const flags = parts.pop();
  const pattern = parts.slice(1).join("/");

  return new RegExp(pattern, flags);
}
