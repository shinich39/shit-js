import { describe, test } from "node:test";
import assert from "node:assert";
import {
  compareString,
  escapeXML,
  normalizeString,
  toRegExp,
  unescapeXML,
} from "./string";

test("normalizeString", () => {
  eq(normalizeString("Ｈｅｌｌｏ，　ｗｏｒｌｄ！"), "Hello, world!");
});

test("escapeXML", () => {
  eq(escapeXML(`<div>a c</div>`), `&lt;div&gt;a c&lt;/div&gt;`);
  eq(escapeXML(`<div>a c</div>`, true), `&lt;div&gt;a&nbsp;c&lt;/div&gt;`);
});

test("unescapeXML", () => {
  eq(unescapeXML(`&lt;div&gt;a c&lt;/div&gt;`), `<div>a c</div>`);
  eq(unescapeXML(`&lt;div&gt;a&nbsp;c&lt;/div&gt;`), `<div>a c</div>`);
});

test("toRegExp", () => {
  eq(toRegExp("/abc/gi"), /abc/gi);
  eq(toRegExp("/a/bc/gi"), /a\/bc/gi);
  eq(toRegExp("/a[\\\\\/]c/gi"), /a[\\/]c/gi);
});

test("compareString", () => {
  eq(compareString("abc", "ac"), [
    [0, "a"],
    [-1, "b"],
    [0, "c"],
  ]);
  eq(compareString("ac", "abc"), [
    [0, "a"],
    [1, "b"],
    [0, "c"],
  ]);
  eq(compareString("abc", "abc"), [[0, "abc"]]);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
