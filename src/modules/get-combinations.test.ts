import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { getCombinations } from "./get-combinations";

test("getCombinations", () => {
  eq(getCombinations<any>(["a", "b", "c"], [1]), [
    ["a", 1],
    ["b", 1],
    ["c", 1],
  ]);
  eq(getCombinations(), []);
});
