/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "@playwright/test";
import type * as shit from "../src/index.js";

declare global {
  interface Window {
    shitJs: typeof shit;
  }
}

test("toNumber()", async ({ page }) => {
  await page.goto("about:blank");
  await page.addScriptTag({ path: "./dist/shit.js" });

  const result = await page.evaluate(() => window.shitJs.toNumber("1"));

  eq(result, 1);
});
