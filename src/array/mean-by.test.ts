import { strictEqual as eq } from "node:assert";
import { test } from "node:test";
import { meanBy } from "./mean-by";

test("meanBy", () => {
  eq(
    meanBy([{ start: 3 }, { start: 1 }, { start: 2 }], (r) => r.start),
    2,
  );
  eq(
    meanBy([{ start: 5 }], (r) => r.start),
    5,
  );
  eq(
    meanBy([{ v: -1 }, { v: -5 }, { v: -3 }], (r) => r.v),
    -3,
  );
  eq(
    meanBy([], (r) => r),
    0,
  );
});
