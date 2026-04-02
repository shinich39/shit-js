/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { toDegrees } from "./to-degrees";

test("toDegrees", () => {
  eq(toDegrees(0), 0);
  eq(toDegrees(Math.PI / 2), 90);
  eq(toDegrees(Math.PI), 180);
  eq(toDegrees(Math.PI * 2), 360);
  eq(toDegrees(-Math.PI / 2), -90);
});
