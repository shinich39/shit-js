/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { extractNumbers } from "./extract-numbers";

test("extractNumbers", () => {
  eq(extractNumbers("ftp://192.168.0.1 1 2 3"), [192.168, 0.1, 1, 2, 3]);
});
