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

  /**
   * Get all parent elements from target to root
   */
  getParents(): Dom[] {
    const result: Dom[] = [];
    
    const fn = function (child: Dom) {
      if (!child.parent) {
        return;
      }

      result.push(child.parent);

      fn(child.parent);
    };

    fn(this);

    return result;
  }

  /**
   * Get all children regardless of depth
   */
  getChildren(): Dom[] {
    const result: Dom[] = [];

    const fn = function (parent: Dom) {
      for (const child of parent.children) {
        result.push(child);
        if (child.type === "tag") {
          fn(child);
        }
      }
    };

    fn(this);

    return result;
  }
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
  setContent(value: string): void { this.content = value; }
  hasContent(): boolean { return this.content !== ""; }

  getContents(): string[] {
    const result: string[] = [];

    for (const child of this.children) {
      if (child.type === "text") {
        result.push(child.content || "");
        continue;
      }
      
      if (child.type === "tag") {
        result.push(...child.getContents());
        continue;
      }
    }
    
    return result;
  }

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
    const parents = this.getParents();
    const root = parents.pop();
    return root && root.type === "root"
      ? root 
      : undefined;
  }

  getDepth(this: Dom): number {
    return this.getParents().length;
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
    callback: (child: Dom, index: number, children: Dom[]) => void
  ): void {
    this.getChildren().forEach(callback);
  }

  find(
    callback: (child: Dom, index: number, children: Dom[]) => any
  ): Dom | undefined {
    return this.getChildren().find(callback);
  }

  findLast(
    callback: (parent: Dom, index: number, parents: Dom[]) => any
  ): Dom | undefined {
    return this.getParents().find(callback);
  }

  filter(
    callback: (child: Dom, index: number, children: Dom[]) => any
  ): Dom[] {
    return this.getChildren().filter(callback);
  }

  map<T>(
    callback: (
      child: Dom,
      index: number,
      children: Dom[],
    ) => T
  ): T[] {
    return this.children.map<T>(callback);
  }

  reduce<T>(
    callback: (
      previousValue: T,
      currentValue: Dom,
      currentIndex: number,
      array: Dom[],
    ) => T,
    initialValue: T
  ): T {
    return this.children.reduce<T>(callback, initialValue);
  }

  reduceRight<T>(
    callback: (
      previousValue: T,
      currentValue: Dom,
      currentIndex: number,
      array: Dom[],
    ) => T,
    initialValue: T
  ): T {
    return this.children.reduceRight<T>(callback, initialValue);
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

  /**
   * Get html string
   */
  toString(): string {
    const { type, tag, closer, children } = this;

    if (type === "root") {
      return children.map((child) => child.toString()).join("");
    }

    if (type === "comment") {
      return `<!--${this.getContent()}-->`;
    }

    if (type === "text") {
      return this.getContent();
    }

    const attrs = stringifyAttrs(this.attributes);

    if (type === "script") {
      return `<script${attrs}>${this.getContent()}</script>`;
    }

    if (type === "style") {
      return `<style${attrs}>${this.getContent()}</style>`;
    }

    if (!tag) {
      throw new Error("This element must have a value of tag attribute");
    }

    // type === tag
    return this.hasCloser()
      ? `<${tag}${attrs}${closer}>`
      : `<${tag}${attrs}>${children.map((child) => child.toString()).join("")}</${tag}>`;
  }

  /**
   * Get children array contains this element
   */
  toArray(): Dom[] {
    return [this, ...this.getChildren()];
  }

  static parse = parseStr as typeof parseStr;
}