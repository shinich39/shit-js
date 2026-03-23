import { deepStrictEqual as eq } from "node:assert";
import path from "node:path";
import { test } from "node:test";
import { resolvePath } from "./resolve-path";

test("resolvePath", () => {
  const arrs = [
    ["./project/", "abc", "./package.json"],
    ["./project/", "abc", "../package.json"],
    ["./project/", "abc", "."],
    ["./", "abc", "."],
    [".", "abc", "."],
    ["abc", "package.json"],
    ["abc", "..", "package.json"],
    ["/abc", "package.json"],
  ];

  for (const arr of arrs) {
    eq(path.join(...arr), resolvePath(...arr), arr[0]);
    eq(path.join(...arr), resolvePath(...arr), arr[0]);
    eq(path.join(...arr), resolvePath(...arr), arr[0]);
  }
});
