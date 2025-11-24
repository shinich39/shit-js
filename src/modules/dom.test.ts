import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { DOMElement } from "./dom";

describe(path.basename(import.meta.filename), () => {

  const html = `
<head>
  <style>
    #a { color: #000000; }
  </style>
</head>
<body>
  <!-- Test normal tags -->

  <div id="div1">
    <div id="div2" class="abc 'test'" hidden>
      Text 1
      <img class="self-closing" alt="image" />
      Text 2
    </div>
  </div>

  <div id="container"></div>

  <!-- Test Preformatted -->

  <pre><code>
    Hello,&#160;world!
  </code></pre>

  <!-- Test Script "" <Test> -->
  
  <script src="../dist/index.js"></script>
  <script>
    // JS Comment
    document.getElementById("result").innerHTML = '<ol>' +
      Object.keys(window.utils).map((item) => {
        return \`<li>\$\{item\}</li>\`;
      }).join("") + '</ol>';
  </script>
</body>
`.trim();

  test("toString", () => {
    const root = new DOMElement(html);
    eq(html, root.toString());
    const root2 = new DOMElement(root.toString());
    eq(html, root2.toString());
  });

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
