import { deepStrictEqual as eq, throws } from "node:assert";
import { test } from "node:test";
import { toFixed } from "./to-fixed";

test("toFixed", () => {
  eq(toFixed(1.2345, 2), 1.23);
  eq(toFixed(1.005, 2), 1.01);
  eq(toFixed(1.5), 2);
});
