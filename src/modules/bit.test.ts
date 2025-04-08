import { describe, test } from "node:test";
import assert from "node:assert";
import { bitwise } from "./bit";

test("bitwise.eqauls", () => {
  eq(bitwise(0b1100).equals(0b1000), true);
  eq(bitwise(0b1100).equals(0b0100), true);
  eq(bitwise(0b1100).equals(0b1100), true);
});

test("bitwise.set", () => {
  eq(bitwise(0b1100).set(0b1000), 0b1100);
  eq(bitwise(0b1100).set(0b1100), 0b1100);
  eq(bitwise(0b1100).set(0b1110), 0b1110);
  eq(bitwise(0b1100).set(0b1111), 0b1111);
});

test("bitwise.unset", () => {
  eq(bitwise(0b1100).unset(0b1000), 0b0100);
  eq(bitwise(0b1100).unset(0b1100), 0b0000);
  eq(bitwise(0b1100).unset(0b1110), 0b0000);
  eq(bitwise(0b1100).unset(0b1111), 0b0000);
});

test("bitwise.invert", () => {
  eq(bitwise(0b1100).invert(0b1000), 0b0100);
  eq(bitwise(0b1100).invert(0b1100), 0b0000);
  eq(bitwise(0b1100).invert(0b1110), 0b0010);
  eq(bitwise(0b1100).invert(0b1111), 0b0011);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
