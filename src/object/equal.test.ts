/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { equal } from "./equal";

test("equal", () => {
  eq(equal(1, 1), true);
  eq(equal("a", "a"), true);
  eq(equal(null, null), true);
  eq(equal(undefined, undefined), true);

  eq(equal(1, 2), false);
  eq(equal(1, "1"), false);
  eq(equal(null, undefined), false);

  eq(equal({ a: 1 }, { a: 1 }), true);
  eq(equal({ a: 1, b: 2 }, { a: 1, b: 2 }), true);
  eq(equal({ a: { b: 1 } }, { a: { b: 1 } }), true);

  eq(equal({ a: 1 }, { a: 2 }), false);
  eq(equal({ a: 1 }, { b: 1 }), false);
  eq(equal({ a: 1 }, { a: 1, b: 2 }), false);

  eq(equal([1, 2, 3], [1, 2, 3]), true);
  eq(equal([[1], [2]], [[1], [2]]), true);

  eq(equal([1, 2], [1, 3]), false);
  eq(equal([1, 2], [1, 2, 3]), false);

  eq(equal({ a: [1, 2] }, { a: [1, 2] }), true);
  eq(equal({ a: [1, 2] }, { a: [1, 3] }), false);
});
