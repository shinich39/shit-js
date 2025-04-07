import { describe, test } from "node:test";
import assert from "node:assert";
import { compareObject, getObjectValue } from "./object";

test("getObjectValue", () => {
  const a = { arr: [1,2,3], obj: { o: 1, b: 2, j: 3 } };
  eq(getObjectValue(a, "arr.0"), 1);
  eq(getObjectValue(a, "arr.2"), 3);
  eq(getObjectValue(a, "arr"), [1,2,3]);
  eq(getObjectValue(a, "obj.o"), 1);
  eq(getObjectValue(a, "obj.j"), 3);
});

test("compareObject", () => {
  const a = {
    str: "abc",
    num: 1,
    undefined: undefined,
    null: null,
    obj: {
      key: "value",
    },
    arr: [
      1,2,3
    ],
    date: new Date(),
    set: new Set([1, 2, 3]),
    map: new Map([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]),
  }

  eq(compareObject(a, {
    str: "abc",
  }), true);

  eq(compareObject(a, {
    str: "ac",
  }), false);

  eq(compareObject(a, {
    num: 1,
  }), true);

  eq(compareObject(a, {
    num: 2,
  }), false);

  eq(compareObject(a, {
    undefined: undefined,
  }), true);

  eq(compareObject(a, {
    undefined: null,
  }), false);

  eq(compareObject(a, {
    null: null,
  }), true);

  eq(compareObject(a, {
    null: undefined,
  }), false);

  eq(compareObject(a, {
    arr: [
      1,2,3
    ]
  }), true);

  eq(compareObject(a, {
    arr: [
      1,2,4
    ]
  }), false);

  eq(compareObject(a, {
    obj: {
      key: "value",
    },
  }), true);

  eq(compareObject(a, {
    obj: {
      key: "val",
    },
  }), false);

  eq(compareObject(a, {
    obj: {
      key: 1,
    },
  }), false);

  eq(compareObject(a, {
    set: new Set([1, 3]),
  }), true);

  eq(compareObject(a, {
    set: new Set([1, 3, 4]),
  }), false);

  eq(compareObject(a, {
    map: new Map([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]),
  }), true);

  eq(compareObject(a, {
    map: new Map([
      [3, "three"],
    ]),
  }), true);

  eq(compareObject(a, {
    map: new Map([
      [1, "one"],
      [3, "three"],
      [3, "three"],
    ]),
  }), true);

  eq(compareObject(a, {
    map: new Map([
      [4, "four"],
    ]),
  }), false);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
