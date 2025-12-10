import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import { parseDate } from "./date";

test("parseDate", () => {
  doesNotThrow(() => parseDate(new Date()));
});