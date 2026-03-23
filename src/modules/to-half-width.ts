/**
 * 1. Change full-width characters to half-width characters
 * 2. Change all type of whitespaces to " "
 *
 * @example
 * toHalfWidth("Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"); // "Hello, world!"
 */
export function toHalfWidth(str: string): string {
  return str
    .replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/[^\S\r\n]/g, " ");
}
