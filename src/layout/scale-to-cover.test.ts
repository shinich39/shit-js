/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { scaleToCover } from "./scale-to-cover";

test("scaleToCover", () => {
  eq(scaleToCover(100, 100, 200, 100), [200, 200]);
  eq(scaleToCover(200, 100, 100, 100), [200, 100]);
  eq(scaleToCover(100, 200, 100, 100), [100, 200]);
});
