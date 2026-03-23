import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { scaleToFit } from "./scale-to-fit";

test("scaleToFit - within bounds (no scaling)", () => {
  const [w, h] = scaleToFit(150, 150, 200, 200, 100, 100);
  eq(w, 150);
  eq(h, 150);
});

test("scaleToFit - exceed max (scaled down)", () => {
  const [w, h] = scaleToFit(300, 300, 200, 200, 100, 100);
  eq(w, 200);
  eq(h, 200);
});

test("scaleToFit - below min (scaled up)", () => {
  const [w, h] = scaleToFit(50, 50, 200, 200, 100, 100);
  eq(w, 100);
  eq(h, 100);
});

test("scaleToFit - non-square aspect ratio", () => {
  // width > height
  const [w1, h1] = scaleToFit(400, 200, 200, 200, 100, 100);
  eq(w1, 200);
  eq(h1, 100);

  // height > width
  const [w2, h2] = scaleToFit(200, 400, 200, 200, 100, 100);
  eq(w2, 100);
  eq(h2, 200);
});

test("scaleToFit - edge cases", () => {
  // exactly max
  const [w1, h1] = scaleToFit(200, 200, 200, 200, 100, 100);
  eq(w1, 200);
  eq(h1, 200);

  // exactly min
  const [w2, h2] = scaleToFit(100, 100, 200, 200, 100, 100);
  eq(w2, 100);
  eq(h2, 100);
});
