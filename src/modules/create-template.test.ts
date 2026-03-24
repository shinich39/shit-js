import { deepStrictEqual as eq } from "node:assert";
import { test } from "node:test";
import { createTemplate } from "./create-template";

test("createTemplate: simple", () => {
  eq(createTemplate("{a} != {b}")({ a: "1", b: "2" }), "1 != 2");
});

test("createTemplate: nested", () => {
  eq(
    createTemplate("Lorem ipsum dolor {a.b.c}")({ a: { b: { c: "sit amet" } } }),
    "Lorem ipsum dolor sit amet",
  );
  eq(createTemplate("Lorem ipsum dolor {a.b.c}")({}), "Lorem ipsum dolor ");
  eq(
    createTemplate("Lorem ipsum dolor {a.b.c}")({ a: { b: { c: { d: "NULL" } } } }),
    "Lorem ipsum dolor [object Object]",
  );
});
