import { describe, test } from "node:test";
import assert from "node:assert";
import { Bit } from "./bit";

test("Bit.check", () => {
  eq(Bit.check(0b1100, 0b1000), true);
  eq(Bit.check(0b1100, 0b0100), true);
  eq(Bit.check(0b1100, 0b1100), true);
});

test("Bit.set", () => {
  eq(Bit.set(0b1100, 0b1000), 0b1100);
  eq(Bit.set(0b1100, 0b1100), 0b1100);
  eq(Bit.set(0b1100, 0b1110), 0b1110);
  eq(Bit.set(0b1100, 0b1111), 0b1111);
});

test("Bit.clear", () => {
  eq(Bit.clear(0b1100, 0b1000), 0b0100);
  eq(Bit.clear(0b1100, 0b1100), 0b0000);
  eq(Bit.clear(0b1100, 0b1110), 0b0000);
  eq(Bit.clear(0b1100, 0b1111), 0b0000);
});

test("Bit.invert", () => {
  eq(Bit.invert(0b1100, 0b1000), 0b0100);
  eq(Bit.invert(0b1100, 0b1100), 0b0000);
  eq(Bit.invert(0b1100, 0b1110), 0b0010);
  eq(Bit.invert(0b1100, 0b1111), 0b0011);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
