import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { batch } from "./batch";

test("batch", async () => {
  let acc = 0;

  const queue = [1, 2, 3, 4, 5].map((v) => {
    acc += v;
    return () => Promise.resolve(v);
  });

  const result = await batch(queue, 5);

  eq(acc, 15);
  eq(result, [1, 2, 3, 4, 5]);
});
