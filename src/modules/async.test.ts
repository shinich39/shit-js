import { describe, test } from "node:test";
import assert from "node:assert";
import { sleep } from "./async";

test("sleep", async () => {
  const a = Date.now();
  await sleep(39);
  const b = Date.now();
  eq(b - a >= 39, true);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
