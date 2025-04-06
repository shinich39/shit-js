import { describe, test } from "node:test";
import assert from "node:assert";
import { isNumeric, toNumber } from "./type";

test("isNumeric", () => {
  eq(isNumeric("1"), true);
  eq(isNumeric("a"), false);
});

test("toNumber", () => {
  eq(toNumber(0), 0);
  eq(toNumber(1), 1);
  eq(toNumber("0"), 0);
  eq(toNumber("1"), 1);
  eq(toNumber(true), 1);
  eq(toNumber(false), 0);
  eq(toNumber(null), 0);
  eq(toNumber(undefined), 0);
  try {
    toNumber({});
    eq(true, false);
  } catch (err) {}
  try {
    toNumber([]);
    eq(true, false);
  } catch (err) {}
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
