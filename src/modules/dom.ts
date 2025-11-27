
export type DOMElemType = "root" | "tag" | "text" | "comment" | "script" | "style";
export type DOMElemAttrs = Record<string, string | null | undefined>;
export type DOMElemImpl = {
  parent?: DOMElemImpl;
  type: DOMElemType;
  tag?: string;
  closer?: string;
  content?: string;
  attributes?: DOMElemAttrs;
  children?: DOMElemImpl[];
}

type Stack = {
  isClosed: boolean;
  parent?: DOMElemImpl;
  type: DOMElemType;
  tag?: string;
  closer?: string;
  content?: string;
  attributes?: DOMElemAttrs;
  children?: DOMElemImpl[];
}

function splitTags(str: string) {
  const result: string[] = [];

  let i = 0,
      buffer = "",
      head = false,
      tail: string | null = null,
      quotes: string | null = null;

  const flush = () => {
    if (buffer !== "") {
      result.push(buffer);
      buffer = "";
    }
  }

  const join = () => {
    if (buffer !== "") {
      if (result.length > 0) {
        result[result.length - 1] += buffer;
      } else {
        result.push(buffer);
      }
      buffer = "";
    }
  }

  while(i < str.length) {
    const ch = str[i];

    // find opening bracket: "<"
    if (!head) {
      if (ch === "<") {
        flush();
        buffer += ch;
        head = true;
      } else {
        buffer += ch;
      }
    } // find closing bracket: ">"
    else {
      if (ch === "\\") {
        buffer += ch;
      } else if (!quotes) {
        if (ch === "<") {
          if (!tail) {
            join();
          }

          buffer += ch;
        } else if (ch === ">") {
          buffer += ch;

          if (tail) {
            // do not stop accumulate
            if (!buffer.endsWith(tail)) {
              i++;
              continue;
            }
          }

          flush();
          head = false;
          tail = null;
        } else if (tail) {
          buffer += ch;
        } else {
          buffer += ch;

          if (ch === `"` || ch === `'`) {
            quotes = ch;
          } else if (buffer === "<!--") {
            tail = "-->"
          } else if (buffer === "<script") {
            tail = "</script>";
          } else if (buffer === "<style") {
            tail = "</style>";
          }
        }
      } // end of quotes
      else if (ch === quotes) {
        buffer += ch;
        quotes = null;
      } // in quotes
      else {
        buffer += ch;
      }
    }

    i++;
  }

  flush();

  return result;
}

function parseTag(str: string) {
  const parts: string[] = [];

  let isClosing = str[1] === "/",
    i = isClosing ? 2 : 1, // pass "</"
    tag = "",
    buffer = "",
    quotes: string | null = null,
    closer: string | undefined;

  const flush = function () {
    if (buffer !== "") {
      parts.push(buffer);
      buffer = "";
    }
  };

  const re = /\s|>|\//;

  // find tag name
  while (i < str.length) {
    const ch = str[i];

    if (re.test(ch)) {
      break;
    }

    buffer += ch;
    i++;
  }

  tag = buffer;
  buffer = "";

  // find attributes
  while (i < str.length) {
    const ch = str[i];

    if (ch === "\\") {
      buffer += ch;
    } else if (!quotes) {
      if (ch === ">") {
        if (buffer === "/" || buffer === "?") {
          closer = /\s/.test(str[i - 2])
            ? " " + buffer // with space
            : buffer;
        } else {
          flush();
        }
        break; // end task
      } else if (ch === " " || ch === "\n") {
        flush();
      } else if (ch === `"` || ch === `'`) {
        quotes = ch;
        buffer += ch;
      } else {
        buffer += ch;
      }
    } // end of quotes
    else if (ch === quotes) {
      quotes = null;
      buffer += ch;
      flush();
    } // in quotes
    else {
      buffer += ch;
    }
    i++;
  }

  const attributes: DOMElemAttrs = {};

  for (const part of parts) {
    const [key, ...values] = part.split("=");
    if (values.length === 0) {
      attributes[key] = null;
    } else {
      let value = values.join("=");
      // remove quotes
      attributes[key] = value.substring(1, value.length - 1);
    }
  }

  const endIndex = i + 1;

  return {
    endIndex,
    isClosing,
    tag,
    closer,
    attributes,
  }
}

