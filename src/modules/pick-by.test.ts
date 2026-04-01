/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { pickBy } from "./pick-by";

test("pickBy: simple", () => {
  eq(
    pickBy({ a: 1, b: 2 }, (k, v) => false),
    {},
  );
  eq(
    pickBy({ a: 1, b: 2 }, (k, v) => true),
    { a: 1, b: 2 },
  );
});

test("pickBy: use value", () => {
  eq(
    pickBy({ a: 1, b: 2, c: 3 }, (k, v) => v > 1),
    { b: 2, c: 3 },
  );
  eq(
    pickBy({ a: 1, b: null, c: "x" }, (k, v) => v),
    { a: 1, c: "x" },
  );
});

test("pickBy: use key", () => {
  eq(
    pickBy({ a: 1, b: 2, c: 3 }, (k, v) => k !== "b"),
    { a: 1, c: 3 },
  );
});
