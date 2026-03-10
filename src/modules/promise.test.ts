import { doesNotReject, deepStrictEqual as eq, rejects } from "node:assert";
import { test } from "node:test";
import { QueueWorker, retry, sleep } from "./promise";

test("sleep", async () => {
  const a = Date.now();
  await sleep(39);
  const b = Date.now();
  eq(b - a >= 38, true);
});

test("retry", async () => {
  rejects(async () => {
    const fn = async () => {
      throw new Error("An error occurred");
    };

    await retry(fn, 3, 10, () => {
      // ...
    });
  });

  doesNotReject(async () => {
    let j = 2;

    const fn = async () => {
      if (j > 0) {
        throw new Error("An error occurred");
      }
    };

    await retry(fn, 3, 10, () => {
      j--;
    });
  });
});

test("QueueWorker", async () => {
  const worker = new QueueWorker();
  const results: number[] = [];

  await Promise.all([
    worker.add(async () => {
      await sleep(30);
      results.push(1);
    }),
    worker.add(async () => {
      await sleep(10);
      results.push(2);
    }),
    worker.add(async () => {
      results.push(3);
    }),
  ]);

  eq(results, [1, 2, 3]);

  const startedAt = Date.now();

  worker.add(async () => {
    await sleep(10);
  });
  worker.add(async () => {
    await sleep(10);
  });
  worker.add(async () => {
    await sleep(10);
    eq(Date.now() - startedAt >= 30, true);
  });
});
