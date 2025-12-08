import { describe, test } from "node:test";
import { eq } from "../../test/assert.js";
import { QueueWorker, sleep, retry } from "./async";

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

//   const startedAt = Date.now();

//   for (let i = 0; i < 3; i++) {
//     const index = i;
//     worker.add(async function () {
//       await sleep(1000);
//       console.log(`Task ${index}, Queue: ${worker.queue.length}, Time: ${Date.now() - startedAt}ms`);
//     });
//   }

//   worker.start();

//   setTimeout(() => {
//     worker.pause();
//   }, 1500);

//   setTimeout(() => {
//     worker.start();
//   }, 3000);
// });