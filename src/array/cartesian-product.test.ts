/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { cartesianProduct } from "./cartesian-product";

test("cartesianProduct", () => {
  eq(cartesianProduct<any>(["a", "b", "c"], [1]), [
    ["a", 1],
    ["b", 1],
    ["c", 1],
  ]);

  eq(cartesianProduct(), []);
});
