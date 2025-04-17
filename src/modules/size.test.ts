import { describe, test } from "node:test";
import assert from "node:assert";
import { getAdjustedSize, getContainedSize, getCoveredSize } from "./size";

test("getContainedSize", () => {
  eq(getContainedSize(1, 1, 2, 1), [1, 1]);
});

test("getCoveredSize", () => {
  eq(getCoveredSize(1, 1, 2, 1), [2, 2]);
});

test("getAdjustedSize", () => {
  eq(getAdjustedSize(500, 500, 200, 200, 100, 100), [200, 200]);
  eq(getAdjustedSize(500, 1000, 200, 200, 100, 100), [100, 200]);
  eq(getAdjustedSize(5, 10, 200, 200, 100, 100), [100, 200]);
  eq(getAdjustedSize(175, 175, 200, 200, 100, 100), [175, 175]);
  eq(getAdjustedSize(150, 150, 200, 200, 100, 100), [150, 150]);
  eq(getAdjustedSize(200, 400, 200, 200, 100, 100), [100, 200]);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
