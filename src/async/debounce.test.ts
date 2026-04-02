import { deepStrictEqual as eq } from "node:assert";
import { mock, test } from "node:test";
import { debounce } from "./debounce";

test("debounce", async () => {
  const fn = mock.fn();
  const debounced = debounce(fn, 50);

  debounced("a");
  debounced("b");
  debounced("c");

  await new Promise((r) => setTimeout(r, 100));

  eq(fn.mock.calls.length, 1);
  eq(fn.mock.calls[0].arguments, ["c"]);
});
