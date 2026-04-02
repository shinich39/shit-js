/// <reference types="node" />
import { deepStrictEqual as eq, ok } from "node:assert";
import { test } from "node:test";
import { createTypingDelay } from "./create-typing-delay";

test("createTypingDelay", async () => {
  const td = createTypingDelay();
  // const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const str = "Lorem ipsum";
  let total = 0;
  const start = Date.now();
  for (const char of str) {
    const delay = td(char, 2);
    total += delay;
    await new Promise((resolve) => setTimeout(resolve, delay));
    // process.stdout.write(char);
  }

  ok(Date.now() - start >= total);
});
