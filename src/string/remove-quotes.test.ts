import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { removeQuotes } from "./remove-quotes";

test("removeQuotes", () => {
  const str = `"Lorem ipsum dolor sit amet, consectetur adipiscing elit."`;
  eq(removeQuotes(str), `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`);
});
