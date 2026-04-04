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

  // basic
  eq(t("heading"), "Hello, world!");
  eq(t("heading", "en"), "Hello, world!");
  eq(t("heading", "ko"), "세상아, 안녕!");

  // no locale
  eq(t("heading"), "Hello, world!");
  eq(t("heading", "ja"), "Hello, world!");

  // no key
  eq(t("missing", "en"), "missing");

  // no key in locale
  eq(t("desc", "ko"), "Description");

  // no locale => no key in default locale
  eq(t("missing", "ko"), "missing");
});
