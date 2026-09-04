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

  root.replace();

  root.append(`<div>abc</div>`);
  root.append("abc"); // append text
  eq(root.toString(), "<div>abc</div>abc");
});

test("ast: append string", () => {
  const root = new Ast();

  root.append({
    type: "element",
    name: "div",
    attributes: {},
    children: ["<span>ab</span>", "cd"],
  });

  eq(root.toString(), "<div><span>ab</span>cd</div>");
});

test("ast: append empty string", () => {
  const root = new Ast();
  root.append("");
  eq(root.toString(), "");
  eq(root.children.length, 1);
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
  root.replace();
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
  eq(img?.isEmptyElement(), true);

  const empty = root.find((n) => n.attributes.id === "empty");

  ok(!!empty);
  eq(empty?.toString(), `<div id="empty"></div>`);
  eq(empty?.getText(), ``);
  eq(empty?.children.length, 0);
  eq(empty?.isEmptyElement(), true);
  eq(empty?.isSelfClosingElement(), false);
});

test("ast: toString", () => {
  const root = new Ast(`<div>abc</div>`);
  eq(root.toString(), "<div>abc</div>");
});

test("ast: parse attributes with spaces around equals", () => {
  const root = new Ast(`<div a = "1" b= "2" c ='3' d e = '' />`);
  const div = root.find((n) => n.name === "div");

  ok(!!div);
  eq(div?.toObject(), {
    type: "element",
    name: "div",
    isSelfClosing: true,
    attributes: {
      a: "1",
      b: "2",
      c: "3",
      d: true,
      e: "",
    },
    children: [],
  });
});

test("ast: parse self closing element without whitespace", () => {
  const root = new Ast(`<root><img src="path/to/image"/></root>`);
  const img = root.find((n) => n.name === "img");

  ok(!!img);
  eq(img?.getAttribute("src"), "path/to/image");
  eq(img?.isSelfClosingElement(), true);
  eq(img?.toString(), `<img src="path/to/image" />`);
});

test("ast: preserve empty element without self closing", () => {
  const root = new Ast(`<root><div></div></root>`);
  const div = root.find((n) => n.name === "div");

  ok(!!div);
  eq(div?.children.length, 0);
  eq(div?.isEmptyElement(), true);
  eq(div?.isSelfClosingElement(), false);
  eq(div?.toString(), `<div></div>`);
});

test("ast: parse doctype declaration without attributes", () => {
  const root = new Ast(`<!DOCTYPE html><root />`);
  const doctype = root.find((n) => n.type === "doctype");
  const element = root.find((n) => n.name === "root");

  ok(!!doctype);
  ok(!!element);
  eq(doctype?.value, "html");
  eq(doctype?.toString(), "<!DOCTYPE html>");
  eq(element?.toString(), "<root />");
});

test("ast: parse raw text element", () => {
  const root = new Ast(
    `<root><script>if (a < b) c();</script><style>.a>b{color:red;}</style></root>`,
  );
  const script = root.find((n) => n.name === "script");
  const style = root.find((n) => n.name === "style");

  ok(!!script);
  ok(!!style);
  eq(script?.getText(), "if (a < b) c();");
  eq(style?.getText(), ".a>b{color:red;}");
  eq(script?.toString(), `<script>if (a < b) c();</script>`);
  eq(style?.toString(), `<style>.a>b{color:red;}</style>`);
});

test("ast: raw text closing tag requires exact name", () => {
  const root = new Ast(`<root><script>abc</scriptx></root>`);
  const script = root.find((n) => n.name === "script");

  ok(!!script);
  eq(script?.getText(), "abc</scriptx></root>");
  eq(script?.children.length, 1);
});

test("ast: invalid empty tag falls back to text", () => {
  const root = new Ast(`<>`);
  eq(root.toString(), "<>");
  eq(root.children.length, 1);
  eq(root.children[0]?.type, "text");
});

test("ast: toObject", () => {
  const root = new Ast(`<div>abc</div>`);
  eq(root.toObject(), {
    type: "root",
    children: [
      {
        type: "element",
        name: "div",
        isSelfClosing: false,
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
