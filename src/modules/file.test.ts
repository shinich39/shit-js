import { describe, test } from "node:test";
import assert from "node:assert";
import { calcStringSize, convertFileSize, humanizeFileSize } from "./file";

test("calcStringSize", () => {
  eq(calcStringSize("abc"), 3);
  eq(calcStringSize("ㄱㄴㄷ"), 9);
  eq(calcStringSize("가나다"), 9);
});

test("convertFileSize", () => {
  eq(convertFileSize(1024 * 1024, "Bytes", "MB"), 1);
  eq(convertFileSize(1024 * 1024 * 1024, "Bytes", "GB"), 1);
});

test("humanizeFileSize", () => {
  eq(humanizeFileSize(1024 * 1024, "Bytes"), "1.00 MB");
  eq(humanizeFileSize(1024 * 1024 * 1024, "Bytes"), "1.00 GB");
  eq(
    humanizeFileSize(1024 * 1024 * 1024 + 1024 * 1024 * 512, "Bytes"),
    "1.50 GB"
  );
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
