import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createI18n } from "./create-i18n";

const t = createI18n(
  {
    en: { heading: "Hello, world!", desc: "Description" },
    ko: { heading: "세상아, 안녕!" },
  },
  "en",
);

test("createI18n: simple", () => {
  eq(t("heading"), "Hello, world!");
});

test("createI18n: basic", () => {
  eq(t("heading", "en"), "Hello, world!");
  eq(t("heading", "ko"), "세상아, 안녕!");
});

test("createI18n: no locale", () => {
  eq(t("heading"), "Hello, world!");
  eq(t("heading"), "Hello, world!");
  eq(t("heading", "ja"), "Hello, world!");
});

test("createI18n: no key", () => {
  eq(t("missing", "en"), "missing");
});

test("createI18n: no key in locale", () => {
  eq(t("desc", "ko"), "Description");
});

test("createI18n: no key in defaultLocale", () => {
  eq(t("missing", "ko"), "missing");
});
