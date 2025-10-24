import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import {
  Brackets,
  getDiffs,
  getFloats,
  getInts,
  getRandomChar,
  getRandomString,
  getUuid,
  getXorString,
  matchStrings,
  normalizeString,
  Quotes,
  toRegExp,
} from "./string";

describe(path.basename(import.meta.filename), () => {

  test("getUuid", () => {
    eq(getUuid().length, 36); // ce0e915d-0b16-473c-bd89-d3d7492bb1b9
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

  test("getXorString", () => {
    const orig = "Hello, world!";
    const encrypted = getXorString(orig, "this is salt!");
    eq(encrypted !== orig, true);
    const decrypted = getXorString(encrypted, "this is salt!");
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

  test("getDiffs", () => {
    const b = "sit amet, adipiscing";
    const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    const result = getDiffs(a, b);

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

  test("Brackets", () => {
    const result = "( )[ ]{ }< >〈〉《》《》「」「」『』『』『』【】【】〔〕〘〙〚〛｢｣⟨⟩❨❩❪❫❴❵❬❭❮❯❰❱❲❳".split(
      new RegExp(
        Object.entries(Brackets)
          .reduce<string[]>((acc, cur) => [...acc, ...cur], [])
          .map((e) => `\\${e}`)
          .join("|")
      )
    )
    .join("")
    .trim();

    eq(result, "");
  })
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
