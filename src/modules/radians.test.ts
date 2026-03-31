import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { fromRadians, toRadians } from "./radians";

test("toRadians", () => {
  eq(toRadians(0), 0);
  eq(toRadians(90), Math.PI / 2);
  eq(toRadians(180), Math.PI);
  eq(toRadians(360), Math.PI * 2);
  eq(toRadians(-90), -Math.PI / 2);
});

test("fromRadians", () => {
  eq(fromRadians(0), 0);
  eq(fromRadians(Math.PI / 2), 90);
  eq(fromRadians(Math.PI), 180);
  eq(fromRadians(Math.PI * 2), 360);
  eq(fromRadians(-Math.PI / 2), -90);
});
