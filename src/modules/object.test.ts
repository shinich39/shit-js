import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { copyObject, createI18n, createStore } from "./object";

test("copyObject", () => {
  const a = { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } };
  const b = copyObject(a);
  eq(b, { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } });
  a.arr = [0, 0, 0];
  eq(a, { arr: [0, 0, 0], obj: { o: 1, b: 2, j: 3 } });
  eq(b, { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } });
});

test("createI18n", () => {
  const t = createI18n(
    {
      en: {
        heading: "Hello, world!",
      },
      ko: {
        heading: "세상아, 안녕!",
      },
    },
    "en",
  );

  eq(t("en", "heading"), "Hello, world!");
  eq(t(null, "heading"), "Hello, world!");
  eq(t("ko", "heading"), "세상아, 안녕!");
  eq(t("en", "missing"), "missing");
});

test("createStore", () => {
  const initial = {
    count: 1,
  };

  const store = createStore<typeof initial>(initial, {
    count: (oldValue, newValue) => {
      eq(oldValue, newValue - 1);
    },
  });

  eq(store.count, 1);

  store.count++;

  eq(store.count, 2);
});
