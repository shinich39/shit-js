/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { scaleToContain } from "./scale-to-contain";

test("scaleToContain", () => {
  eq(scaleToContain(100, 100, 200, 100), [100, 100]);
  eq(scaleToContain(200, 100, 100, 100), [100, 50]);
  eq(scaleToContain(100, 200, 100, 100), [50, 100]);
});
