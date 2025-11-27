import { describe, test } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import { DOMElem } from "./dom";

describe(path.basename(import.meta.filename), () => {

  const html = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta charset="utf-8" />
  <title>Untitled</title>
</head>
<body>
  <nav epub:type="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="0.xhtml">Page 0</a></li>
      <li><a href="1.xhtml">Page 1</a></li>
      <li>
        <h2>Inner1</h2>
        <ol>
          <li><a href="2.xhtml">Page 2</a></li>
          <li><a href="3.xhtml">Page 3</a></li>
          <li>
            <h3>Inner2</h3>
            <ol>
              <li><a href="4.xhtml">Page 4</a></li>
              <li><a href="5.xhtml">Page 5</a></li>
            </ol>
          </li>
          <li><a href="6.xhtml">Page 6</a></li>
          <li><a href="7.xhtml">Page 7</a></li>
        </ol>
      </li>
      <li><a href="8.xhtml">Page 8</a></li>
      <li><a href="9.xhtml">Page 9</a></li>
    </ol>
  </nav>
  <nav epub:type="landmarks">
    <h2>Landmarks</h2>
    <ol>
      <li><a href="0.xhtml">Page 0</a></li>
    </ol>
  </nav>
  <nav epub:type="page-list">
    <h2>Page List</h2>
    <ol>
      <li><a href="0.xhtml">Page 0</a></li>
    </ol>
  </nav>
</body>
</html>`;

  test("toString", () => {
    const root = new DOMElem(html);
    eq(html, root.toString());
    const root2 = new DOMElem(root.toString());
    eq(html, root2.toString());
  });

  test("tag with content", () => {
    const root = new DOMElem({
      type: "tag",
      tag: "div",
      content: "CONVERT TO TEXT",
    });

    eq("<div>CONVERT TO TEXT</div>", root.toString());
  });

});

function eq(a: any, b: any, msg?: string | Error) {
  return typeof a === "object"
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
}
