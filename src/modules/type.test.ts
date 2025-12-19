import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import { getType, isBuffer, isNumber, isNumeric, toBuffer, toNumber } from "./type";

test("getType", () => {
  eq(getType(undefined), "undefined");
  eq(getType(null), "null");
  eq(getType(true), "boolean");
  eq(getType(1), "number");
  eq(getType("1"), "string");
  eq(getType({}), "object");
  eq(getType([]), "array");
  eq(getType(new Date()), "date");
  eq(getType(/abc/), "regexp");
});

test("isNumeric", () => {
  eq(isNumeric("1"), true);
  eq(isNumeric(1), false);
  eq(isNumeric("a"), false);
});

test("isNumber", () => {
  eq(isNumber("1"), true);
  eq(isNumber(1), true);
  eq(isNumber("a"), false);
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
  throws(() => { toNumber({}); });
  throws(() => { toNumber([]); });
});

test("isBuffer", () => {
  eq(isBuffer(Buffer.from(new ArrayBuffer(10))), true);
  eq(isBuffer(new ArrayBuffer(10)), true);
});

test("toBuffer", () => {
  const buffer = Buffer.from(new ArrayBuffer(10));
  const arrayBuffer = new ArrayBuffer(10);
  eq(toBuffer(buffer) instanceof Buffer, true);
  eq(toBuffer(arrayBuffer) instanceof Buffer, true);
});