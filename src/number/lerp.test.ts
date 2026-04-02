/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { lerp } from "./lerp";

test("lerp", () => {
  eq(lerp(0, 100, 0), 0);
  eq(lerp(0, 100, 0.5), 50);
  eq(lerp(0, 100, 1), 100);

  eq(lerp(0, 100, -0.5), -50);
  eq(lerp(0, 100, 1.5), 150);

  eq(lerp(-50, 50, 0.5), 0);

  eq(lerp(0, 1, 0.25), 0.25);
});
