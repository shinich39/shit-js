import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import path from "node:path";
import {
  getBasename,
  getDirname,
  getExtname,
  getRelativePath,
  getRootPath,
  joinPaths,
  toSafeFilename,
} from "./path";

test("joinPaths", () => {
  const arrs = [
    ["./project/", "abc", "./package.json"],
    ["./project/", "abc", "../package.json"],
    ["./project/", "abc", "."],
    ["./", "abc", "."],
    [".", "abc", "."],
    ["abc", "package.json"],
    ["abc", "..", "package.json"],
  ];

  for (const arr of arrs) {
    eq(path.join(...arr), joinPaths(...arr), arr[0]);
    eq(path.join(...arr), joinPaths(...arr), arr[0]);
    eq(path.join(...arr), joinPaths(...arr), arr[0]);
  }
});

test("getBasename", () => {
  const arrs = [
    ["./project/package.json", "package.json", "package"],
    ["./project/", "project", "project"],
    ["./", ".", "."],
  ];

  for (const arr of arrs) {
    eq(path.basename(arr[0]), getBasename(arr[0]), arr[0]);
    eq(getBasename(arr[0], getExtname(arr[0])), arr[2], arr[0]);
    eq(arr[1], getBasename(arr[0]), arr[0]);
  }
});

test("getExtname", () => {
  const arrs = [
    ["./project/package.json", ".json"],
    ["./project/package", ""],
    ["./project/", ""],
    ["./", ""],
  ];

  for (const arr of arrs) {
    eq(path.extname(arr[0]), getExtname(arr[0]), arr[0]);
    eq(arr[1], getExtname(arr[0]), arr[0]);
  }
});

test("getDirname", () => {
  const arrs = [
    ["./project/package.json", "./project"],
    ["./project/", "."],
    ["./", "."],
  ];

  for (const arr of arrs) {
    eq(path.dirname(arr[0]), getDirname(arr[0]), arr[0]);
    eq(arr[1], getDirname(arr[0]), arr[0]);
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

test("getRootPath", () => {
  let arrs = [
    "./project/abc/package.json",
    "./project/abc/def",
    "./project/abc/def/package.json",
    "./project/abc/def/ghi/package.json",
    "./project/abc/ghi/package.json",
    "project/abc/def/ghi/package.json",
  ];

  eq("project/abc", getRootPath(...arrs));

  arrs = [
    "./project/abc/def/package.json",
    "./project/abc/def/ab",
    "./project/abc/def/package.json",
    "./project/abc/def/ghi/package.json",
    "./project/abc/def/ghi/package.json",
    "project/abc/def/",
  ];

  eq("project/abc/def", getRootPath(...arrs));

  arrs = [
    "/project/abc/def/package.json",
    "/project/abc/def/ab",
    "/project/abc/def/package.json",
    "/project/abc/def/ghi/package.json",
    "/project/abc/def/ghi/package.json",
    "/project/abc/def/",
  ];

  eq("/project/abc/def", getRootPath(...arrs));
});

test("toSafeFilename", () => {
  eq("hello_world", toSafeFilename("hello/world"));
  eq("abc_def", toSafeFilename("abc\u0000def"));
  eq("file", toSafeFilename("file."));
  eq("---", toSafeFilename("///", "-"));
});