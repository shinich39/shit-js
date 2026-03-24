/**
 * Returns the display width of a string based on East Asian Width.
 * Full-width characters (CJK, Hangul, etc.) count as 2, others as 1.
 *
 * @example
 * getStringWidth("hello"); // 5
 * getStringWidth("안녕"); // 4
 * getStringWidth("abc안녕"); // 7
 */
export function getStringWidth(str: string): number {
  let width = 0;
  for (const char of str) {
    const code = char.codePointAt(0);

    if (code === undefined) {
      width += 1;
      continue;
    }

    const isFullWidth =
      (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
      (code >= 0xac00 && code <= 0xd7a3) || // Hangul Syllables
      (code >= 0x1100 && code <= 0x11ff) || // Hangul Jamo
      (code >= 0xff01 && code <= 0xff60) || // Full-width Forms
      (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
      (code >= 0x3040 && code <= 0x30ff) || // Hiragana / Katakana
      (code >= 0x3000 && code <= 0x303f) || // CJK Symbols and Punctuation
      (code >= 0x3200 && code <= 0x32ff) || // Enclosed CJK
      (code >= 0x3300 && code <= 0x33ff); // CJK Compatibility

    width += isFullWidth ? 2 : 1;
  }
  return width;
}

/**
 * @example
 * toHalfWidth("Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"); // "Hello, world!"
 * toHalfWidth("１　２"); // "1 2"
 */
export function toHalfWidth(str: string): string {
  return str
    .replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/　/g, " ");
}

/**
 * @example
 * toFullWidth("Hello, world!"); // "Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"
 * toFullWidth("1 2"); // "１　２"
 */
export function toFullWidth(str: string): string {
  return str
    .replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xfee0))
    .replace(/ /g, "　");
}
