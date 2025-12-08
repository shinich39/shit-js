import { describe, test } from "node:test";
import { deepStrictEqual as eq, throws, doesNotThrow, rejects } from "node:assert";
import { clone, matchObject, getObjectValue } from "./object";

test("clone", () => {
  const a = { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } };
  const b = clone(a);
  eq(b, { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } });
  a.arr = [0, 0, 0];
  eq(a, { arr: [0, 0, 0], obj: { o: 1, b: 2, j: 3 } });
  eq(b, { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } });
});

test("getObjectValue", () => {
  const a = { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } };
  eq(getObjectValue(a, "arr.0"), 1);
  eq(getObjectValue(a, "arr.2"), 3);
  eq(getObjectValue(a, "arr"), [1, 2, 3]);
  eq(getObjectValue(a, "obj.o"), 1);
  eq(getObjectValue(a, "obj.j"), 3);
});

test("matchObject", () => {
  const a = {
    str: "abc",
    num: 1,
    undefined: undefined,
    null: null,
    obj: {
      key: "value",
    },
    arr: [1, 2, 3],
    date: new Date(),
    set: new Set([1, 2, 3]),
    map: new Map([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]),
  };

  eq(
    matchObject(a, {
      str: "abc",
    }),
    true
  );

  eq(
    matchObject(a, {
      str: "ac",
    }),
    false
  );

  eq(
    matchObject(a, {
      num: 1,
    }),
    true
  );

  eq(
    matchObject(a, {
      num: 2,
    }),
    false
  );

  eq(
    matchObject(a, {
      undefined: undefined,
    }),
    true
  );

  eq(
    matchObject(a, {
      undefined: null,
    }),
    false
  );

  eq(
    matchObject(a, {
      null: null,
    }),
    true
  );

  eq(
    matchObject(a, {
      null: undefined,
    }),
    false
  );

  eq(
    matchObject(a, {
      arr: [1, 2, 3],
    }),
    true
  );

  eq(
    matchObject(a, {
      arr: [1, 2, 4],
    }),
    false
  );

  eq(
    matchObject(a, {
      obj: {
        key: "value",
      },
    }),
    true
  );

  eq(
    matchObject(a, {
      obj: {
        key: "val",
      },
    }),
    false
  );

  eq(
    matchObject(a, {
      obj: {
        key: 1,
      },
    }),
    false
  );

  eq(
    matchObject(a, {
      set: new Set([1, 3]),
    }),
    true
  );

  eq(
    matchObject(a, {
      set: new Set([1, 3, 4]),
    }),
    false
  );

  eq(
    matchObject(a, {
      map: new Map([
        [1, "one"],
        [2, "two"],
        [3, "three"],
      ]),
    }),
    true
  );

  eq(
    matchObject(a, {
      map: new Map([[3, "three"]]),
    }),
    true
  );

  eq(
    matchObject(a, {
      map: new Map([
        [1, "one"],
        [3, "three"],
        [3, "three"],
      ]),
    }),
    true
  );

  eq(
    matchObject(a, {
      map: new Map([[4, "four"]]),
    }),
    false
  );
});