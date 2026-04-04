import { deepStrictEqual as eq, ok } from "node:assert";
import { test } from "node:test";
import { Ast, createAst } from "./ast";

const raw = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta charset="utf-8" />
  <title>Untitled</title>
</head>
<body>
  <h1 id="heading">
    Heading
  </h1>
  <nav id="nav" epub:type="toc">
    <ol>
      <li><a href="0.xhtml">Page 0</a></li>
    </ol>
  </nav>
  <div>
    <img src="this/is/path" />
  </div>
</body>
</html>`;

test("ast: parse", () => {
  const root = new Ast(raw);

  const pi = root.find((n) => n.type === "pi");
  const doctype = root.find((n) => n.type === "doctype");
  const head = root.find((n) => n.name === "head");
  const title = head?.find((n) => n.name === "title");
  const html = root.find((n) => n.name === "html");
  const body = root.find((n) => n.name === "body");
  const h1 = root.find((n) => n.name === "h1");
  const missing = root.find((n) => n.name === "missing");

  ok(!!pi);
  eq(pi?.name, "xml");
  eq(pi?.value, `version="1.0" encoding="UTF-8"`);
  ok(!!doctype);
  eq(doctype?.value, `html`);
  ok(!!head);
  ok(!!title);
  eq(title?.type, "element");
  ok(!!html);
  eq(html?.type, "element");
  ok(!!body);
  eq(body?.type, "element");
  ok(!!h1);
  ok(!missing);

  // find by name, id, attributes
  const nav1 = root.find((n) => n.name === "nav");
  const nav2 = body.find((n) => n.attributes.id === "nav");
  const nav3 = body.find((n) => n.attributes["epub:type"] === "toc");

  ok(nav1 === nav2);
  ok(nav2 === nav3);

  // depth
  eq(root.getDepth(), 0);
  eq(html?.getDepth(), 1);
  eq(body?.getDepth(), 2);
  eq(nav1?.getDepth(), 3);
  eq(nav2?.getDepth(), 3);
  eq(nav3?.getDepth(), 3);

  // value
  eq(title?.getValue(), "Untitled");
  eq(title?.getValues(), ["Untitled"]);

  eq(body?.getValue().trim(), "Heading\n  \n  \n    \n      Page 0");
  eq(
    body
      ?.getValues()
      .map((str) => str.trim())
      .filter(Boolean),
    ["Heading", "Page 0"],
  );

  // string
  eq(title?.toString(), "<title>Untitled</title>");
  eq(h1?.toString(), `<h1 id="heading">\n    Heading\n  </h1>`);
});

test("ast: append, before, after", () => {
  const root = new Ast(raw);

  const body = root.find((n) => n.name === "body");
  const h1 = body?.find((n) => n.name === "h1");

  h1?.append({
    type: "element",
    name: "span",
    attributes: {},
    children: [
      {
        type: "text",
        value: "APPEND",
      },
    ],
  });

  h1?.before({
    type: "element",
    name: "span",
    attributes: {},
    children: [
      {
        type: "text",
        value: "BEFORE",
      },
    ],
  });

  h1?.after({
    type: "element",
    name: "span",
    attributes: {},
    children: [
      {
        type: "text",
        value: "AFTER",
      },
    ],
  });

  const before = h1?.getPrevSibling();
  const after = h1?.getNextSibling();
  const append = h1?.find((n) => n.name === "span");

  eq(before?.name, "span");
  eq(before?.getValue(), "BEFORE");

  eq(after?.name, "span");
  eq(after?.getValue(), "AFTER");

  eq(append?.name, "span");
  eq(append?.getValue(), "APPEND");
});

test("ast: remove", () => {
  const root = new Ast(raw);

  const body = root.find((n) => n.name === "body");
  const h1 = body?.find((n) => n.name === "h1");

  ok(!!h1);

  h1?.remove();

  const removedH1 = body?.find((n) => n.name === "h1");

  ok(!removedH1);
});

test("ast: ancestors", () => {
  const root = new Ast(raw);

  const body = root.find((n) => n.name === "body");
  const h1 = body?.find((n) => n.name === "h1");

  const ancestors = h1?.getAncestors();

  eq(ancestors?.length, 3); // body > html > root
  eq(
    ancestors?.map((n) => n.name || n.type),
    ["body", "html", "root"],
  );
});

test("ast: descendants", () => {
  const root = new Ast(raw);

  const body = root.find((n) => n.name === "body");

  const descendants = body?.getDescendants().filter((n) => n.type === "element");

  eq(descendants?.length, 7);
  eq(
    descendants?.map((n) => n.name),
    ["h1", "nav", "ol", "li", "a", "div", "img"],
  );
});

test("ast: void element", () => {
  const root = new Ast(raw);

  const img = root.find((n) => n.name === "img");

  ok(!!img);

  eq(img?.toString(), `<img src="this/is/path" />`);
  eq(img?.getAttribute("src"), `this/is/path`);
  eq(img?.getValue(), ``);
});
