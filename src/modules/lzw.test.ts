import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import { toLzw, fromLzw } from "./lzw";

test("toLzw", () => {
  const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const compressed = toLzw(str);
  eq(Array.isArray(compressed), true);
});

test("fromLzw", () => {
  const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const compressed = toLzw(str);
  const decompressed = fromLzw(compressed);
  eq(str, decompressed);
});
