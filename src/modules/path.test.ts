import { describe, test } from "node:test";
import assert from "node:assert";
import { getRelativePath, parsePath } from "./path";
import { relative } from "node:path";

test("parsePath", () => {
  let str = "./project/package.json";
  eq(parsePath(str), {
    parts: [".", "project", "package.json"],
    basename: "package.json",
    extname: ".json",
    filename: "package",
    dirname: "./project",
  });

  str = "./project/package";
  eq(parsePath(str), {
    parts: [".", "project", "package"],
    basename: "package",
    extname: "",
    filename: "package",
    dirname: "./project",
  });

  str = "./project/";
  eq(parsePath(str), {
    parts: [".", "project"],
    basename: "project",
    extname: "",
    filename: "project",
    dirname: ".",
  });
});

test("getRelativePath", () => {
  const paths = [
    ".Users/me/Git/node-py-old",
    "./Users/me/Git/noe-py-old/package.js.on",
    "Users/me/Git/node-py-old/package",
    "./Users/me/Git/node-py-old/package/",
    "dir1/dir2",
    "./dir",
    ".dir",
    ".",
    "",
    "...fe",
  ];

  for (let i = 0; i < paths.length; i++) {
    const a = paths[i];
    for (let j = 0; j < paths.length; j++) {
      const b = paths[j];
      eq(relative(a, b), getRelativePath(a, b));
    }
  }
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
