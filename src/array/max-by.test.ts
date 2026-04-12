import { strictEqual as eq } from "node:assert";
import { test } from "node:test";
import { maxBy } from "./max-by";

test("maxBy", () => {
  eq(
    maxBy([{ end: 3 }, { end: 8 }, { end: 5 }], (r) => r.end),
    8,
  );
  eq(
    maxBy([{ end: 5 }], (r) => r.end),
    5,
  );
  eq(
    maxBy([{ v: -1 }, { v: -5 }, { v: -3 }], (r) => r.v),
    -1,
  );
  eq(
    maxBy([], (r) => r),
    undefined,
  );
});
