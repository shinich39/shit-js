import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { compressLZW, decompressLZW } from "./lzw";

describe(path.basename(import.meta.filename), () => {

  test("LZW", () => {
    const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    const compressed = compressLZW(str);
    const decompressed = decompressLZW(compressed);
    eq(str, decompressed);
  });

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
