import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createQueue } from "./create-queue";

const sleep = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

test("createQueue: sequence", async () => {
  const queue = createQueue();
  const results: number[] = [];

  await Promise.all([
    queue(async () => {
      await sleep(30);
      results.push(1);
    }),
    queue(async () => {
      await sleep(10);
      results.push(2);
    }),
    queue(async () => {
      results.push(3);
    }),
  ]);

  eq(results, [1, 2, 3]);
});

test("createQueue: sleep", async () => {
  const queue = createQueue();
  const startedAt = Date.now();

  queue(async () => {
    await sleep(10);
  });
  queue(async () => {
    await sleep(10);
  });
  queue(async () => {
    await sleep(10);
    eq(Date.now() - startedAt >= 30, true);
  });
});
