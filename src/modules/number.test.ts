import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import {
  getClampedNumber,
  getLoopedNumber,
  getContainedSize,
  getCoveredSize,
  getAdjustedSize,
  toFileSize,
  generateInt,
  generateFloat,
  getIntSize,
  getFloatSize,
  getLogScore,
  getPowerScore,
  getBitSize,
  generateTypingDelay,
  fromMegabyte,
  fromGigabyte,
  fromKilobyte,
  fromTerabyte,
  fromPetabyte,
  fromExabyte,
  fromZettabyte,
  fromYottabyte,
  toKilobyte,
  toMegabyte,
  toGigabyte,
  toTerabyte,
  toPetabyte,
  toExabyte,
  toZettabyte,
  toYottabyte,
} from "./number";
import { sleep } from "./promise";

test("generateFloat", () => {
  eq(generateFloat(0, 1) < 1, true);
  eq(generateFloat(0, 1) >= 0, true);
});

test("generateInt", () => {
  eq(generateInt(0, 1) < 1, true);
  eq(generateInt(0, 1) >= 0, true);
});

test("generateTypingDelay", async () => {
  // const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  // await sleep(100);
  // for (const char of str) {
  //   const delay = generateTypingDelay(char, 1);
  //   process.stdout.write(char);
  //   await sleep(delay);
  // }
});

test("getBitSize", () => {
  eq(getBitSize(0), 1); // 0
  eq(getBitSize(1), 1); // 1
  eq(getBitSize(2), 2); // 10
  eq(getBitSize(3), 2); // 11
  eq(getBitSize(4), 3); // 100
  eq(getBitSize(5), 3); // 101
  eq(getBitSize(6), 3); // 110
  eq(getBitSize(7), 3); // 111
  eq(getBitSize(8), 4); // 1000
  eq(getBitSize(16), 5); // 10000
  eq(getBitSize(32), 6); // 100000
});

test("getIntSize", () => {
  eq(getIntSize(1), 1);
  eq(getIntSize(10), 2);
  eq(getIntSize(100), 3);
});

test("getFloatSize", () => {
  eq(getFloatSize(1), 1);
  eq(getFloatSize(10), 2);
  eq(getFloatSize(100), 3);
  eq(getFloatSize(100.1), 4);
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

test("getLogScore", () => {
  eq(getLogScore(100, 0), 0);
  eq(getLogScore(100, 25).toFixed(4), 0.7059613126314263.toFixed(4));
  eq(getLogScore(100, 50).toFixed(4), 0.8519443031609923.toFixed(4));
  eq(getLogScore(100, 75).toFixed(4), 0.9383792523906672.toFixed(4));
  eq(getLogScore(100, 100), 1);
});

test("getPowerScore", () => {
  eq(getPowerScore(100, 0), 0);
  eq(getPowerScore(100, 25).toFixed(4), 0.5.toFixed(4)); 
  eq(getPowerScore(100, 50).toFixed(4), 0.7071067811865476.toFixed(4));
  eq(getPowerScore(100, 75).toFixed(4), 0.8660254037844387.toFixed(4));
  eq(getPowerScore(100, 100), 1);
});

test("fromKilobyte", () => {
  eq(fromKilobyte(1), Math.pow(1024, 1));
});

test("fromMegabyte", () => {
  eq(fromMegabyte(1), Math.pow(1024, 2));
});

test("fromGigabyte", () => {
  eq(fromGigabyte(1), Math.pow(1024, 3));
});

test("fromTerabyte", () => {
  eq(fromTerabyte(1), Math.pow(1024, 4));
});

test("fromPetabyte", () => {
  eq(fromPetabyte(1), Math.pow(1024, 5));
});

test("fromExabyte", () => {
  eq(fromExabyte(1), Math.pow(1024, 6));
});

test("fromZettabyte", () => {
  eq(fromZettabyte(1), Math.pow(1024, 7));
});

test("fromYottabyte", () => {
  eq(fromYottabyte(1), Math.pow(1024, 8));
});

test("toKilobyte", () => {
  eq(toKilobyte(Math.pow(1024, 1)), 1);
});

test("toMegabyte", () => {
  eq(toMegabyte(Math.pow(1024, 2)), 1);
});

test("toGigabyte", () => {
  eq(toGigabyte(Math.pow(1024, 3)), 1);
});

test("toTerabyte", () => {
  eq(toTerabyte(Math.pow(1024, 4)), 1);
});

test("toPetabyte", () => {
  eq(toPetabyte(Math.pow(1024, 5)), 1);
});

test("toExabyte", () => {
  eq(toExabyte(Math.pow(1024, 6)), 1);
});

test("toZettabyte", () => {
  eq(toZettabyte(Math.pow(1024, 7)), 1);
});

test("toYottabyte", () => {
  eq(toYottabyte(Math.pow(1024, 8)), 1);
});

test("toFileSize", () => {
  eq(toFileSize(1024), "1 KB");
  eq(toFileSize(1024 + 768), "1.75 KB");
  eq(toFileSize(1024 * 1024), "1 MB");
  eq(toFileSize(1024 * 1024 * 1024), "1 GB");
  eq(toFileSize(1024 * 1024 * 1024 + 1024 * 1024 * 512), "1.5 GB");
});
