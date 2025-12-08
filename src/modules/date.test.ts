import { describe, test } from "node:test";
import { deepStrictEqual as eq, throws, doesNotThrow, rejects } from "node:assert";
import { parseDate } from "./date";

test("parseDate", () => {
  doesNotThrow(() => parseDate(new Date()));
});