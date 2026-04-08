import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { extractStrings } from "./extract-strings";

test("extractStrings", () => {
  const a = `Lorem "ipsum" dolor sit amet, 'consectetur' adipiscing elit.`;
  eq(extractStrings(a), ["ipsum", "consectetur"]);

  const b = `Lorem "ip's'um" dolor sit amet, 'cons"ect"etur' adipiscing elit.`;
  eq(extractStrings(b), ["ip's'um", `cons"ect"etur`]);
  eq(extractStrings(extractStrings(b)[0]), [`s`]);
  eq(extractStrings(extractStrings(b)[1]), [`ect`]);

  const c = `Lorem ipsum dolor sit amet, consectetur adipiscing "elit.`;
  eq(extractStrings(c), []);
});
