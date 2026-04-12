import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { mergeIntervals } from "./merge-intervals";

test("mergeIntervals", () => {
  const result = mergeIntervals([
    { start: 1, end: 5 },
    { start: 3, end: 8 }, // overlaps with first
    { start: 7, end: 6 }, // contained within second (end < start edge case)
    { start: 10, end: 12 },
  ]);

  eq(result, [
    { start: 1, end: 8 },
    { start: 10, end: 12 },
  ]);
});
