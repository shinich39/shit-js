import { describe, test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { Tree } from "./tree";

test("Tree.statics", () => {
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

  const now = Date.now();
  let count = 0;
  while (Date.now() - now < 10) {
    Tree.parse(html);
    count++;
  }

  console.log(`${count} * Tree.parse():`, Date.now() - now + "ms");

  const root = Tree.parse(html);

  eq(Tree.stringify(root), html);

  const seq = [
    "!DOCTYPE",
    "?xml",
    "html",
    "head",
    "meta",
    "meta",
    "title",
    "body",
    "div",
    "div",
    "img",
    "pre",
    "code",
    "script",
    "script",
  ];
  Tree.map(root, (node, index) => {
    if (node.type === "tag") {
      eq(node.tag, seq.shift());
    }
  });

  const preNode = Tree.find(root, (node, index) => {
    return node.type === "tag" && node.tag === "pre";
  });

  eq(preNode && preNode.type === "tag" && preNode.tag === "pre", true);

  const tagNodes = Tree.filter(root, (node, index) => {
    return node.type === "tag";
  });

  tagNodes.forEach((item) => eq(item.type, "tag"));
});

test("new Tree()", () => {
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

  const now = Date.now();
  let count = 0;
  while (Date.now() - now < 10) {
    new Tree(html);
    count++;
  }

  console.log(`${count} * new Tree():`, Date.now() - now + "ms");

  const tree = new Tree(html);

  eq(tree.toString(), html);

  const seq = [
    "!DOCTYPE",
    "?xml",
    "html",
    "head",
    "meta",
    "meta",
    "title",
    "body",
    "div",
    "div",
    "img",
    "pre",
    "code",
    "script",
    "script",
  ];
  tree.map((node, index) => {
    if (node.type === "tag") {
      eq(node.tag, seq.shift());
    }
  });

  const preNode = tree.find((node, index) => {
    return node.type === "tag" && node.tag === "pre";
  });

  eq(preNode && preNode.type === "tag" && preNode.tag === "pre", true);

  const tagNodes = tree.filter((node, index) => {
    return node.type === "tag";
  });

  tagNodes.forEach((item) => eq(item.type, "tag"));
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
