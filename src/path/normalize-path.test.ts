import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { normalizePath } from "./normalize-path";

test("normalizePath", () => {
  eq(normalizePath("foo//bar/../baz"), "foo/baz");
  eq(normalizePath("foo\\bar\\baz"), "foo/bar/baz");
  eq(normalizePath("./foo/./bar/"), "foo/bar");
  eq(normalizePath("/"), "/");
  eq(normalizePath(""), ".");
});
