import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { toRegExp } from "./to-regexp";

test("toRegExp", () => {
  eq(toRegExp("/abc/gi"), /abc/gi);
  eq(toRegExp("/a/bc/gi"), /a\/bc/gi);
  eq(toRegExp("/a[\\\\/]c/gi"), /a[\\/]c/gi);
});
