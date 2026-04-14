import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createMulberry32 } from "./create-mulberry32";

test("createMulberry32", () => {
  const rng = createMulberry32(39);
  eq(rng(10, 100).toFixed(2), "16.74");
  eq(rng(10, 100).toFixed(2), "77.77");
  eq(rng(10, 100).toFixed(2), "58.69");
  eq(rng(10, 100).toFixed(2), "13.36");
  eq(rng(10, 100).toFixed(2), "86.47");
});
