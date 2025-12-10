import { describe, test } from "node:test";
import { deepStrictEqual as eq, notDeepEqual as neq, throws, doesNotThrow, rejects, doesNotReject } from "node:assert";
import { Dom } from "./dom";

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

const html2 = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta charset="utf-8" />
  <title>Untitled</title>
</head>
<body>
</body>
</html>`;

test("new Dom(): Parse HTML string", () => {
  const root = new Dom(html);
  eq(root.toString(), html);
  const root2 = new Dom(root.toString());
  eq(root2.toString(), html);
});

test("new Dom(): Parse object", () => {
  const root = new Dom({
    type: "tag",
    tag: "div",
    content: "CONVERT TO TEXT",
  });

  eq(root.toString(), "<div>CONVERT TO TEXT</div>");
});

test("new Dom().getContents()", () => {
  const root = new Dom(
`
<div>
  Level 1
  <div>
    Level 2
    <div>
      Level 3
    </div>
  </div>  
</div>
`
  );

  eq(
    root.getContents().map((c) => c.trim()).join(""),
    `Level 1Level 2Level 3`
  );
});

test("new Dom().remove()", () => {
  const root = new Dom(html2);

  root.find((c) => c.tag === "title")?.remove();

  eq(
    root.toString(),
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta charset="utf-8" />
  
</head>
<body>
</body>
</html>`
  );
});