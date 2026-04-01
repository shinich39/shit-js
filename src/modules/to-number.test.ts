/// <reference types="node" />
import { deepStrictEqual as eq, throws } from "node:assert";
import { test } from "node:test";
import { toNumber } from "./to-number";

test("toNumber", () => {
  eq(toNumber(0), 0);
  eq(toNumber(1), 1);
  eq(toNumber(1.1), 1.1);
  eq(toNumber("0"), 0);
  eq(toNumber("1"), 1);
  eq(toNumber("1.1"), 1.1);
  eq(toNumber(true), 1);
  eq(toNumber(false), 0);
  eq(toNumber(null), 0);
  eq(toNumber(undefined), 0);
  throws(() => {
    toNumber({});
  });
  throws(() => {
    toNumber([]);
  });
});
