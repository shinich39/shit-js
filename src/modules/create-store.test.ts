import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createStore } from "./create-store";

test("createStore: basic", () => {
  const store = createStore({ count: 1 }, {});
  store.count = 2;
  eq(store.count, 2);
});

test("createStore: handler", () => {
  let oldVal: number | undefined;
  let newVal: number | undefined;
  const store = createStore(
    { count: 1 },
    {
      count: (o, n) => {
        oldVal = o;
        newVal = n;
      },
    },
  );
  store.count = 5;
  eq(oldVal, 1);
  eq(newVal, 5);
});

test("createStore: same value", () => {
  let called = false;
  const store = createStore(
    { count: 1 },
    {
      count: () => {
        called = true;
      },
    },
  );
  store.count = 1;
  eq(called, false);
});

test("createStore: multi keys", () => {
  const changes: string[] = [];
  const store = createStore(
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
  store.a = 10;
  store.b = 20;
  eq(changes, ["a", "b"]);
});

test("createStore: no key", () => {
  const store = createStore(
    { a: 1, b: 2 },
    {
      a: () => {},
    },
  );
  store.b = 99;
  eq(store.b, 99);
});
