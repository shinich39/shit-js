import { strictEqual as eq } from "node:assert";
import { test } from "node:test";
import { minBy } from "./min-by";

test("minBy", () => {
  eq(
    minBy([{ start: 3 }, { start: 1 }, { start: 2 }], (r) => r.start),
    1,
  );
  eq(
    minBy([{ start: 5 }], (r) => r.start),
    5,
  );
  eq(
    minBy([{ v: -1 }, { v: -5 }, { v: -3 }], (r) => r.v),
    -5,
  );
  eq(
    minBy([], (r) => r),
    undefined,
  );
});
