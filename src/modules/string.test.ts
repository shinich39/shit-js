import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import {
  BRACKETS,
  QUOTES,
  toCamelCase,
  getDiffs,
  getFloats,
  getInts,
  generateString,
  getStringSize,
  generateUuid,
  toXor,
  compareStrings,
  toHalfWidthString,
  toSlug,
  toRegExp,
  toFullWidthString,
  toPascalCase,
  toSentenceCase,
  toTitleCase,
  createTemplate,
} from "./string";

test("toSentenceCase", () => {
  eq(toSentenceCase("lorem ipsum"), "Lorem ipsum");
});

test("toSlug", () => {
  eq(toSlug("Lorem ipsum"), "lorem-ipsum");
  eq(toSlug("Lorem  ipsum"), "lorem-ipsum");
  eq(toSlug("Lorem  ipsum"), "lorem-ipsum");
});

test("toCamelCase", () => {
  eq(toCamelCase("Lorem ipsum"), "loremIpsum");
});

test("toPascalCase", () => {
  eq(toPascalCase("lorem ipsum"), "LoremIpsum");
  eq(toPascalCase("lorem-ipsum"), "LoremIpsum");
  eq(toPascalCase("lorem_ipsum"), "LoremIpsum");
});

test("toTitleCase", () => {
  eq(toTitleCase("lorem ipsum"), "Lorem Ipsum");
  eq(toTitleCase("lorem-ipsum"), "Lorem Ipsum");
  eq(toTitleCase("lorem_ipsum"), "Lorem Ipsum");
});

test("generateUuid", () => {
  eq(generateUuid().length, 36); // ce0e915d-0b16-473c-bd89-d3d7492bb1b9
});

test("generateString", () => {
  eq(/^[abc]+$/.test(generateString("abc", 100)), true);
});

test("toXor", () => {
  const orig = "Hello, world!";
  const encrypted = toXor(orig, "this is salt!");
  eq(encrypted !== orig, true);
  const decrypted = toXor(encrypted, "this is salt!");
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

test("compareStrings", () => {
  const b = "sit amet, adipiscing";
  const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const result = compareStrings(a, b);

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

test("BRACKETS", () => {
  const result = "()[]{}<>〈〉《》《》「」「」『』『』『』【】【】〔〕〘〙〚〛｢｣⟨⟩❨❩❪❫❴❵❬❭❮❯❰❱❲❳".split(
    new RegExp(
      Object.entries(BRACKETS)
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

test("createTemplate", () => {
  eq(createTemplate("${a} != ${b}")({ a: "1", b: "2" }), "1 != 2");
  eq(createTemplate("Lorem ipsum dolor ${a.b.c}")({ a: { b: { c: "sit amet" } } }), "Lorem ipsum dolor sit amet");
  eq(createTemplate("Lorem ipsum dolor ${a.b.c}")({ }), "Lorem ipsum dolor ");
  eq(createTemplate("Lorem ipsum dolor ${a.b.c}")({ a: { b: { c: { d: "NULL" }}}}), "Lorem ipsum dolor [object Object]");
});