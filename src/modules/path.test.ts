import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import {
  getBaseName,
  getDirName,
  getExtName,
  getFileName,
  getRelativePath,
  getRootPath,
  joinPaths,
} from "./path";

describe(path.basename(import.meta.filename), () => {

  test("getBaseName", () => {
    const strs = [
      ["./project/package.json", "package.json"],
      ["./project/", "project"],
      ["./", "."],
    ];

    for (const str of strs) {
      eq(path.basename(str[0]), getBaseName(str[0]), str[0]);
      eq(path.basename(str[0]), getBaseName(str[0]), str[0]);
      eq(path.basename(str[0]), getBaseName(str[0]), str[0]);
      eq(str[1], getBaseName(str[0]), str[0]);
    }
  });

  test("getExtName", () => {
    const strs = [
      ["./project/package.json", ".json"],
      ["./project/", ""],
      ["./", ""],
    ];

    for (const str of strs) {
      eq(path.extname(str[0]), getExtName(str[0]), str[0]);
      eq(path.extname(str[0]), getExtName(str[0]), str[0]);
      eq(path.extname(str[0]), getExtName(str[0]), str[0]);
      eq(str[1], getExtName(str[0]), str[0]);
    }
  });

  test("getFileName", () => {
    const strs = [
      ["./project/package.json", "package"],
      ["./project/", "project"],
      ["./", "."],
      ["package", "package"],
      ["package.json", "package"],
    ];

    for (const str of strs) {
      eq(path.basename(str[0], path.extname(str[0])), getFileName(str[0]), str[0]);
      eq(path.basename(str[0], path.extname(str[0])), getFileName(str[0]), str[0]);
      eq(path.basename(str[0], path.extname(str[0])), getFileName(str[0]), str[0]);
      eq(str[1], getFileName(str[0]), str[0]);
    }
  });

  test("getDirName", () => {
    const strs = [
      ["./project/package.json", "./project"],
      ["./project/", "."],
      ["./", "."],
    ];

    for (const str of strs) {
      eq(path.dirname(str[0]), getDirName(str[0]), str[0]);
      eq(path.dirname(str[0]), getDirName(str[0]), str[0]);
      eq(path.dirname(str[0]), getDirName(str[0]), str[0]);
      eq(str[1], getDirName(str[0]), str[0]);
    }
  });

  test("joinPaths", () => {
    const strs = [
      ["./project/", "abc", "./package.json"],
      ["./project/", "abc", "../package.json"],
      ["./project/", "abc", "."],
      ["./", "abc", "."],
      [".", "abc", "."],
      ["abc", "package.json"],
      ["abc", "..", "package.json"],
    ];

    for (const str of strs) {
      eq(path.join(...str), joinPaths(...str), str[0]);
      eq(path.join(...str), joinPaths(...str), str[0]);
      eq(path.join(...str), joinPaths(...str), str[0]);
    }
  });

  test("getRelativePath", () => {
    const strs = [
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

    for (const str of strs) {
      eq(path.relative(str[0], str[1]), getRelativePath(str[0], str[1]));
    }
  });

  test("getRootPath", () => {
    let strs = [
      "./project/abc/package.json",
      "./project/abc/def",
      "./project/abc/def/package.json",
      "./project/abc/def/ghi/package.json",
      "./project/abc/ghi/package.json",
      "project/abc/def/ghi/package.json",
    ];

    eq("project/abc", getRootPath(...strs));

    strs = [
      "./project/abc/def/package.json",
      "./project/abc/def/ab",
      "./project/abc/def/package.json",
      "./project/abc/def/ghi/package.json",
      "./project/abc/def/ghi/package.json",
      "project/abc/def/",
    ];

    eq("project/abc/def", getRootPath(...strs));

    strs = [
      "/project/abc/def/package.json",
      "/project/abc/def/ab",
      "/project/abc/def/package.json",
      "/project/abc/def/ghi/package.json",
      "/project/abc/def/ghi/package.json",
      "/project/abc/def/",
    ];

    eq("/project/abc/def", getRootPath(...strs));
  });

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
