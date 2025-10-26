import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { QueueWorker, sleep } from "./async";

describe(path.basename(import.meta.filename), () => {

  test("sleep", async () => {
    const a = Date.now();
    await sleep(39);
    const b = Date.now();
    eq(b - a >= 38, true);
  });

  // test("retry", async () => {
  //   const failure = (message: string) => {
  //     return new Promise((resolve, reject) => {
  //       console.log(message);
  //       reject(new Error("An error occurred"));
  //     });
  //   }
  //   const promise = retry(failure, 3, 256);
  //   try {
  //     await promise("GG");
  //   } catch(err) {
  //     console.error(err);
  //   }
  // });

  // test("QueueWorker", async () => {
  //   const worker = new QueueWorker();
  //   for (let i = 0; i < 3; i++) {
  //     worker.add(async function (index) {
  //       await sleep(1000);
  //       console.log(`Task ${i}, Index: ${index}, Queue: ${worker.queue.length}`);
  //     });
  //   }
  // });
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
