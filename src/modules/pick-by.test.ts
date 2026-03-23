import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { pickBy } from "./pick-by";

test("pickBy", () => {
  eq(
    pickBy({ a: 1, b: 2, c: 3 }, (k, v) => v > 1),
    { b: 2, c: 3 },
  );
  eq(
    pickBy({ a: 1, b: null, c: "x" }, (k, v) => v),
    { a: 1, c: "x" },
  );
  eq(
    pickBy({ a: 1, b: 2 }, () => false),
    {},
  );
  eq(
    pickBy({ a: 1, b: 2 }, () => true),
    { a: 1, b: 2 },
  );

  // use key
  eq(
    pickBy({ a: 1, b: 2, c: 3 }, (k) => k !== "b"),
    { a: 1, c: 3 },
  );
});
