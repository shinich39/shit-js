import { deepStrictEqual as eq } from "node:assert";
import path from "node:path/posix";
import { test } from "node:test";
import { getRelativePath } from "./get-relative-path";

test("getRelativePath", () => {
  const arrs = [
    ["./project/", "./package.json"],
    ["./project/", "../package.json"],
    ["./project/", "."],
    ["./", "."],
    [".", "."],
    ["", "package.json"],
    ["", "project/package.json"],
    ["", "./project/package.json"],
    ["abc", "package.json"],
  ];

  for (const arr of arrs) {
    eq(path.relative(arr[0], arr[1]), getRelativePath(arr[0], arr[1]));
  }
});
