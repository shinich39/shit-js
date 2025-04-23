import { describe, test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { selectChild, selectChildren } from "./selector";
import { Tree } from "./tree";

const html = `
<!DOCTYPE html>
<?xml version="1.0" encoding="utf-8"?>
<html style="  line-height: 2;  ">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>index.html</title>
  </head>

  <body>
    <!-- Test normal tags -->
    <div id="div1">
      <div id="div2" class="abc 'test'" hidden>
        Text 1
        <img class="self-closing" alt="image" />
        Text 2
      </div>

      <p class="inner">
        INNER
      </p>
    </div>

    <!-- Test Preformatted -->
    <pre><code>
      Hello, world!
    </code></pre>

    

    <p>
    TEST
    </p>

    <!-- Test Script -->
    
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

test("selectChildren", () => {
  const s = `body > div#div1 > div#div2.abc img.self-closing[class^="self"][class$="closing"][class="self-closing"][alt^='ima']`;

  const root = Tree.parse(html);

  const img = Tree.find(
    root,
    (c) => c.tag === "img" && c.attrs?.alt === "image"
  );

  let t = Date.now(),
    c = 0;
  while (Date.now() - t < 10) {
    const _ = selectChildren(root, s);
    c++;
  }

  console.log(`selectChildren():`, c);

  const result = selectChildren(root, s);

  eq(!!result[0], true);
  eq(result[0], img);
});

test("selectChild", () => {
  const s = `body > div#div1 > div#div2.abc img.self-closing[class^="self"][class$="closing"][class="self-closing"][alt^='ima']`;
  const root = Tree.parse(html);
  const img = Tree.find(
    root,
    (c) => c.tag === "img" && c.attrs?.alt === "image"
  );
  const result = selectChild(root, s);

  eq(!!result, true);
  eq(result, img);
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
