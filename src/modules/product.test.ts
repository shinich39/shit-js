/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { product } from "./product";

test("product", () => {
  eq(product<any>(["a", "b", "c"], [1]), [
    ["a", 1],
    ["b", 1],
    ["c", 1],
  ]);
  eq(product(), []);
});
