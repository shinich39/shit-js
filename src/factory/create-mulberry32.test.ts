import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createMulberry32 } from "./create-mulberry32";

test("createMulberry32", () => {
  const rng = createMulberry32(39);
  eq(rng.int(10, 100), 16);
  eq(rng.int(10, 100), 77);
  eq(rng.int(10, 100), 58);
  eq(rng.int(10, 100), 13);
  eq(rng.int(10, 100), 86);
});
