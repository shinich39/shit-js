import { describe, test } from "node:test";
import assert from "node:assert";
import { getRandomNumber, getClampedNumber, getLoopedNumber } from "./number";

test("getRandomNumber", () => {
  eq(getRandomNumber(0, 1) < 1, true);
  eq(getRandomNumber(0, 1) >= 0, true);
});

test("getClampedNumber", () => {
  eq(getClampedNumber(0.5, 0, 1), 0.5);
  eq(getClampedNumber(2, 0, 1), 1);
  eq(getClampedNumber(-1, 0, 1), 0);
  eq(getClampedNumber(1, 0, 1), 1);
  eq(getClampedNumber(0, 0, 1), 0);
});

test("getLoopedNumber", () => {
  eq(getLoopedNumber(0, 0, 10), 0);
  eq(getLoopedNumber(5, 0, 10), 5);
  eq(getLoopedNumber(10, 0, 10), 0);
  eq(getLoopedNumber(11, 0, 10), 1);
  eq(getLoopedNumber(15, 0, 10), 5);
  eq(getLoopedNumber(20, 0, 10), 0);
  eq(getLoopedNumber(5, 5, 10), 5);
  eq(getLoopedNumber(0, 5, 10), 5);
  eq(getLoopedNumber(2.5, 5, 10), 7.5);
  eq(getLoopedNumber(-2.5, 5, 10), 7.5);
  eq(getLoopedNumber(7.5, 5, 10), 7.5);
  eq(getLoopedNumber(10, 5, 10), 5);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
