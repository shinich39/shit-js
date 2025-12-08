import { describe, test } from "node:test";
import { eq } from "../../test/assert.js";
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
