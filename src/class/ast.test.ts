import { deepStrictEqual as eq, ok } from "node:assert";
import { test } from "node:test";
import { Ast } from "./ast";

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
  <div id="empty"></div>
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
  eq(title?.getText(), "Untitled");
  eq(title?.getTexts(), ["Untitled"]);

  eq(body?.getText().trim(), "Heading\n  \n  \n    \n      Page 0");
  eq(
    body
      ?.getTexts()
      .map((str) => str.trim())
      .filter(Boolean),
    ["Heading", "Page 0"],
  );

  // string
  eq(title?.toString(), "<title>Untitled</title>");
  eq(h1?.toString(), `<h1 id="heading">\n    Heading\n  </h1>`);
});

test("ast: append", () => {
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

  h1?.append({
    type: "element",
    name: "img",
    attributes: { src: "this/is/path" },
    children: [],
  });

  const append = h1?.find((n) => n.name === "span");
  const voidElement = h1?.find((n) => n.name === "img");

  eq(append?.name, "span");
  eq(append?.getText(), "APPEND");

  eq(voidElement?.name, "img");
  eq(voidElement?.getAttribute("src"), "this/is/path");
  eq(voidElement?.children.length, 0);

  root.clear();

  root.append(`<div>abc</div>`);
  root.append("abc"); // append text
  eq(root.toString(), "<div>abc</div>abc");
});

test("ast: append string children", () => {
  const root = new Ast();

  root.append({
    type: "element",
    name: "div",
    attributes: {},
    children: ["<span>ab</span>", "cd"],
  });

  eq(root.toString(), "<div><span>ab</span>cd</div>");
});

test("ast: before", () => {
  const root = new Ast(raw);

  const body = root.find((n) => n.name === "body");
  const h1 = body?.find((n) => n.name === "h1");

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

  const before = h1?.getPrevSibling();

  eq(before?.name, "span");
  eq(before?.getText(), "BEFORE");
});

test("ast: after", () => {
  const root = new Ast(raw);

  const body = root.find((n) => n.name === "body");
  const h1 = body?.find((n) => n.name === "h1");

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

  const after = h1?.getNextSibling();

  eq(after?.name, "span");
  eq(after?.getText(), "AFTER");
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

test("ast: clear", () => {
  const root = new Ast(raw);
  root.clear();
  eq(root.toString(), "");
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

  eq(descendants?.length, 8);
  eq(
    descendants?.map((n) => n.name),
    ["h1", "nav", "ol", "li", "a", "div", "img", "div"],
  );
});

test("ast: void element", () => {
  const root = new Ast(raw);

  const img = root.find((n) => n.name === "img");

  ok(!!img);

  eq(img?.toString(), `<img src="this/is/path" />`);
  eq(img?.getAttribute("src"), `this/is/path`);
  eq(img?.getText(), ``);
  eq(img?.children.length, 0);
  eq(img?.isVoidElement(), true);

  const empty = root.find((n) => n.attributes.id === "empty");

  ok(!!empty);
  eq(empty?.toString(), `<div id="empty"></div>`);
  eq(empty?.getText(), ``);
  eq(empty?.children.length, 1);
  eq(empty?.isVoidElement(), false);
});

test("ast: toString", () => {
  const root = new Ast(`<div>abc</div>`);
  eq(root.toString(), "<div>abc</div>");
});

test("ast: toObject", () => {
  const root = new Ast(`<div>abc</div>`);
  eq(root.toObject(), {
    type: "root",
    children: [
      {
        type: "element",
        name: "div",
        attributes: {},
        children: [
          {
            type: "text",
            value: "abc",
          },
        ],
      },
    ],
  });
});
