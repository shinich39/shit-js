import { deepStrictEqual as eq, throws } from "node:assert";
import { test } from "node:test";
import { toPercentage } from "./to-percentage";

test("toPercentage", () => {
  eq(toPercentage(0), "0%");
  eq(toPercentage(1), "100%");
  eq(toPercentage(0.5), "50%");

  eq(toPercentage(0, 100), "0%");
  eq(toPercentage(50, 100), "50%");
  eq(toPercentage(100, 100), "100%");

  eq(toPercentage(0, 100, 2), "0.00%");
  eq(toPercentage(50, 100, 2), "50.00%");
  eq(toPercentage(100, 100, 2), "100.00%");
});
