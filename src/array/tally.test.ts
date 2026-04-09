import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { tally } from "./tally";

test("tally", () => {
  eq(tally([1, 3, 2, 3, 2, 3, 4]), [
    { value: 1, count: 1 },
    { value: 4, count: 1 },
    { value: 2, count: 2 },
    { value: 3, count: 3 },
  ]);
});
