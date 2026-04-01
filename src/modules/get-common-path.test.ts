/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import path from "node:path";
import { test } from "node:test";
import { getCommonPath } from "./get-common-path";

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
