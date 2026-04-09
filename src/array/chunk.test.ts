import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { chunk } from "./chunk";

test("chunk", () => {
  eq(chunk([1, 2, 3, 4, 5], 3), [
    [1, 2, 3],
    [4, 5],
  ]);
});
