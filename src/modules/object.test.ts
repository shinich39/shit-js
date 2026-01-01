import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import { copyObject, createStore } from "./object";

test("copyObject", () => {
  const a = { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } };
  const b = copyObject(a);
  eq(b, { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } });
  a.arr = [0, 0, 0];
  eq(a, { arr: [0, 0, 0], obj: { o: 1, b: 2, j: 3 } });
  eq(b, { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } });
});

test("createStore", () => {
  const store = createStore<number>((prop, oldValue, newValue) => {
    // console.log(prop, oldValue, newValue);
  });

  store.set("a", 1);
  const v1 = store.get("a");
  store.set("a", 39);
  const v2 = store.get("a");
  eq(v1, 1);
  eq(v2, 39);
});