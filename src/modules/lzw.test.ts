import { describe, test } from "node:test";
import { eq } from "../../test/assert.js";
import { compressLzw, decompressLzw } from "./lzw";

test("LZW", () => {
  const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const compressed = compressLzw(str);
  const decompressed = decompressLzw(compressed);
  eq(str, decompressed);
});
