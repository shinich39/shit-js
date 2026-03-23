import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { xor } from "./xor";

test("xor", () => {
  const orig = "Hello, world!";
  const encrypted = xor(orig, "this is salt!");
  eq(encrypted !== orig, true);
  const decrypted = xor(encrypted, "this is salt!");
  eq(decrypted, orig);
});
