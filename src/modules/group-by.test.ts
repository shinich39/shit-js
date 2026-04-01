/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { groupBy } from "./group-by";

test("groupBy", () => {
  eq(
    groupBy([1, 2, 2, 3], (value) => String(value)),
    { "1": [1], "2": [2, 2], "3": [3] },
  );
  eq(
    groupBy([], (value) => String(value)),
    {},
  );
  eq(
    groupBy(
      [
        { id: 1, type: "a" },
        { id: 2, type: "b" },
        { id: 3, type: "a" },
      ],
      (value) => value.type,
    ),
    {
      a: [
        { id: 1, type: "a" },
        { id: 3, type: "a" },
      ],
      b: [{ id: 2, type: "b" }],
    },
  );
});
