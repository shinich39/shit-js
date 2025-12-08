import { describe, test } from "node:test";
import { deepStrictEqual as eq, throws, doesNotThrow, rejects } from "node:assert";
import { QueueWorker, sleep, retry } from "./promise";

test("sleep", async () => {
  const a = Date.now();
  await sleep(39);
  const b = Date.now();
  eq(b - a >= 38, true);
});

test("retry", async () => {
  const func = retry(async () => {
    throw new Error("An error occurred");
  }, 3, 256);

  rejects(() => func());
});

test("QueueWorker", async () => {
  const worker = new QueueWorker();

  const startedAt = Date.now();

  for (let i = 0; i < 3; i++) {
    const index = i;
    worker.add(async function () {
      await sleep(100);
      console.log(`Task ${index}, Queue: ${worker.queue.length}, Time: ${Date.now() - startedAt}ms`);
    });
  }

  worker.start();

  setTimeout(() => {
    worker.pause();
  }, 150);

  setTimeout(() => {
    worker.start();
  }, 300);
});