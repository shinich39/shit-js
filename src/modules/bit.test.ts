import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import { checkBit, clearBit, setBit, toggleBit } from "./bit";

test("checkBit", () => {
  eq(checkBit(0b1100, 0b1000), true);
  eq(checkBit(0b1100, 0b0100), true);
  eq(checkBit(0b1100, 0b1100), true);

  eq(checkBit(0b1100, 0b0001), false);
  eq(checkBit(0b1100, 0b0010), false);
  eq(checkBit(0b1100, 0b0011), false);
});

test("setBit", () => {
  eq(setBit(0b1100, 0b1000), 0b1100);
  eq(setBit(0b1100, 0b1100), 0b1100);
  eq(setBit(0b1100, 0b1110), 0b1110);
  eq(setBit(0b1100, 0b1111), 0b1111);
});

test("clearBit", () => {
  eq(clearBit(0b1100, 0b1000), 0b0100);
  eq(clearBit(0b1100, 0b1100), 0b0000);
  eq(clearBit(0b1100, 0b1110), 0b0000);
  eq(clearBit(0b1100, 0b1111), 0b0000);
});

test("toggleBit", () => {
  eq(toggleBit(0b1100, 0b1000), 0b0100);
  eq(toggleBit(0b1100, 0b1100), 0b0000);
  eq(toggleBit(0b1100, 0b1110), 0b0010);
  eq(toggleBit(0b1100, 0b1111), 0b0011);
});