import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { xor } from "./xor";

test("xor", () => {
  // encrypt
  const orig = "Hello, world!";
  const encrypted = xor(orig, "this is salt!");
  eq(encrypted !== orig, true);

  // decrypt
  const decrypted = xor(encrypted, "this is salt!");
  eq(decrypted, orig);
});
