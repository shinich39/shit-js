import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { clamp } from "./clamp";

test("clamp", () => {
  eq(clamp(5, 0, 10), 5);
  eq(clamp(-1, 0, 10), 0);
  eq(clamp(11, 0, 10), 10);
  eq(clamp(0, 0, 10), 0);
  eq(clamp(10, 0, 10), 10);
  eq(clamp(5, 5, 5), 5);
});
