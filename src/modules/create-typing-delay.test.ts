import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createTypingDelay } from "./create-typing-delay";

test("createTypingDelay", async () => {
  const gen = createTypingDelay();
  const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  await new Promise((resolve) => setTimeout(resolve, 256));
  for (const char of str) {
    const delay = gen(char, 1);
    // process.stdout.write(char);
    // await new Promise((resolve) => setTimeout(resolve, delay));
  }
});
