import { describe, test } from "node:test";
import assert from "node:assert";
import { groupBy, parseNumbers, plotBy, shuffleArray } from "./array";

test("parseNumbers", () => {
  eq(parseNumbers([0, 0, 2, 3, 4, 5, 6, 7.5, 8.5, 9]), {
    max: 9,
    min: 0,
    sum: 45,
    mean: 4.5,
    mode: 0,
    modeCount: 2,
  });
});

test("shuffleArray", () => {
  eq(Array.isArray(shuffleArray([0, 1, 2])), true);
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
