import { describe, test } from "node:test";
import { deepStrictEqual as eq, throws, doesNotThrow, rejects } from "node:assert";
import {
  Brackets,
  Quotes,
  toCamelCase,
  getDiffs,
  getFloats,
  getInts,
  generateString,
  getStringSize,
  generateUuid,
  generateXor,
  matchStrings,
  toHalfWidthString,
  toSlug,
  toRegExp,
  toFullWidthString,
  toPascalCase,
} from "./string";

test("toSlug", () => {
  const result = toSlug("Lorem  ipsum");
  eq(result, "lorem-ipsum");
});

test("toCamelCase", () => {
  const result = toCamelCase("Lorem ipsum");
  eq(result, "loremIpsum");
});

test("toPascalCase", () => {
  const result = toPascalCase("lorem ipsum");
  eq(result, "LoremIpsum");
});

test("generateUuid", () => {
  eq(generateUuid().length, 36); // ce0e915d-0b16-473c-bd89-d3d7492bb1b9
});

test("generateString", () => {
  eq(/^[abc]+$/.test(generateString("abc", 100)), true);
});

test("generateXor", () => {
  const orig = "Hello, world!";
  const encrypted = generateXor(orig, "this is salt!");
  eq(encrypted !== orig, true);
  const decrypted = generateXor(encrypted, "this is salt!");
  eq(decrypted, orig);
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

test("toHalfWidthString", () => {
  eq(toHalfWidthString("Ｈｅｌｌｏ，　ｗｏｒｌｄ！"), "Hello, world!");
});

test("toFullWidthString", () => {
  eq(toFullWidthString("Hello, world!"), "Ｈｅｌｌｏ，　ｗｏｒｌｄ！");
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
});

test("getStringSize", () => {
  eq(getStringSize("abc"), 3);
  eq(getStringSize("ㄱㄴㄷ"), 9);
  eq(getStringSize("가나다"), 9);
});