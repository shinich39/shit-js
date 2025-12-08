import { describe, test } from "node:test";
import { eq } from "../../test/assert.js";
import { parseDate } from "./date";

test("parseDate", () => {
  const result = parseDate(new Date());
  // console.log(result);
});