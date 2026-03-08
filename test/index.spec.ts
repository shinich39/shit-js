import { test } from "@playwright/test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import * as shit from "../src/shit.js";

declare global {
  interface Window {
    shitJs: typeof shit;
  }
}

test("isNumeric()", async ({ page }) => {
  await page.goto("about:blank");
  await page.addScriptTag({ path: "./dist/shit.js" });

  const result = await page.evaluate(() => window.shitJs.isNumeric("1"));

  eq(result, true);
});