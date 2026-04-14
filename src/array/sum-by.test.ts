import { strictEqual as eq } from "node:assert";
import { test } from "node:test";
import { sumBy } from "./sum-by";

test("sumBy", () => {
  eq(
    sumBy([{ start: 3 }, { start: 1 }, { start: 2 }], (r) => r.start),
    6,
  );
  eq(
    sumBy([{ start: 5 }], (r) => r.start),
    5,
  );
  eq(
    sumBy([{ v: -1 }, { v: -5 }, { v: -3 }], (r) => r.v),
    -9,
  );
  eq(
    sumBy([], (r) => r),
    0,
  );
});
