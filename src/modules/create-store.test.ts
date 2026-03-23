import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createStore } from "./create-store";

test("createStore", () => {
  // basic usage
  const store = createStore({ count: 1 }, {});
  store.count = 2;
  eq(store.count, 2);

  // call handler
  let oldVal: number | undefined;
  let newVal: number | undefined;
  const store2 = createStore(
    { count: 1 },
    {
      count: (o, n) => {
        oldVal = o;
        newVal = n;
      },
    },
  );
  store2.count = 5;
  eq(oldVal, 1);
  eq(newVal, 5);

  // same value: does not call handler
  let called = false;
  const store3 = createStore(
    { count: 1 },
    {
      count: () => {
        called = true;
      },
    },
  );
  store3.count = 1;
  eq(called, false);

  // multi keys
  const changes: string[] = [];
  const store4 = createStore(
    { a: 1, b: 2 },
    {
      a: () => {
        changes.push("a");
      },
      b: () => {
        changes.push("b");
      },
    },
  );
  store4.a = 10;
  store4.b = 20;
  eq(changes, ["a", "b"]);

  // no handler in key
  const store5 = createStore(
    { a: 1, b: 2 },
    {
      a: () => {
        changes.push("a2");
      },
    },
  );
  store5.b = 99;
  eq(store5.b, 99);
});
