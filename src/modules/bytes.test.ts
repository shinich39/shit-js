import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { fromGb, fromKb, fromMb, fromTb, toGb, toKb, toMb, toTb } from "./bytes";

test("bytes - fromKb", () => {
  eq(fromKb(1), 1024);
  eq(fromKb(2), 2048);
  eq(fromKb(0), 0);
});

test("bytes - fromMb", () => {
  eq(fromMb(1), 1024 ** 2);
  eq(fromMb(2), 2 * 1024 ** 2);
  eq(fromMb(0), 0);
});

test("bytes - fromGb", () => {
  eq(fromGb(1), 1024 ** 3);
  eq(fromGb(2), 2 * 1024 ** 3);
  eq(fromGb(0), 0);
});

test("bytes - fromTb", () => {
  eq(fromTb(1), 1024 ** 4);
  eq(fromTb(2), 2 * 1024 ** 4);
  eq(fromTb(0), 0);
});

test("bytes - toKb", () => {
  eq(toKb(1024), 1);
  eq(toKb(2048), 2);
  eq(toKb(0), 0);
});

test("bytes - toMb", () => {
  eq(toMb(1024 ** 2), 1);
  eq(toMb(2 * 1024 ** 2), 2);
  eq(toMb(0), 0);
});

test("bytes - toGb", () => {
  eq(toGb(1024 ** 3), 1);
  eq(toGb(2 * 1024 ** 3), 2);
  eq(toGb(0), 0);
});

test("bytes - toTb", () => {
  eq(toTb(1024 ** 4), 1);
  eq(toTb(2 * 1024 ** 4), 2);
  eq(toTb(0), 0);
});
