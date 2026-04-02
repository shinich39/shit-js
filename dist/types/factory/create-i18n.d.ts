/**
 * Internationalization(i18n)
 *
 * @example
 * const t = createI18n({
 *   en: { heading: "Hello, world!" },
 *   ko: { heading: "세상아, 안녕!" }
 * }, "en");
 *
 * t("heading"); // "Hello, world!"
 * t("heading", "en"); // "Hello, world!"
 * t("heading", "ko"); // "세상아, 안녕!"
 * t("missing", "en"); // "missing"
 */
export declare function createI18n(obj: Record<string, Record<string, string>>, defaultLocale: string): (key: string, locale?: string) => string;
//# sourceMappingURL=create-i18n.d.ts.map