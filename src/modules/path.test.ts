import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import {
  getBaseName,
  getDirName,
  getExtName,
  getRelativePath,
  getRootPath,
  joinPaths,
} from "./path";

describe(path.basename(import.meta.filename), () => {

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

  test("getBaseName", () => {
    const arrs = [
      ["./project/package.json", "package.json", "package"],
      ["./project/", "project", "project"],
      ["./", ".", "."],
    ];

    for (const arr of arrs) {
      eq(path.basename(arr[0]), getBaseName(arr[0]), arr[0]);
      eq(getBaseName(arr[0], getExtName(arr[0])), arr[2], arr[0]);
      eq(arr[1], getBaseName(arr[0]), arr[0]);
    }
  });

  test("getExtName", () => {
    const arrs = [
      ["./project/package.json", ".json"],
      ["./project/package", ""],
      ["./project/", ""],
      ["./", ""],
    ];

    for (const arr of arrs) {
      eq(path.extname(arr[0]), getExtName(arr[0]), arr[0]);
      eq(arr[1], getExtName(arr[0]), arr[0]);
    }
  });

  test("getDirName", () => {
    const arrs = [
      ["./project/package.json", "./project"],
      ["./project/", "."],
      ["./", "."],
    ];

    for (const arr of arrs) {
      eq(path.dirname(arr[0]), getDirName(arr[0]), arr[0]);
      eq(arr[1], getDirName(arr[0]), arr[0]);
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

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
