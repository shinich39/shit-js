import { describe, test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { Tree } from "./tree";

test("Tree.parse()", () => {
  const html = `
<!DOCTYPE html>
<?xml version="1.0" encoding="utf-8"?>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>index.html</title>
  </head>

  <body>
    <!-- Test Comment -->
    <div id="div1">
      <div id="div2" class="abc 'test'" hidden>
        <img class="unclosed" alt="image" />
        I split images!
        <img class="closed" alt="im'a'ge" />
      </div>
    </div>
    <!-- Test Preformatted -->

    <pre><code>
      Hello, world!
    </code></pre>
    <script src="../dist/index.js"></script>
    <script>
      // JS Comment
      document.getElementById("result").innerHTML = '<ol>' +
        Object.keys(window.utils).map((item) => {
          return \`<li>\$\{item\}</li>\`;
        }).join("") + '</ol>';
    </script>
  </body>
</html>
  `.trim();

  const now = Date.now();
  let count = 0;
  while (Date.now() - now < 10) {
    Tree.parse(html);
    count++;
  }

  console.log(Date.now() - now + "ms", count);

  const nodes = Tree.parse(html);
  const root = nodes.find((node) => node.type === "root");

  if (!root) {
    throw new Error("Root node not found");
  }

  // console.log(nodes);
  // console.log(Tree.stringify(root));

  eq(Tree.stringify(root), html);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
