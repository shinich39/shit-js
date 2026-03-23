import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { sanitizeFilename } from "./sanitize-filename";

test("sanitizeFilename", () => {
  // special character
  eq(sanitizeFilename("hello/world"), "hello_world");
  eq(sanitizeFilename("hello\\world"), "hello_world");
  eq(sanitizeFilename("file:name"), "file_name");
  eq(sanitizeFilename("file*name"), "file_name");
  eq(sanitizeFilename("file?name"), "file_name");
  eq(sanitizeFilename('file"name'), "file_name");
  eq(sanitizeFilename("file<name"), "file_name");
  eq(sanitizeFilename("file>name"), "file_name");
  eq(sanitizeFilename("file|name"), "file_name");

  // special characters
  eq(sanitizeFilename("hello///world"), "hello_world");

  // unicode
  eq(sanitizeFilename("abc\u0000def"), "abc_def");
  eq(sanitizeFilename("abc\u001Fdef"), "abc_def");

  // trailing dot/space
  eq(sanitizeFilename("file."), "file");
  eq(sanitizeFilename("file "), "file");
  eq(sanitizeFilename("file..."), "file");

  // change replacement
  eq(sanitizeFilename("hello/world", "-"), "hello-world");

  // special character only
  eq(sanitizeFilename("///"), "_");
  eq(sanitizeFilename("///", "-"), "-");

  // safe filename
  eq(sanitizeFilename("hello.txt"), "hello.txt");
  eq(sanitizeFilename("my-file_name.txt"), "my-file_name.txt");
});
