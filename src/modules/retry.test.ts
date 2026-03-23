import { doesNotReject, deepStrictEqual as eq, rejects } from "node:assert";
import { test } from "node:test";
import { type RetryHandler, retry } from "./retry";

test("retry - reject", async () => {
  rejects(async () => {
    const fn = async () => {
      throw new Error("An error occurred");
    };
    const count = 3;
    const delay = 10;
    const onRetry: RetryHandler = (error, index) => {};
    await retry(fn, { count, delay, onRetry });
  });
});

test("retry - resolve", async () => {
  doesNotReject(async () => {
    let j = 2;

    const fn = async () => {
      if (j > 0) {
        throw new Error("An error occurred");
      }
    };

    const count = 3;
    const delay = 10;
    const onRetry: RetryHandler = () => {
      j--;
    };

    await retry(fn, { count, delay, onRetry });
  });
});
