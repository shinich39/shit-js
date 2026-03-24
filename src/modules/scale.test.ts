import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { scaleToContain, scaleToCover, scaleToFit } from "./scale";

test("scaleToContain", () => {
  eq(scaleToContain(100, 100, 200, 100), [100, 100]);
  eq(scaleToContain(200, 100, 100, 100), [100, 50]);
  eq(scaleToContain(100, 200, 100, 100), [50, 100]);
});

test("scaleToCover", () => {
  eq(scaleToCover(100, 100, 200, 100), [200, 200]);
  eq(scaleToCover(200, 100, 100, 100), [200, 100]);
  eq(scaleToCover(100, 200, 100, 100), [100, 200]);
});

test("scaleToFit", () => {
  eq(scaleToFit(150, 150, 200, 200, 100, 100), [150, 150]);
  eq(scaleToFit(300, 300, 200, 200, 100, 100), [200, 200]);
  eq(scaleToFit(50, 50, 200, 200, 100, 100), [100, 100]);
  eq(scaleToFit(400, 200, 200, 200, 100, 100), [200, 100]); // width > height
  eq(scaleToFit(200, 400, 200, 200, 100, 100), [100, 200]); // height > width
  eq(scaleToFit(200, 200, 200, 200, 100, 100), [200, 200]);
  eq(scaleToFit(100, 100, 200, 200, 100, 100), [100, 100]);
});