function parseStr(str: string) {
  const stacks: Stack[] = [
    {
      isClosed: false,
      type: "root",
      children: [],
    }
  ];

  const root = stacks[0] as Stack & { children: DOMElemImpl[], };
  const parts = splitTags(str);

  for (const part of parts) {

    // text
    const isTag = part.startsWith("<") && part.endsWith(">");
    if (!isTag) {
      stacks.push({
        isClosed: true,
        type: "text",
        tag: "",
        content: part,
        attributes: {},
        children: [],
      });
      continue;
    }

    // xml declaration, xml prolog
    const isXMLDeclaration = part.startsWith("<?xml") && part.endsWith("?>");
    if (isXMLDeclaration) {
      const { attributes } = parseTag(part);
      stacks.push({
        isClosed: true,
        type: "tag",
        tag: "?xml",
        closer: "?",
        content: "",
        attributes,
        children: [],
      });
      continue;
    }

    // comment
    const isComment = part.startsWith("<!--") && part.endsWith("-->");
    if (isComment) {
      stacks.push({
        isClosed: true,
        type: "comment",
        tag: "",
        content: part.substring(4, part.length - 3),
        attributes: {},
        children: [],
      });
      continue;
    }

    // script
    const isScript = part.startsWith("<script") && part.endsWith("</script>");
    if (isScript) {
      const { endIndex, attributes } = parseTag(part);
      const content = part.substring(endIndex, part.length - 9);
      stacks.push({
        isClosed: true,
        type: "script",
        tag: "script",
        content,
        attributes,
        children: [],
      });
      continue;
    }

    // style
    const isStyle = part.startsWith("<style") && part.endsWith("</style>");
    if (isStyle) {
      const { endIndex, attributes } = parseTag(part);
      const content = part.substring(endIndex, part.length - 8); // "</style>"
      stacks.push({
        isClosed: false,
        type: "style",
        tag: "style",
        content,
        attributes,
        children: [],
      });
      continue;
    }

    // tags
    const { tag, isClosing, closer, attributes } = parseTag(part);

    if (isClosing) {
      const children: DOMElemImpl[] = [];
      for (let i = stacks.length - 1; i >= 0; i--) {
        const stack = stacks[i];

        if (!stack.isClosed) {
          stack.isClosed = true;

          if (stack.tag === tag) {
            stack.children = children.reverse();

            // set children parent
            for (const child of children) {
              child.parent = stack;
            }
            
            break;
          }

          // close self-closing tag
          stack.closer = "";
        }

        // current element included in same parent
        if (!stack.parent) {
          children.push(stack);
        }
      }

      continue;
    }

    const isClosed = typeof closer === "string";

    stacks.push({
      isClosed,
      type: "tag",
      tag,
      content: "",
      closer,
      attributes,
      children: [],
    });
  }

  for (const stack of stacks) {
    // add root children
    if (stack.type !== "root" && !stack.parent) {
      stack.parent = root;
      root.children.push(stack);
    }

    // set closer to self-closing tag
    if (stack.type === "tag" && !stack.isClosed) {
      stack.closer = "";
    }

    // @ts-expect-error: remove unused property
    delete stack.isClosed;

    // @ts-expect-error: remove unused property
    delete stack.depth;
  }

  // @ts-expect-error: remove unused property
  delete root.isClosed;

  // @ts-expect-error: remove unused property
  delete root.depth;

  // return stacks[0] as RootElement;
  return root as {
    type: "root",
    children: DOMElemImpl[],
  };
}

function stringifyAttrs(attrs: DOMElemAttrs) {
  let result = "";

  // "undefined" will be skip
  // "null" is empty attribute (e.g., <div hidden>...</div>)
  for (const k of Object.keys(attrs)) {
    const v = attrs[k];
    if (typeof v === "string") {
      result += ` ${k}="${v}"`;
    } else if (v === null) {
      result += ` ${k}`;
    } 
  }
  
  return result;
}

export const parseDOM = (arg: string | DOMElemImpl | DOMElem, parent?: DOMElem) => new DOMElem(arg, parent);

export class DOMElem implements DOMElemImpl {
  parent?: DOMElem;
  type: DOMElemType;
  tag: string;
  closer?: string;
  content: string;
  attributes: DOMElemAttrs;
  children: DOMElem[];

