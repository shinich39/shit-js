/// <reference types="node" />
import { deepStrictEqual as eq, ok } from "node:assert";
import { test } from "node:test";
import { randomString } from "./random-string";

test("randomString", () => {
  ok(typeof randomString() === "string");
  eq(randomString(undefined, 10).length, 10);
});
