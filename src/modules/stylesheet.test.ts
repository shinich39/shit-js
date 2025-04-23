import { describe, test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { Tree } from "./tree";
import { setStyle } from "./stylesheet";

const html = `
<!DOCTYPE html>
<?xml version="1.0" encoding="utf-8"?>
<html style="line-height: 2;">
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
    </div>

    <!-- Test Preformatted -->
    <pre><code>
      Hello, world!
    </code></pre>

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

test("setStyle", () => {
  const root = Tree.parse(html);

  const css = fs.readFileSync("test/normalize.css", "utf8");

  // let t = Date.now(),
  //   c = 0;
  // while (Date.now() - t < 100) {
  //   setStyle(root, css);
  //   c++;
  // }

  // console.log(`setStyle():`, c);

  // object: 100ms 1100
  // regexp: 100ms 950

  setStyle(root, css);

  const el = Tree.find(root, (c) => c.tag === "html");

  // old: <html style="line-height: 2;">
  // new: <html style="line-height:1.15;-webkit-text-size-adjust:100%;">
  eq(el?.attrs?.style, "line-height:1.15;-webkit-text-size-adjust:100%;");
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
