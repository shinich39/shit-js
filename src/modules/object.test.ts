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
  const initial = {
    count: 1,
    name: "TEST-1",
  }

  const store = createStore<typeof initial>(initial, (key, oldValue, newValue) => {
    // console.log(key, oldValue, newValue);
  });

  eq(store.count, 1);
  eq(store.name, `TEST-1`);

  store.count++;
  store.name = `TEST-${store.count}`;

  eq(store.count, 2);
  eq(store.name, `TEST-2`);
});