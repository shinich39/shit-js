/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { compareStrings, getDiffs } from "./compare-strings";

test("getDiffs", () => {
  const b = "sit amet, adipiscing";
  const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const result = getDiffs(a, b);

  eq(result, [
    [-1, "Lorem ip"],
    [0, "s"],
    [-1, "um dolor s"],
    [0, "it amet, "],
    [-1, "consectetur "],
    [0, "adipiscing"],
    [-1, " elit."],
  ]);
});

test("compareStrings", () => {
  const b = "sit amet, adipiscing";
  const a = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const result = compareStrings(a, b);

  eq(result, {
    diffs: [
      [-1, "Lorem ip"],
      [0, "s"],
      [-1, "um dolor s"],
      [0, "it amet, "],
      [-1, "consectetur "],
      [0, "adipiscing"],
      [-1, " elit."],
    ],
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
