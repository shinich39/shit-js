import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import {
  compareString,
  findString,
  getFloats,
  getInts,
  getRandomChar,
  getRandomString,
  getUUID,
  getXORString,
  normalizeString,
  toRegExp,
} from "./string";

describe(path.basename(import.meta.filename), () => {
  
  test("findString", () => {
    eq(findString("<div>div</div>", "d"), 5);
    eq(findString("<div>div</div>", "div"), 5);
  });

  test("getUUID", () => {
    eq(getUUID().length, 36);
  });

  test("getRandomChar", () => {
    eq(/[abc]/.test(getRandomChar("abc")), true);
  });

  test("getRandomString", () => {
    eq(/^[abc]+$/.test(getRandomString("abc", 100)), true);
  });

  test("getInts", () => {
    eq(getInts("ftp://192.168.0.1"), [192, 168, 0, 1]);
  });

  test("getFloats", () => {
    eq(getFloats("ftp://192.168.0.1"), [192.168, 0.1]);
    eq(getFloats("abc 39.39 miku"), [39.39]);
    eq(getFloats("abc 39 miku 39"), [39, 39]);
    eq(getFloats("abc 39 39.39 miku"), [39, 39.39]);
  });

  test("getXORString", () => {
    const orig =
      "https://translate.google.co.kr/?sl=en&tl=ko&text=encrypt%20string%20with%20XOR%20cipher&op=translate";
    const encrypted = getXORString(orig, "this is salt!");
    eq(encrypted !== orig, true);
    const decrypted = getXORString(encrypted, "this is salt!");
    eq(decrypted, orig);
  });

  test("normalizeString", () => {
    eq(normalizeString("Ｈｅｌｌｏ，　ｗｏｒｌｄ！"), "Hello, world!");
  });

  test("toRegExp", () => {
    eq(toRegExp("/abc/gi"), /abc/gi);
    eq(toRegExp("/a/bc/gi"), /a\/bc/gi);
    eq(toRegExp("/a[\\\\\/]c/gi"), /a[\\/]c/gi);
  });

  test("compareString", () => {
    const result = compareString(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "sit amet"
    );
    eq(result.accuracy, 0.25);
    eq(result.score, 8);
    eq(result.match, [
      [ -1, 'Lorem ipsum dolor ' ],
      [ 0, 'sit am' ],
      [ -1, 'et, consectetur adipiscing ' ],
      [ 0, 'e' ],
      [ -1, 'li' ],
      [ 0, 't' ],
      [ -1, '.' ]
    ]);
  });

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
