import { describe, test } from "node:test";
import assert from "node:assert";
import { getType } from "./index";

test("index", () => {
  eq(getType([]), "array");
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
