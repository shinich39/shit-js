import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { parseDate } from "./date";

describe(path.basename(import.meta.filename), () => {

  test("date", () => {
    const result = parseDate(new Date());
    // console.log(result);
  });

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
