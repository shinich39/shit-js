/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { toRadians } from "./to-radians";

test("toRadians", () => {
  eq(toRadians(0), 0);
  eq(toRadians(90), Math.PI / 2);
  eq(toRadians(180), Math.PI);
  eq(toRadians(360), Math.PI * 2);
  eq(toRadians(-90), -Math.PI / 2);
});
