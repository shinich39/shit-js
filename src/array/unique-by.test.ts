/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { uniqueBy } from "./unique-by";

test("uniqueBy", () => {
  eq(
    uniqueBy([1, 2, 2, 3], (value) => value),
    [1, 2, 3],
  );
  eq(
    uniqueBy(
      [
        { id: 1, age: 10 },
        { id: 2, age: 10 },
        { id: 3, age: 9 },
        { id: 4, age: 1 },
        { id: 5, age: 9 },
      ],
      (value) => value.age,
    ),
    [
      { id: 1, age: 10 },
      { id: 3, age: 9 },
      { id: 4, age: 1 },
    ],
  );
});
