import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { clone } from "./clone";

test("clone", () => {
  // primitive
  eq(clone(1), 1);
  eq(clone("a"), "a");
  eq(clone(null), null);

  // object
  const obj = { a: 1, b: { c: 2 } };
  const clonedObj = clone(obj);
  eq(clonedObj, obj);
  eq(clonedObj === obj, false);
  eq(clonedObj.b === obj.b, false);

  // array
  const arr = [1, [2, 3]];
  const clonedArr = clone(arr);
  eq(clonedArr, arr);
  eq(clonedArr === arr, false);
  eq(clonedArr[1] === arr[1], false);

  // Date
  const date = new Date("2026-01-01");
  const clonedDate = clone(date);
  eq(clonedDate.getTime(), date.getTime());
  eq(clonedDate === date, false);

  // RegExp
  const re = /abc/gi;
  const clonedRe = clone(re);
  eq(clonedRe.source, re.source);
  eq(clonedRe.flags, re.flags);
  eq(clonedRe === re, false);

  // circular reference
  const circular: any = { a: 1 };
  circular.self = circular;
  const clonedCircular = clone(circular);
  eq(clonedCircular.a, 1);
  eq(clonedCircular.self === clonedCircular, true);
});
