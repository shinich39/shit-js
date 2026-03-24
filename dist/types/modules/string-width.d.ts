/**
 * Returns the display width of a string based on East Asian Width.
 * Full-width characters (CJK, Hangul, etc.) count as 2, others as 1.
 *
 * @example
 * getStringWidth("hello"); // 5
 * getStringWidth("안녕"); // 4
 * getStringWidth("abc안녕"); // 7
 */
export declare function getStringWidth(str: string): number;
/**
 * @example
 * toHalfWidth("Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"); // "Hello, world!"
 * toHalfWidth("１　２"); // "1 2"
 */
export declare function toHalfWidth(str: string): string;
/**
 * @example
 * toFullWidth("Hello, world!"); // "Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"
 * toFullWidth("1 2"); // "１　２"
 */
export declare function toFullWidth(str: string): string;
//# sourceMappingURL=string-width.d.ts.map