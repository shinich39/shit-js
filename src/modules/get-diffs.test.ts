import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { getDiffs } from "./get-diffs";

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
