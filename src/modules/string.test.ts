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
  matchStrings,
  normalizeString,
  splitString,
  toRegExp,
} from "./string";

describe(path.basename(import.meta.filename), () => {

  test("getUUID", () => {
    eq(getUUID().length, 36); // ce0e915d-0b16-473c-bd89-d3d7492bb1b9
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
    const orig = "Hello, world!";
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
    const b = "sit amet, adipiscing";
    const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    const result = compareString(a, b);

    eq(result, [
      [ -1, 'Lorem ip' ],
      [ 0, 's' ],
      [ -1, 'um dolor s' ],
      [ 0, 'it amet, ' ],
      [ -1, 'consectetur ' ],
      [ 0, 'adipiscing' ],
      [ -1, ' elit.' ]
    ]);
  });

  test("matchStrings", () => {
    const b = "sit amet, adipiscing";
    const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    const result = matchStrings(a, b);

    eq(result, {
      matchRate: 0.35714285714285715,
      similarity: 0.35714285714285715,
      diceSimilarity: 0.5263157894736842,
      jaccardSimilarity: 0.35714285714285715,
      distance: 36,
      normalizedDistance: 0.6428571428571429,
      matches: 20,
      insertions: 0,
      deletions: 36
    });
  });

  test("findString", () => {
    eq(findString("<div>div</div>", "d"), 5);
    eq(findString("<div>div</div>", "div"), 5);
  });

  test("splitString", () => {
    const result = splitString("[artist] title (subtitle (subsubtitle)) vol.1.zip");
    eq(result, [
      'artist',
      ' title ',
      'subtitle ',
      'subsubtitle',
      ' vol.1.zip'
    ]);
  });
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
