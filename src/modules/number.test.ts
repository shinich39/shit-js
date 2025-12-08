import { describe, test } from "node:test";
import { deepStrictEqual as eq, throws, doesNotThrow, rejects } from "node:assert";
import {
  getClampedNumber,
  getLoopedNumber,
  getContainedSize,
  getCoveredSize,
  getAdjustedSize,
  humanizeFileSize,
  toFileSize,
  toBytes,
  generateInt,
  generateFloat,
  getLengthFromInt,
  getLengthFromFloat,
} from "./number";

test("generateFloat", () => {
  eq(generateFloat(0, 1) < 1, true);
  eq(generateFloat(0, 1) >= 0, true);
});

test("generateInt", () => {
  eq(generateInt(0, 1) < 1, true);
  eq(generateInt(0, 1) >= 0, true);
});

test("getLengthFromInt", () => {
  eq(getLengthFromInt(1), 1);
  eq(getLengthFromInt(10), 2);
  eq(getLengthFromInt(100), 3);
});

test("getLengthFromInt", () => {
  eq(getLengthFromFloat(1), 1);
  eq(getLengthFromFloat(10), 2);
  eq(getLengthFromFloat(100), 3);
  eq(getLengthFromFloat(100.1), 4);
});

test("getClampedNumber", () => {
  eq(getClampedNumber(5, 0, 10), 5);
  eq(getClampedNumber(10, 0, 10), 10);
  eq(getClampedNumber(-1, 0, 10), 0);
  eq(getClampedNumber(20, 0, 10), 10);
  eq(getClampedNumber(0, 0, 10), 0);
});

test("getLoopedNumber", () => {
  eq(getLoopedNumber(-5, 0, 10), 5);
  eq(getLoopedNumber(-2.5, 0, 10), 7.5);
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
  eq(getContainedSize(100, 100, 200, 100), [100, 100]);
});

test("getCoveredSize", () => {
  eq(getCoveredSize(1, 1, 2, 1), [2, 2]);
  eq(getCoveredSize(100, 100, 200, 100), [200, 200]);
});

test("getAdjustedSize", () => {
  eq(getAdjustedSize(500, 500, 200, 200, 100, 100), [200, 200]);
  eq(getAdjustedSize(500, 1000, 200, 200, 100, 100), [100, 200]);
  eq(getAdjustedSize(5, 10, 200, 200, 100, 100), [100, 200]);

  eq(getAdjustedSize(150, 150, 200, 200, 100, 100), [150, 150]);
  eq(getAdjustedSize(175, 175, 200, 200, 100, 100), [175, 175]);
});