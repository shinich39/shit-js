/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { extractFloats } from "./extract-floats";

test("extractFloats", () => {
  eq(extractFloats("ftp://192.168.0.1 1 2 3"), [192.168, 0.1]);
});
