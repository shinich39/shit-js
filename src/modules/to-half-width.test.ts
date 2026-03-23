import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { toHalfWidth } from "./to-half-width";

test("toHalfWidth", () => {
  eq(toHalfWidth("Ｈｅｌｌｏ，\u3000ｗｏｒｌｄ！"), "Hello, world!");
  eq(toHalfWidth("１　２"), "1 2");
});
