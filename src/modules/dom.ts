export type DomType = "root" | "tag" | "text" | "comment" | "script" | "style";
export type DomAttrs = Record<string, string | null | undefined>;
export type DomImpl = {
  parent?: DomImpl;
  type: DomType;
  tag?: string;
  closer?: string;
  content?: string;
  attributes?: DomAttrs;
  children?: DomImpl[];
}

type Stack = {
  isClosed: boolean;
  parent?: DomImpl;
  type: DomType;
  tag?: string;
  closer?: string;
  content?: string;
  attributes?: DomAttrs;
  children?: DomImpl[];
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

    // Find "<"
    if (!head) {
      if (ch === "<") {
        flush();
        buffer += ch;
        head = true;
      } else {
        buffer += ch;
      }
    } // Find ">"
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

          // If tail does exists and buffer does not close with tail, do not stop accumulate
          if (tail) {
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
      } // End of quotes
      else if (ch === quotes) {
        buffer += ch;
        quotes = null;
      } // In quotes
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
    i = isClosing ? 2 : 1, // Skip "</"
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

  // Find tag name
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

  // Find attributes
  while (i < str.length) {
    const ch = str[i];

    if (ch === "\\") {
      buffer += ch;
    } else if (!quotes) {
      if (ch === ">") {
        if (buffer === "/" || buffer === "?") {
          closer = /\s/.test(str[i - 2])
            ? " " + buffer // With space
            : buffer;
        } else {
          flush();
        }
        break; // End task
      } else if (ch === " " || ch === "\n") {
        flush();
      } else if (ch === `"` || ch === `'`) {
        quotes = ch;
        buffer += ch;
      } else {
        buffer += ch;
      }
    } // End of quotes
    else if (ch === quotes) {
      quotes = null;
      buffer += ch;
      flush();
    } // In quotes
    else {
      buffer += ch;
    }
    i++;
  }

  const attributes: DomAttrs = {};

  for (const part of parts) {
    const [key, ...values] = part.split("=");
    if (values.length === 0) {
      attributes[key] = null;
    } else {
      let value = values.join("=");
      // Remove quotes
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

  const root = stacks[0] as Stack & { children: DomImpl[], };
  const parts = splitTags(str);

  for (const part of parts) {

    // Text
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

    // XML declaration or XML prolog
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

    // Comment
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

    // Script
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

    // Style
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

    // Tags
    const { tag, isClosing, closer, attributes } = parseTag(part);

    if (isClosing) {
      const children: DomImpl[] = [];
      for (let i = stacks.length - 1; i >= 0; i--) {
        const stack = stacks[i];

        if (!stack.isClosed) {
          stack.isClosed = true;

          if (stack.tag === tag) {
            stack.children = children.reverse();

            // Set children parent
            for (const child of children) {
              child.parent = stack;
            }
            
            break;
          }

          // Close self-closing tag
          stack.closer = "";
        }

        // Current element included in same parent
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
    // Add root children
    if (stack.type !== "root" && !stack.parent) {
      stack.parent = root;
      root.children.push(stack);
    }

    // Set closer to self-closing tag
    if (stack.type === "tag" && !stack.isClosed) {
      stack.closer = "";
    }

    // @ts-expect-error: Remove unused property
    delete stack.isClosed;

    // @ts-expect-error: Remove unused property
    delete stack.depth;
  }

  // @ts-expect-error: Remove unused property
  delete root.isClosed;

  // @ts-expect-error: Remove unused property
  delete root.depth;

  return root as {
    type: "root",
    children: DomImpl[],
  };
}

function stringifyAttrs(attrs: DomAttrs) {
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

export const parseDom = (src: string | DomImpl | Dom, parent?: Dom): Dom => new Dom(src, parent);

export class Dom implements DomImpl {
  parent?: Dom;
  type: DomType;
  tag: string;
  closer?: string;
  content: string;
  attributes: DomAttrs;
  children: Dom[];

  constructor(src?: string | DomImpl | Dom, parent?: Dom) {
    this.type = "root";
    this.tag = "";
    this.content = "";
    this.attributes = {};
    this.children = [];
    if (src) {
      this.init(src, parent);
    }
  }

  init(src: string | DomImpl | Dom, parent?: Dom): void {
    if (typeof src === "string") {
      const { children } = Dom.parse(src);
      this.children = children.map((child) => new Dom(child, this));
    } else {
      this.parent = parent;
      this.type = src.type;
      this.tag = src.tag || "";
      this.closer = src.closer;
      this.content = src.content || "";
      this.attributes = src.attributes || {};

      // Tag with content
      if (this.type === "tag" && this.content.length > 0) {
        this.children = [
          new Dom({
            type: "text",
            tag: "",
            content: src.content,
            attributes: {},
            children: [],
          }, this)
        ];
      } // Tag with children
      else if (src.children) {
        this.children = src.children.map((child) => new Dom(child, this));
      }
    }
  }

  createChildren(args: (string | DomImpl | Dom)[]): Dom[] {
    const result: Dom[] = [];

    for (const arg of args) {
      if (typeof arg === "string") {
        const { children } = Dom.parse(arg);
        result.push(...children.map((child) => new Dom(child, this)));
      } else if (arg.type === "root") {
        result.push(...(new Dom(arg, this)).children);
      } else {
        result.push(new Dom(arg, this));
      }
    }

    return result;
  }

  isRoot(): boolean { return this.type === "root"; }
  isComment(): boolean { return this.type === "comment"; }
  isStyle(): boolean { return this.type === "style"; }
  isScript(): boolean { return this.type === "script"; }
  isText(): boolean { return this.type === "text"; }
  isTag(): boolean { return this.type === "tag"; }

  getParent(): Dom | undefined { return this.parent; }
  hasParent(): boolean { return !!this.parent; }

  getChildren(): Dom[] { return this.children; }
  hasChildren(): boolean { return this.children.length > 1; }

  getSiblings(): Dom[] { return (this.parent?.children || []).filter((sibling) => sibling != this); }
  hasSiblings(): boolean { return (this.parent?.children || []).length > 1; }

  getTag(): string { return this.tag; }
  setTag(value: string): void { this.tag = value; }
  hasTag(): boolean { return this.tag !== ""; }
  
  getCloser(): string | undefined { return this.closer; }
  setCloser(value: string | null | undefined): void {
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
  setContent(value: string): void { this.content = value; }
  hasContent(): boolean { return this.content !== ""; }

  getAttribute(key: string): string | null | undefined { return this.attributes[key]; }
  setAttribute(key: string, value: string | null | undefined): void { this.attributes[key] = value; }
  hasAttribute(key: string): boolean { return typeof this.attributes[key] !== "undefined"; }

  getAttributes(): DomAttrs { return this.attributes; }
  setAttributes(attrs: DomAttrs): void { Object.keys(attrs).forEach((k) => this.setAttribute(k, attrs[k])); };
  hasAttributes(attrs: DomAttrs): boolean {
    for (const k of Object.keys(attrs)) {
      if (this.getAttribute(k) !== attrs[k]) {
        return false;
      }
    }
    return true;
  }

  getRoot(this: Dom): Dom | undefined {
    if (this.type === "root") {
      return this;
    }

    let parent = this.parent;
    
    while(parent) {
      if (parent.type === "root") {
        return parent;
      }

      parent = parent.parent;
    }
  }

  getDepth(this: Dom): number {
    if (!this.parent) {
      return 0;
    }

    let parent: Dom | undefined = this.parent;
    let depth = 0;

    while(parent) {
      depth++;
      parent = parent.parent;
    }

    return depth;
  }

  append(...args: (string | DomImpl | Dom)[]): void {
    const newChildren = this.createChildren(args);
    for (const el of newChildren) {
      this.children.push(el);
    }
  }

  prepend(...args: (string | DomImpl | Dom)[]): void {
    const newChildren = this.createChildren(args);
    this.children.splice(0, 0, ...newChildren);
  }

  before(...args: (string | DomImpl | Dom)[]): void {
    if (!this.parent) {
      throw new Error("Parent not found");
    }

    const index = this.parent.children.findIndex((child) => child == this);
    if (index === -1) {
      throw new Error("This element not included in it's parent");
    }
    
    const newSiblings = this.parent.createChildren(args);
    this.parent.children.splice(index, 0, ...newSiblings);
  }

  after(...args: (string | DomImpl | Dom)[]): void {
    if (!this.parent) {
      throw new Error("Parent not found");
    }

    const index = this.parent.children.findIndex((child) => child == this);
    if (index === -1) {
      throw new Error("This element not included in its parent");
    }

    const newSiblings = this.parent.createChildren(args);
    this.parent.children.splice(index + 1, 0, ...newSiblings);
  }

  forEach(
    callback: (child: Dom, index: number, depth: number) => void
  ): void {
    let index = 0;

    const func = function (parent: Dom, depth: number) {
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
    callback: (child: Dom, index: number, depth: number) => any
  ): Dom | undefined {
    let index = 0;

    const func = function (parent: Dom, depth: number): Dom | undefined {
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
    callback: (parent: Dom, index: number, depth: number) => any
  ): Dom | undefined {
    let index = 0;

    const func = function (child: Dom, depth: number): Dom | undefined {
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
    callback: (child: Dom, index: number, depth: number) => any
  ): Dom[] {
    const result: Dom[] = [];

    let index = 0;

    const func = function (parent: Dom, depth: number) {
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
      child: Dom,
      index: number,
      depth: number,
    ) => T
  ): T[] {
    const result: T[] = [];
    let index = 0;

    const func = function (parent: Dom, depth: number) {
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
      child: Dom,
      index: number,
      depth: number,
    ) => T,
    initialValue: T
  ): T {
    let result = initialValue,
        index = 0;

    const func = function (parent: Dom, depth: number) {
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

  remove(): void {
    this.parent?.removeChild(this);
  }

  removeChild(arg: Dom): void {
    this.removeChildren(arg);
  }

  removeChildren(...args: Dom[]): void {
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

  toArray(): Dom[] {
    return [this, ...this.map((child) => child)];
  }

  static parse = parseStr as typeof parseStr;
}