import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { sleep } from "./sleep";

test("sleep", async () => {
  const a = Date.now();
  await sleep(39);
  const b = Date.now();
  eq(b - a >= 38, true);
});
