import { describe, test } from "node:test";
import { deepStrictEqual as eq, throws, doesNotThrow, rejects } from "node:assert";
import { compressLzw, decompressLzw } from "./lzw";

test("compressLzw", () => {
  const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const compressed = compressLzw(str);
  eq(Array.isArray(compressed), true);
});

test("decompressLzw", () => {
  const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const compressed = compressLzw(str);
  const decompressed = decompressLzw(compressed);
  eq(str, decompressed);
});
