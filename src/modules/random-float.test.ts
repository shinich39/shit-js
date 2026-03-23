import { deepStrictEqual as eq, ok } from "node:assert";
import { test } from "node:test";
import { randomFloat } from "./random-float";

test("randomFloat", () => {
  ok(typeof randomFloat(0, 1) === "number");
});
