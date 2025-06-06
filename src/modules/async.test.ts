import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { sleep } from "./async";

describe(path.basename(import.meta.filename), () => {

  test("sleep", async () => {
    const a = Date.now();
    await sleep(39);
    const b = Date.now();
    eq(b - a >= 38, true);
  });

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
