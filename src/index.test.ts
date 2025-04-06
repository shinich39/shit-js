import { describe, test } from "node:test";
import assert from "node:assert";

describe("index.ts", () => {
  test("test", () => {
    eq(1 + 2, 3);
  });
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
