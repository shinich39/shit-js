/// <reference types="node" />
import { deepStrictEqual as eq, ok } from "node:assert";
import { test } from "node:test";
import { randomInt } from "./random-int";

test("randomInt", () => {
  ok(typeof randomInt(0, 10) === "number");
  ok(randomInt(0, 10) >= 0);
  ok(randomInt(0, 10) < 10);
});
