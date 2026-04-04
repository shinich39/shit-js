import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { compareObjects, diffObjects } from "./compare-objects";

test("diffObjects", () => {
  const a = {
    user: { name: "Alice", age: 20 },
    active: true,
  };

  const b = {
    user: { name: "Bob" },
    city: "Seoul",
    active: true,
  };

  const result = diffObjects(a, b);

  eq(result, [
    [-1, "user.name"],
    [1, "user.name"],
    [-1, "user.age"],
    [0, "active"],
    [1, "city"],
  ]);
});

test("compareObjects", () => {
  const a = {
    user: { name: "Alice", age: 20 },
    active: true,
  };

  const b = {
    user: { name: "Bob" },
    city: "Seoul",
    active: true,
  };

  const result = compareObjects(a, b);

  eq(result.diffs, [
    [-1, "user.name"],
    [1, "user.name"],
    [-1, "user.age"],
    [0, "active"],
    [1, "city"],
  ]);

  eq(result.matches, 1); // user, active
  eq(result.insertions, 2); // user.name, city
  eq(result.deletions, 2); // user.name, user.age
  eq(result.distance, 4);
});
