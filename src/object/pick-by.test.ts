import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { pickBy } from "./pick-by";

test("pickBy", () => {
  eq(
    pickBy({ a: 1, b: 2 }, (k, v) => false),
    {},
  );

  eq(
    pickBy({ a: 1, b: 2 }, (k, v) => true),
    { a: 1, b: 2 },
  );

  eq(
    pickBy({ a: 1, b: 2, c: 3 }, (k, v) => v > 1),
    { b: 2, c: 3 },
  );

  eq(
    pickBy({ a: 1, b: null, c: "x" }, (k, v) => v),
    { a: 1, c: "x" },
  );

  eq(
    pickBy({ a: 1, b: 2, c: 3 }, (k, v) => k !== "b"),
    { a: 1, c: 3 },
  );
});
