import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createI18n } from "./create-i18n";

test("createI18n", () => {
  const t = createI18n(
    {
      en: { heading: "Hello, world!", desc: "Description" },
      ko: { heading: "세상아, 안녕!" },
    },
    "en",
  );

  // basic usage
  eq(t("en", "heading"), "Hello, world!");
  eq(t("ko", "heading"), "세상아, 안녕!");

  // null/undefined → defaultLocale
  eq(t(null, "heading"), "Hello, world!");
  eq(t(undefined, "heading"), "Hello, world!");

  // no locale → defaultLocale
  eq(t("ja", "heading"), "Hello, world!");

  // no key → key
  eq(t("en", "missing"), "missing");

  // no key in locale → defaultLocale fallback
  eq(t("ko", "desc"), "Description");

  // no key in defaultLocale → key
  eq(t("ko", "missing"), "missing");
});
