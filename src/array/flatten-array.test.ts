import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { flattenArray } from "./flatten-array";

test("flattenArray", () => {
  eq(flattenArray([1, 2, [3, 4], 5]), [1, 2, 3, 4, 5]);
});
