/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { extractFloats, extractInts, extractNumbers } from "./extract-numbers";

test("extractNumbers", () => {
  eq(extractNumbers("ftp://192.168.0.1 1 2 3"), [192.168, 0.1, 1, 2, 3]);
});

test("extractFloats", () => {
  eq(extractFloats("ftp://192.168.0.1 1 2 3"), [192.168, 0.1]);
});

test("extractInts", () => {
  eq(extractInts("ftp://192.168.0.1 1 2 3"), [192, 168, 0, 1, 1, 2, 3]);
});
