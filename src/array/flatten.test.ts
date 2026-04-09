import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { flatten } from "./flatten";

test("flatten", () => {
  eq(flatten([1, 2, [3, 4], 5]), [1, 2, 3, 4, 5]);
});
