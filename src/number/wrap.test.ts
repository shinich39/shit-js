import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { wrap } from "./wrap";

test("wrap", () => {
  eq(wrap(5, 0, 10), 5);
  eq(wrap(-1, 0, 10), 9);
  eq(wrap(10, 0, 10), 0);
  eq(wrap(11, 0, 10), 1);
  eq(wrap(0, 0, 10), 0);
  eq(wrap(-11, 0, 10), 9);
  eq(wrap(21, 0, 10), 1);
  eq(wrap(3, 2, 5), 3);
  eq(wrap(1, 2, 5), 4);
});
