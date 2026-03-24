import { deepStrictEqual as eq, ok } from "node:assert";
import { test } from "node:test";
import { randomFloat, randomInt, randomString } from "./random";

test("randomFloat", () => {
  ok(typeof randomFloat(0, 1) === "number");
});

test("randomInt", () => {
  ok(typeof randomInt(0, 10) === "number");
});

test("randomString", () => {
  ok(typeof randomString() === "string");
  eq(randomString(undefined, 10).length, 10);
});
