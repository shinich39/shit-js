import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { product } from "./product";

test("product", () => {
  eq(product<any>([["a", "b", "c"], [1]]), [
    ["a", 1],
    ["b", 1],
    ["c", 1],
  ]);

  eq(
    product<any>([
      ["a", "b", "c"],
      [1, 2, 3],
    ]),
    [
      ["a", 1],
      ["a", 2],
      ["a", 3],
      ["b", 1],
      ["b", 2],
      ["b", 3],
      ["c", 1],
      ["c", 2],
      ["c", 3],
    ],
  );

  eq(product([]), []);
});
