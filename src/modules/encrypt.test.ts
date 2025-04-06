import { describe, test } from "node:test";
import assert from "node:assert";
import { xor } from "./encrypt";

test("xor", () => {
  const orig =
    "https://translate.google.co.kr/?sl=en&tl=ko&text=encrypt%20string%20with%20XOR%20cipher&op=translate";
  const encrypted = xor(orig, "this is salt!");
  eq(encrypted !== orig, true);
  const decrypted = xor(encrypted, "this is salt!");
  eq(decrypted, orig);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
