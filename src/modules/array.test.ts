import { describe, test } from "node:test";
import assert from "node:assert";
import {
  getMaxValue,
  getMeanValue,
  getMinValue,
  getModeCount,
  getModeValue,
  getModeValueWithCount,
  getSumValue,
  groupBy,
  plotBy,
  shuffleArray,
  uniqueBy,
} from "./array";

const arr = [0, 0, 2, 3, 4, 5, 6, 7.5, 8.5, 9];

test("getMaxValue", () => {
  eq(getMaxValue(arr), 9);
});

test("getMinValue", () => {
  eq(getMinValue(arr), 0);
});

test("getSumValue", () => {
  eq(getSumValue(arr), 45);
});

test("getMeanValue", () => {
  eq(getMeanValue(arr), 4.5);
});

test("getModeValueWithCount", () => {
  eq(getModeValueWithCount(arr), { value: 0, count: 2 });
});

test("getModeValue", () => {
  eq(getModeValue(arr), 0);
});

test("getModeCount", () => {
  eq(getModeCount(arr), 2);
});

test("shuffleArray", () => {
  eq(Array.isArray(shuffleArray([0, 1, 2])), true);
});

test("uniqueBy", () => {
  const arr = [
    { name: "a", age: 10 },
    { name: "b", age: 12 },
    { name: "c", age: 11 },
    { name: "d", age: 15 },
    { name: "e", age: 13 },
    { name: "f", age: 12 },
    { name: "g", age: 11 },
    { name: "h", age: 10 },
  ];

  const u1 = uniqueBy(arr, (item) => item.age);

  eq(u1, [
    { name: "a", age: 10 },
    { name: "b", age: 12 },
    { name: "c", age: 11 },
    { name: "d", age: 15 },
    { name: "e", age: 13 },
  ]);

  // let n = Date.now(), c = 0;
  // while(Date.now() - n < 10) {
  //   uniqueBy(arr, (item) => item.age);
  //   c++;
  // }

  // console.log("uniqueBy()", c);

  // n = Date.now(), c = 0;
  // while(Date.now() - n < 10) {
  //   arr.filter((a, i, array) => i === array.findIndex((b) => a.age === b.age));
  //   c++;
  // }

  // console.log("filter()", c);
});

test("groupBy", () => {
  const group = groupBy<number>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (e) => {
    return "" + Math.round(e * 0.1) * 10;
  });
  eq(group, {
    "0": [0, 1, 2, 3, 4],
    "10": [5, 6, 7, 8, 9],
  });
});

test("plotBy", () => {
  eq(plotBy(["a", "b", "c"], [1]), [
    [0, 0],
    [1, 0],
    [2, 0],
  ]);

  eq(plotBy(["a", "b", "c"], ["a", "c"], ["a", "b", "c"]), [
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 2],
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 2],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 2],
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 2],
    [2, 0, 0],
    [2, 0, 1],
    [2, 0, 2],
    [2, 1, 0],
    [2, 1, 1],
    [2, 1, 2],
  ]);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
