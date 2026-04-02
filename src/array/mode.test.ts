/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { mode } from "./mode";

test("mode", () => {
  eq(mode([0, 0, 2, 3, 4, 5, 6, 7.5, 8.5, 9]), { value: 0, count: 2 });
  eq(mode(["a", "a", "b"]), { count: 2, value: "a" });
  eq(mode(["a", "a", "b", "b", "b"]), { count: 3, value: "b" });
});