  constructor(src?: string | DOMElemImpl | DOMElem, parent?: DOMElem) {
    this.type = "root";
    this.tag = "";
    this.content = "";
    this.attributes = {};
    this.children = [];
    if (src) {
      this.init(src, parent);
    }
  }

  init(src: string | DOMElemImpl | DOMElem, parent?: DOMElem) {
    if (typeof src === "string") {
      const { children } = DOMElem.parse(src);
      this.children = children.map((child) => new DOMElem(child, this));
    } else {
      this.parent = parent;
      this.type = src.type;
      this.tag = src.tag || "";
      this.closer = src.closer;
      this.content = src.content || "";
      this.attributes = src.attributes || {};

      // tag with content
      if (this.type === "tag" && this.content.length > 0) {
        this.children = [
          new DOMElem({
            type: "text",
            tag: "",
            content: src.content,
            attributes: {},
            children: [],
          }, this)
        ];
      } // with children
      else if (src.children) {
        this.children = src.children.map((child) => new DOMElem(child, this));
      }
    }
  }

  createChildren(args: (string | DOMElemImpl | DOMElem)[]) {
    const result: DOMElem[] = [];
    for (const arg of args) {
      if (typeof arg === "string") {
        const { children } = DOMElem.parse(arg);
        result.push(...children.map((child) => new DOMElem(child, this)));
      } else if (arg.type === "root") {
        result.push(...(new DOMElem(arg, this)).children);
      } else {
        result.push(new DOMElem(arg, this));
      }
    }
    return result;
  }

  isRoot() { return this.type === "root"; }
  isComment() { return this.type === "comment"; }
  isStyle() { return this.type === "style"; }
  isScript() { return this.type === "script"; }
  isText() { return this.type === "text"; }
  isTag() { return this.type === "tag"; }

  getParent() { return this.parent; }
  hasParent() { return !!this.parent; }

  getChildren() { return this.children; }
  hasChildren() { return this.children.length > 1; }

  getSiblings() { return (this.parent?.children || []).filter((sibling) => sibling != this); }
  hasSiblings() { return (this.parent?.children || []).length > 1; }

  getTag() { return this.tag; }
  setTag(value: string) { this.tag = value; }
  hasTag(): boolean { return this.tag !== ""; }
  
  getCloser() { return this.closer; }
  setCloser(value: string | null | undefined) {
    if (typeof value === "string") {
      this.closer = value;
    } else {
      delete this.closer;
    }
  }
  hasCloser(): boolean { return typeof this.closer === "string"; }

  getContent(): string { return this.content || ""; }
  getContents(): string[] {
    const result: string[] = [];
    for (const child of this.children) {
      switch(child.type) {
        case "text": result.push(child.content || ""); break;
        case "tag": result.push(...child.getContents()); break;
      }
    }
    return result;
  }
  setContent(value: string) { this.content = value; }
  hasContent(): boolean { return this.content !== ""; }

  getAttribute(key: string): string | null | undefined { return this.attributes[key]; }
  setAttribute(key: string, value: string | null | undefined) { this.attributes[key] = value; }
  hasAttribute(key: string) { return typeof this.attributes[key] !== "undefined"; }

  getAttributes(): DOMElemAttrs { return this.attributes; }
  setAttributes(attrs: DOMElemAttrs) { Object.keys(attrs).forEach((k) => this.setAttribute(k, attrs[k])); };
  hasAttributes(attrs: DOMElemAttrs): boolean {
    for (const k of Object.keys(attrs)) {
      if (this.getAttribute(k) !== attrs[k]) {
        return false;
      }
    }
    return true;
  }

