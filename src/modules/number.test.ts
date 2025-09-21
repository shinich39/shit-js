import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import {
  getClampedNumber,
  getLoopedNumber,
  calcStringSize,
  humanizeFileSize,
  getContainedSize,
  getCoveredSize,
  getAdjustedSize,
  toFileSize,
  toBytes,
  getRandomInt,
  getRandomIntWithSeed,
  getRandomFloat,
  getRandomFloatWithSeed,
  getLengthFromInt,
  getLengthFromFloat,
} from "./number";

describe(path.basename(import.meta.filename), () => {

  test("getRandomFloat", () => {
    eq(getRandomFloat(0, 1) < 1, true);
    eq(getRandomFloat(0, 1) >= 0, true);
  });

  test("getRandomFloatWithSeed", () => {
    eq(getRandomFloatWithSeed(0, 1, 0), 0.26642920868471265);
    eq(getRandomFloatWithSeed(0, 1, 10), 0.5019920116756111);
    eq(getRandomFloatWithSeed(0, 1, 100), 0.2043598669115454);
  });

  test("getRandomInt", () => {
    eq(getRandomInt(0, 1) < 1, true);
    eq(getRandomInt(0, 1) >= 0, true);
  });

  test("getRandomIntWithSeed", () => {
    eq(getRandomIntWithSeed(0, 10, 0), 2);
    eq(getRandomIntWithSeed(0, 10, 10), 5);
    eq(getRandomIntWithSeed(0, 10, 100), 2);
  });

  test("getLengthFromInt", () => {
    eq(getLengthFromInt(1), 1);
    eq(getLengthFromInt(10), 2);
    eq(getLengthFromInt(100), 3);
    eq(getLengthFromFloat(1), 1);
    eq(getLengthFromFloat(10), 2);
    eq(getLengthFromFloat(100), 3);
    eq(getLengthFromFloat(100.1), 4);
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

  test("calcStringSize", () => {
    eq(calcStringSize("abc"), 3);
    eq(calcStringSize("ㄱㄴㄷ"), 9);
    eq(calcStringSize("가나다"), 9);
  });

  test("toBytes", () => {
    eq(toBytes(1, "MB"), 1024 * 1024);
    eq(toBytes(1, "GB"), 1024 * 1024 * 1024);
  });

  test("toFileSize", () => {
    eq(toFileSize(1024 * 1024, "MB"), 1);
    eq(toFileSize(1024 * 1024 * 1024, "GB"), 1);
  });

  test("humanizeFileSize", () => {
    eq(humanizeFileSize(1024 * 1024, "Bytes"), "1.00 MB");
    eq(humanizeFileSize(1024 * 1024 * 1024, "Bytes"), "1.00 GB");
    eq(
      humanizeFileSize(1024 * 1024 * 1024 + 1024 * 1024 * 512, "Bytes"),
      "1.50 GB"
    );
  });

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

    eq(getAdjustedSize(150, 150, 200, 200, 100, 100), [150, 150]);
    eq(getAdjustedSize(175, 175, 200, 200, 100, 100), [175, 175]);
  });

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
