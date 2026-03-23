/**
 * Internationalization(i18n)
 *
 * @example
 * const t = createI18n({
 *   en: { heading: "Hello, world!" },
 *   ko: { heading: "세상아, 안녕!" }
 * }, "en");
 *
 * t("en", "heading"); // "Hello, world!"
 * t(null, "heading"); // "Hello, world!"
 * t("ko", "heading"); // "세상아, 안녕!"
 * t("en", "missing"); // "missing"
 */
export declare function createI18n(obj: Record<string, Record<string, string>>, defaultLocale: string): (locale: string | null | undefined, key: string) => string;
//# sourceMappingURL=create-i18n.d.ts.map