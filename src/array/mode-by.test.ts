import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { modeBy } from "./mode-by";

test("modeBy", () => {
  eq(modeBy([1, 3, 2, 3, 2, 3, 4]), [
    { value: 1, count: 1 },
    { value: 4, count: 1 },
    { value: 2, count: 2 },
    { value: 3, count: 3 },
  ]);
});
