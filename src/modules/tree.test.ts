import { describe, test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { Tree, TreeTag } from "./tree";

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

test("Tree.parse()", () => {
  const now = Date.now();
  let count = 0;
  while (Date.now() - now < 10) {
    Tree.parse(html);
    count++;
  }

  console.log(`${count} * Tree.parse():`, Date.now() - now + "ms");

  const root = Tree.parse(html);

  eq(Tree.stringify(root), html);

  const script = Tree.findChild(
    root,
    (child) => child.tag === "script" && !child.attrs.src
  ) as TreeTag;
  eq(
    Tree.getContent(script),
    `
      // JS Comment
      document.getElementById("result").innerHTML = '<ol>' +
        Object.keys(window.utils).map((item) => {
          return \`<li>\$\{item\}</li>\`;
        }).join("") + '</ol>';
    `
  );

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
  Tree.getChildren(root, (node, index) => {
    if (node.type === "tag") {
      eq(node.tag, seq.shift());
    }
  });

  const preNode = Tree.findChild(root, (node, index) => {
    return node.type === "tag" && node.tag === "pre";
  }) as TreeTag;

  eq(preNode && preNode.type === "tag" && preNode.tag === "pre", true);

  const tagChildren = Tree.findChildren(root, (node, index) => {
    return node.type === "tag";
  });

  tagChildren.forEach((item) => eq(item.type, "tag"));
  eq(tagChildren.length, 15);

  const parents = Tree.getParents(preNode, (parent, index) => {
    return parent;
  });

  parents.forEach((item) =>
    eq(item.type === "tag" || item.type === "root", true)
  );
  eq(parents.length, 3);

  const bodyNode = Tree.findParent(preNode, (parent, index) => {
    return parent.type === "tag" && parent.tag === "body";
  });

  eq(bodyNode && bodyNode.type === "tag" && bodyNode.tag === "body", true);

  const tagParents = Tree.findParents(preNode, (parent, index) => {
    return parent.type === "tag";
  });

  tagParents.forEach((item) => eq(item.type === "tag", true));
  eq(tagParents.length, 2);
});

test("new Tree()", () => {
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
  tree.getChildren((node, index) => {
    if (node.type === "tag") {
      eq(node.tag, seq.shift());
    }
  });

  const preNode = tree.findChild((node, index) => {
    return node.type === "tag" && node.tag === "pre";
  });

  eq(preNode && preNode.type === "tag" && preNode.tag === "pre", true);

  const tagNodes = tree.findChildren((node, index) => {
    return node.type === "tag";
  });

  tagNodes.forEach((item) => eq(item.type, "tag"));
});

test("subtree", () => {
  const root = Tree.parse(html);
  const body = Tree.findChild(
    root,
    (node) => node.type === "tag" && node.tag === "body"
  ) as TreeTag;
  eq(
    Tree.stringify(body),
    `<body>
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
  </body>`
  );
});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
