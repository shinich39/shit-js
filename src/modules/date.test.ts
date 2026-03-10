import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { parseDate } from "./date";

test("parseDate", () => {
  const parsed = parseDate(new Date("2000-01-03"));
  eq(parsed.YYYY, "2000");
  eq(parsed.MM, "01");
  eq(parsed.DD, "03");
});