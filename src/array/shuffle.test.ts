/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { shuffle } from "./shuffle";

test("shuffle", () => {
  const arr = Array(1000).map((_, i) => i);
  eq(shuffle(arr), arr);
});
