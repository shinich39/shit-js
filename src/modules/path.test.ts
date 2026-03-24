import { deepStrictEqual as eq } from "node:assert";
import path from "node:path";
import { test } from "node:test";
import { getCommonPath, getRelativePath, parsePath, resolvePath } from "./path";

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

test("getCommonPath", () => {
  eq(
    getCommonPath([
      "./project/abc/package.json",
      "./project/abc/def",
      "./project/abc/def/package.json",
      "./project/abc/def/ghi/package.json",
      "./project/abc/ghi/package.json",
      "project/abc/def/ghi/package.json",
    ]),
    "project/abc",
  );

  eq(
    getCommonPath([
      "./project/abc/def/package.json",
      "./project/abc/def/ab",
      "./project/abc/def/package.json",
      "./project/abc/def/ghi/package.json",
      "./project/abc/def/ghi/package.json",
      "project/abc/def/",
    ]),
    "project/abc/def",
  );

  eq(
    getCommonPath([
      "/project/abc/def/package.json",
      "/project/abc/def/ab",
      "/project/abc/def/package.json",
      "/project/abc/def/ghi/package.json",
      "/project/abc/def/ghi/package.json",
      "/project/abc/def/",
    ]),
    "/project/abc/def",
  );
});
