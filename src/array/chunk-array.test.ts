import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { chunkArray } from "./chunk-array";

test("chunkArray", () => {
  eq(chunkArray([1, 2, 3, 4, 5], 3), [
    [1, 2, 3],
    [4, 5],
  ]);
});
