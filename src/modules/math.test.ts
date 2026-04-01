/// <reference types="node" />
import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { clamp, fromRadians, lerp, mode, toRadians, wrap } from "./math";

test("mode", () => {
  eq(mode([0, 0, 2, 3, 4, 5, 6, 7.5, 8.5, 9]), { value: 0, count: 2 });
  eq(mode(["a", "a", "b"]), { count: 2, value: "a" });
  eq(mode(["a", "a", "b", "b", "b"]), { count: 3, value: "b" });
});

test("clamp", () => {
  eq(clamp(5, 0, 10), 5);
  eq(clamp(-1, 0, 10), 0);
  eq(clamp(11, 0, 10), 10);
  eq(clamp(0, 0, 10), 0);
  eq(clamp(10, 0, 10), 10);
  eq(clamp(5, 5, 5), 5);
});

test("wrap", () => {
  eq(wrap(5, 0, 10), 5);
  eq(wrap(-1, 0, 10), 9);
  eq(wrap(10, 0, 10), 0);
  eq(wrap(11, 0, 10), 1);
  eq(wrap(0, 0, 10), 0);
  eq(wrap(-11, 0, 10), 9);
  eq(wrap(21, 0, 10), 1);
  eq(wrap(3, 2, 5), 3);
  eq(wrap(1, 2, 5), 4);
});

test("lerp", () => {
  eq(lerp(0, 100, 0), 0);
  eq(lerp(0, 100, 0.5), 50);
  eq(lerp(0, 100, 1), 100);

  eq(lerp(0, 100, -0.5), -50);
  eq(lerp(0, 100, 1.5), 150);

  eq(lerp(-50, 50, 0.5), 0);

  eq(lerp(0, 1, 0.25), 0.25);
});

test("toRadians", () => {
  eq(toRadians(0), 0);
  eq(toRadians(90), Math.PI / 2);
  eq(toRadians(180), Math.PI);
  eq(toRadians(360), Math.PI * 2);
  eq(toRadians(-90), -Math.PI / 2);
});

test("fromRadians", () => {
  eq(fromRadians(0), 0);
  eq(fromRadians(Math.PI / 2), 90);
  eq(fromRadians(Math.PI), 180);
  eq(fromRadians(Math.PI * 2), 360);
  eq(fromRadians(-Math.PI / 2), -90);
});
