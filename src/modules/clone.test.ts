import { describe, test } from "node:test";
import assert from "node:assert";
import { clone } from "./clone";

test("clone", () => {
  const a = { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } };
  const b = clone(a);
  eq(b, { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } });
  a.arr = [0, 0, 0];
  eq(a, { arr: [0, 0, 0], obj: { o: 1, b: 2, j: 3 } });
  eq(b, { arr: [1, 2, 3], obj: { o: 1, b: 2, j: 3 } });
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
