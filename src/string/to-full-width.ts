/**
 * @example
 * toFullWidth("Hello, world!");
 * // "Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"
 *
 * toFullWidth("1 2");
 * // "１　２"
 */
export function toFullWidth(str: string): string {
  return str
    .replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xfee0))
    .replace(/ /g, "　");
}
