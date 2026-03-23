import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { toFullWidth } from "./to-full-width";

test("toFullWidth", () => {
  eq(toFullWidth("Hello, world!"), "Ｈｅｌｌｏ，　ｗｏｒｌｄ！");
});
