import { describe, test } from "node:test";
import assert from "node:assert";
import { getContainedSize, getCoveredSize } from "./size";

test("getContainedSize", () => {
  eq(getContainedSize(1, 1, 2, 1), [1, 1]);
});

test("getCoveredSize", () => {
  eq(getCoveredSize(1, 1, 2, 1), [2, 2]);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
