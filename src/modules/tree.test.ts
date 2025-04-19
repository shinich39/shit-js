import { describe, test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { Tree, TreeChild, TreeTag } from "./tree";

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
  const root = Tree.parse(html);

  eq(Tree.stringify(root), html);

  const script = Tree.find(
    root,
    (child) => child.tag === "script" && !child.attrs.src
  ) as TreeTag;
  eq(
    Tree.reduce(
      script,
      (acc, node) => {
        if (node.content) {
          acc += node.content;
        }
        return acc;
      },
      ""
    ),
    `
      // JS Comment
      document.getElementById("result").innerHTML = '<ol>' +
        Object.keys(window.utils).map((item) => {
          return \`<li>\$\{item\}</li>\`;
        }).join("") + '</ol>';
    `
  );

  eq(
    Tree.getContents(script).join(""),
    `
      // JS Comment
      document.getElementById("result").innerHTML = '<ol>' +
        Object.keys(window.utils).map((item) => {
          return \`<li>\$\{item\}</li>\`;
        }).join("") + '</ol>';
    `
  );

  const div1 = Tree.find(
    root,
    (child) => child.tag === "div" && child.attrs.id === "div1"
  ) as TreeTag;
  eq(
    Tree.reduce(
      div1,
      (acc, node) => {
        if (node.content) {
          acc += node.content;
        }
        return acc;
      },
      ""
    ),
    `
      
        Text 1
        
        Text 2
      
    `
  );

  eq(
    Tree.getContents(div1).join(""),
    `
      
        Text 1
        
        Text 2
      
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
  Tree.map(root, (node, index) => {
    if (node.type === "tag") {
      eq(node.tag, seq.shift());
    }
  });

  const preNode = Tree.find(root, (node, index) => {
    return node.type === "tag" && node.tag === "pre";
  }) as TreeTag;

  eq(preNode && preNode.type === "tag" && preNode.tag === "pre", true);

  const tagChildren = Tree.filter(root, (node, index) => {
    return node.type === "tag";
  });

  tagChildren.forEach((item) => eq(item.type, "tag"));
  eq(tagChildren.length, 15);

  const parents = Tree.mapParents(preNode, (parent, index) => {
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

  const tagParents = Tree.filterParents(preNode, (parent, index) => {
    return parent.type === "tag";
  });

  tagParents.forEach((item) => eq(item.type === "tag", true));
  eq(tagParents.length, 2);
});

test("new Tree()", () => {
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

test("subtree", () => {
  const root = Tree.parse(html);
  const body = Tree.find(
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
