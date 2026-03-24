import { deepStrictEqual as eq, ok } from "node:assert";
import { test } from "node:test";
import { randomFloat, randomInt, randomString } from "./random";

test("randomFloat", () => {
  ok(typeof randomFloat(0, 1) === "number");
  ok(randomFloat(0, 1) >= 0);
  ok(randomFloat(0, 1) < 1);
});

test("randomInt", () => {
  ok(typeof randomInt(0, 10) === "number");
  ok(randomInt(0, 10) >= 0);
  ok(randomInt(0, 10) < 10);
});

test("randomString", () => {
  ok(typeof randomString() === "string");
  eq(randomString(undefined, 10).length, 10);
});
