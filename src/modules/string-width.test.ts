import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { getStringWidth, toFullWidth, toHalfWidth } from "./string-width";

test("getStringWidth", () => {
  eq(getStringWidth("hello"), 5);
  eq(getStringWidth("안녕"), 4);
  eq(getStringWidth("abc안녕"), 7);
});

test("toHalfWidth", () => {
  eq(toHalfWidth("Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"), "Hello, world!");
  eq(toHalfWidth("１　２"), "1 2");
});

test("toFullWidth", () => {
  eq(toFullWidth("Hello, world!"), "Ｈｅｌｌｏ，　ｗｏｒｌｄ！");
  eq(toFullWidth("1 2"), "１　２");
});
