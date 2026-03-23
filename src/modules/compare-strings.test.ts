import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { compareStrings } from "./compare-strings";

test("compareStrings", () => {
  const b = "sit amet, adipiscing";
  const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const result = compareStrings(a, b);

  eq(result, {
    matchRate: 0.35714285714285715,
    similarity: 0.35714285714285715,
    diceSimilarity: 0.5263157894736842,
    jaccardSimilarity: 0.35714285714285715,
    distance: 36,
    normalizedDistance: 0.6428571428571429,
    matches: 20,
    insertions: 0,
    deletions: 36,
  });
});