  getRoot(this: DOMElem) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let root: DOMElem = this;
    while(root.parent) {
      root = root.parent;
    }
    return root;
  }

  getDepth(this: DOMElem) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let el: DOMElem = this,
        depth = 0;
    while(el.parent) {
      el = el.parent;
      depth++;
    }
    return depth;
  }

  append(...args: (string | DOMElemImpl | DOMElem)[]) {
    const newChildren = this.createChildren(args);
    for (const el of newChildren) {
      this.children.push(el);
    }
  }

  prepend(...args: (string | DOMElemImpl | DOMElem)[]) {
    const newChildren = this.createChildren(args);
    this.children.splice(0, 0, ...newChildren);
  }

  before(...args: (string | DOMElemImpl | DOMElem)[]) {
    if (!this.parent) {
      throw new Error("Parent not found");
    }

    const index = this.parent.children.findIndex((child) => child == this);
    if (index === -1) {
      throw new Error("This element not included in its parent");
    }
    
    const newChildren = this.parent.createChildren(args);
    this.parent.children.splice(index, 0, ...newChildren);
  }

  after(...args: (string | DOMElemImpl | DOMElem)[]) {
    if (!this.parent) {
      throw new Error("Parent not found");
    }

    const index = this.parent.children.findIndex((child) => child == this);
    if (index === -1) {
      throw new Error("This element not included in its parent");
    }

    const newChildren = this.parent.createChildren(args);
    this.parent.children.splice(index + 1, 0, ...newChildren);
  }

  forEach(
    callback: (child: DOMElem, index: number, depth: number) => void
  ): void {
    let index = 0;

    const func = function (parent: DOMElem, depth: number) {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        callback(child, index++, depth);
        if (child.type === "tag") {
          func(child, depth + 1);
        }
      }
    };

    func(this, 1);
  }

  find(
    callback: (child: DOMElem, index: number, depth: number) => any
  ): DOMElem | undefined {
    let index = 0;

    const func = function (parent: DOMElem, depth: number): DOMElem | undefined {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (callback(child, index++, depth)) {
          return child;
        }
        if (child.type === "tag") {
          const grandchild = func(child, depth + 1);
          if (grandchild) {
            return grandchild;
          }
        }
      }
    };

    return func(this, 1);
  }

  findLast(
    callback: (parent: DOMElem, index: number, depth: number) => any
  ): DOMElem | undefined {
    let index = 0;

    const func = function (child: DOMElem, depth: number): DOMElem | undefined {
      if (child.parent) {
        if (callback(child.parent, index++, depth)) {
          return child.parent;
        }
        func(child.parent, depth + 1);
      }
    };

    return func(this, 1);
  }

  filter(
    callback: (child: DOMElem, index: number, depth: number) => any
  ) {
    const result: DOMElem[] = [];

    let index = 0;

    const func = function (parent: DOMElem, depth: number) {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (callback(child, index++, depth)) {
          result.push(child);
        }
        if (child.type === "tag") {
          func(child, depth + 1);
        }
      }
    };

    func(this, 1);

    return result;
  }

  map<T>(
    callback: (
      child: DOMElem,
      index: number,
      depth: number,
    ) => T
  ) {
    const result: T[] = [];
    let index = 0;

    const func = function (parent: DOMElem, depth: number) {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        result.push(callback(child, index++, depth));
        if (child.type === "tag") {
          func(child, depth + 1);
        }
      }
    };

    func(this, 1);

    return result;
  }

  reduce<T>(
    callback: (
      accumulator: T,
      child: DOMElem,
      index: number,
      depth: number,
    ) => T,
    initialValue: T
  ) {
    let result = initialValue,
        index = 0;

    const func = function (parent: DOMElem, depth: number) {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        result = callback(result, child, index++, depth);
        if (child.type === "tag") {
          func(child, depth + 1);
        }
      }
    };

    func(this, 1);

    return result;
  }

  remove() {
    this.parent?.removeChild(this);
  }

  removeChild(arg: DOMElem) {
    this.removeChildren(arg);
  }

  removeChildren(...args: DOMElem[]) {
    const set = new Set(args);

    this.children = this.children.filter((child) => {
      if (set.has(child)) {
        delete child.parent;
        return false;
      } else {
        return true;
      }
    });
  }

  toString(): string {
    const { type, tag, closer, children } = this;

    switch(type) {
      case "root": return children.map((child) => child.toString()).join("");
      case "comment": return `<!--${this.getContent()}-->`;
      case "text": return this.getContent();
    }

    if (!tag) {
      throw new Error("DOMElem must have a value of tag attribute");
    }

    const attrs = stringifyAttrs(this.attributes);

    switch(type) {
      case "script": return `<script${attrs}>${this.getContent()}</script>`;
      case "style": return `<style${attrs}>${this.getContent()}</style>`;
      case "tag": return this.hasCloser()
        ? `<${tag}${attrs}${closer}>`
        : `<${tag}${attrs}>${children.map((child) => child.toString()).join("")}</${tag}>`;
    }
  }

  toArray() {
    return [this, ...this.map((child) => child)];
  }

  static parse = parseStr;
}