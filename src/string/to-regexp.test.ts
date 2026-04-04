import { deepStrictEqual as eq, throws } from "node:assert";
import { test } from "node:test";
import { toRegExp } from "./to-regexp";

test("toRegExp", () => {
  eq(toRegExp("abc"), /abc/);
  eq(toRegExp("/abc/gi"), /abc/gi);
  eq(toRegExp("/a/bc/gi"), /a\/bc/gi);
  eq(toRegExp("/a[\\\\/]c/gi"), /a[\\/]c/gi);

  const re = toRegExp("/abc/gi");
  eq("/abc/gi", `/${re.source}/${re.flags}`);

  throws(() => toRegExp("/abc"));
});
