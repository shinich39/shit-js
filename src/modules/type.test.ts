import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { getType, isNumeric, toNumber } from "./type";

describe(path.basename(import.meta.filename), () => {
  
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

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
