import { deepStrictEqual as eq, throws } from "node:assert";
import { test } from "node:test";
import { fromRegExp, toRegExp } from "./regexp";

test("toRegExp", () => {
  eq(toRegExp("abc"), /abc/);
  eq(toRegExp("/abc/gi"), /abc/gi);
  eq(toRegExp("/a/bc/gi"), /a\/bc/gi);
  eq(toRegExp("/a[\\\\/]c/gi"), /a[\\/]c/gi);
  throws(() => toRegExp("/abc"));
});

test("fromRegExp", () => {
  eq(fromRegExp(/abc/), "/abc/");
  eq(fromRegExp(/abc/gi), "/abc/gi");
});
