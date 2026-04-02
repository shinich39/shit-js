/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import path from "node:path";
import { test } from "node:test";
import { parsePath } from "./parse-path";

test("parsePath: base", () => {
  const arrs = [
    ["./project/package.json", "package.json"],
    ["./project/", "project"],
    ["./", "."],
  ];

  for (const arr of arrs) {
    const label = arr[0];
    const parsed = parsePath(arr[0]);
    eq(parsed.base, path.basename(arr[0]), label);
    eq(parsed.base, arr[1], label);
  }
});

test("parsePath: name", () => {
  const arrs = [
    ["./project/package.json", "package"],
    ["./project/", "project"],
    ["./", "."],
  ];

  for (const arr of arrs) {
    const label = arr[0];
    const parsed = parsePath(arr[0]);
    eq(parsed.name, path.basename(arr[0], path.extname(arr[0])), label);
    eq(parsed.name, arr[1], label);
  }
});

test("parsePath: ext", () => {
  const arrs = [
    ["./project/package.json", ".json"],
    ["./project/package", ""],
    ["./project/", ""],
    ["./", ""],
  ];

  for (const arr of arrs) {
    const label = arr[0];
    const parsed = parsePath(arr[0]);
    eq(parsed.ext, path.extname(arr[0]), label);
    eq(parsed.ext, arr[1], label);
  }
});

test("parsePath: dir", () => {
  const arrs = [
    ["./project/package.json", "./project"],
    ["./project/", "."],
    ["./", "."],
  ];

  for (const arr of arrs) {
    const label = arr[0];
    const parsed = parsePath(arr[0]);
    eq(parsed.dir, path.dirname(arr[0]), label);
    eq(parsed.dir, arr[1], label);
  }
});
