import { doesNotReject, deepStrictEqual as eq, rejects } from "node:assert";
import { test } from "node:test";
import { createQueue, retry, sleep } from "./promise";

test("sleep", async () => {
  const a = Date.now();
  await sleep(39);
  const b = Date.now();
  eq(b - a >= 38, true);
});

test("retry: reject", async () => {
  rejects(async () => {
    const fn = async () => {
      throw new Error("An error occurred");
    };
    const count = 3;
    const delay = 10;
    const onRetry = () => {};

    await retry(fn, { count, delay, onRetry });
  });
});

test("retry: resolve", async () => {
  doesNotReject(async () => {
    let j = 2;

    const fn = async () => {
      if (j > 0) {
        throw new Error("An error occurred");
      }
    };

    const count = 3;
    const delay = 10;
    const onRetry = () => {
      j--;
    };

    await retry(fn, { count, delay, onRetry });
  });
});

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

test("createQueue: wait", async () => {
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
