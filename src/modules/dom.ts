export type DOMType = "root" | "tag" | "text" | "comment" | "script" | "style";

export type IDOMElement = {
  parent?: IDOMElement;
  type: DOMType;
  tag?: string;
  closer?: string;
  content?: string;
  attributes: Record<string, string | null>;
  children: IDOMElement[];
}

type Stack = IDOMElement & {
  isClosed: boolean;
  depth: number;
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
          closer = buffer;
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

  const attributes: Record<string, string | null> = {};

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

export class DOMElement implements IDOMElement {
  parent?: DOMElement;
  type: DOMType;
  tag?: string;
  closer?: string;
  content?: string;
  attributes: Record<string, string | null>;
  children: DOMElement[];

  constructor(src?: string | IDOMElement | DOMElement, parent?: DOMElement) {
    this.type = "root";
    this.attributes = {};
    this.children = [];
    if (src) {
      this.init(src, parent);
    }
  }

  init(src: string | IDOMElement | DOMElement, parent?: DOMElement) {
    if (typeof src === "string") {
      const { children } = DOMElement.parse(src);
      this.children = children.map((child) => new DOMElement(child, this));
    } else {
      this.parent = parent;
      this.type = src.type;
      this.tag = src.tag;
      this.closer = src.closer;
      this.content = src.content;
      this.attributes = src.attributes;
      this.children = src.children.map((child) => new DOMElement(child, this));
    }
  }

  createChildren(args: (string | IDOMElement | DOMElement)[]) {
    const result: DOMElement[] = [];
    for (const arg of args) {
      if (typeof arg === "string") {
        const { children } = DOMElement.parse(arg);
        result.push(...children.map((child) => new DOMElement(child, this)));
      } else if (arg.type === "root") {
        result.push(...(new DOMElement(arg, this)).children);
      } else {
        result.push(new DOMElement(arg, this));
      }
    }
    return result;
  }

  isSelfClosed() { return typeof this.closer === "string"; }
  isRoot() { return this.type === "root"; }
  isComment() { return this.type === "comment"; }
  isStyle() { return this.type === "style"; }
  isScript() { return this.type === "script"; }
  isText() { return this.type === "text"; }
  isTag() { return this.type === "tag"; }

  getRoot() {
    let root: DOMElement = this;
    while(root.parent) {
      root = root.parent;
    }
    return root;
  }

  getDepth() {
    let el: DOMElement = this,
        depth = 0;
    while(el.parent) {
      el = el.parent;
      depth++;
    }
    return depth;
  }

  getIndex() {

  }

  getId() { return this.attributes.id || ""; }
  getClass() { return this.attributes.class || ""; }
  getClasses() { return this.attributes.class?.split(" ").filter(Boolean) || []; }
  getContent() { return this.content || ""; }

  getAttributes() {
    const result: string[] = [];
    for (const k of Object.keys(this.attributes)) {
      const v = this.attributes[k];
      if (typeof v === "string") {
        result.push(`${k}="${v}"`);
      } else if (v === null) {
        result.push(k);
      }
    }
    return result;
  }
 
  append(...args: (string | IDOMElement | DOMElement)[]) {
    const elements = this.createChildren(args);
    for (const el of elements) {
      this.children.push(el);
    }
  }

  prepend(...args: (string | IDOMElement | DOMElement)[]) {
    const elements = this.createChildren(args);
    this.children.splice(0, 0, ...elements);
  }

  before(...args: (string | IDOMElement | DOMElement)[]) {
    if (!this.parent) {
      throw new Error("Parent not found");
    }

    const index = this.parent.children.findIndex((child) => child == this);
    if (index === -1) {
      throw new Error("This element not included in its parent");
    }
    
    const elements = this.parent.createChildren(args);
    this.parent.children.splice(index, 0, ...elements);
  }

  after(...args: (string | IDOMElement | DOMElement)[]) {
    if (!this.parent) {
      throw new Error("Parent not found");
    }

    const index = this.parent.children.findIndex((child) => child == this);
    if (index === -1) {
      throw new Error("This element not included in its parent");
    }

    const elements = this.parent.createChildren(args);
    this.parent.children.splice(index + 1, 0, ...elements);
  }

  forEach(
    callback: (child: DOMElement, index: number, depth: number) => void
  ): void {
    let index = 0;

    const func = function (parent: DOMElement, depth: number) {
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
    callback: (child: DOMElement, index: number, depth: number) => any
  ): DOMElement | undefined {
    let index = 0;

    const func = function (parent: DOMElement, depth: number): DOMElement | undefined {
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
    callback: (parent: DOMElement, index: number, depth: number) => any
  ): DOMElement | undefined {
    let index = 0;

    const func = function (child: DOMElement, depth: number): DOMElement | undefined {
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
    callback: (child: DOMElement, index: number, depth: number) => any
  ) {
    const result: DOMElement[] = [];

    let index = 0;

    const func = function (parent: DOMElement, depth: number) {
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
      child: DOMElement,
      index: number,
      depth: number,
    ) => T
  ) {
    const result: T[] = [];
    let index = 0;

    const func = function (parent: DOMElement, depth: number) {
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
      child: DOMElement,
      index: number,
      depth: number,
    ) => T,
    initialValue: T
  ) {
    let result = initialValue,
        index = 0;

    const func = function (parent: DOMElement, depth: number) {
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

  toContents() {
    return this
      .filter((child) => child.type === "text")
      .map((child) => child.getContent());
  }

  toString(): string {
    switch(this.type) {
      case "root": return this.children.map((child) => child.toString()).join("");
      case "comment": return `<!--${this.getContent()}-->`;
      case "text": return this.getContent();
    }

    if (!this.tag) {
      throw new Error("Element must have a value of tag attribute");
    }

    let attrs = this.getAttributes().join(" ");
    if (attrs) {
      attrs = " " + attrs;
    }

    switch(this.type) {
      case "script": return `<script${attrs}>${this.getContent()}</script>`;
      case "style": return `<style${attrs}>${this.getContent()}</style>`;
      case "tag": return this.isSelfClosed()
        ? `<${this.tag}${attrs} ${this.closer}>`
        : `<${this.tag}${attrs}>${this.children.map((child) => child.toString()).join("")}</${this.tag}>`;
    }
  }

  toArray() {
    return [this, ...this.map((child) => child)];
  }

  static parse = function(str: string) {
    const stacks: Stack[] = [
      {
        isClosed: false,
        depth: 0,
        type: "root",
        attributes: {},
        children: [],
      }
    ];

    const root = stacks[0];
    const parts = splitTags(str);
    let depth = 1;

    for (const part of parts) {

      // text
      const isTag = part.startsWith("<") && part.endsWith(">");
      if (!isTag) {
        stacks.push({
          isClosed: true,
          depth,
          type: "text",
          content: part,
          attributes: {},
          children: [],
        });
        continue;
      }

      // comment
      const isComment = part.startsWith("<!--") && part.endsWith("-->");
      if (isComment) {
        stacks.push({
          isClosed: true,
          depth,
          type: "comment",
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
          depth,
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
          depth,
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
        const children: IDOMElement[] = [];
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
            if (stack.type === "tag") {
              stack.closer = "";
            }
          }

          // current element included in same parent
          if (stack.depth === depth) {
            children.push(stack);
          }
        }

        depth--;

        continue;
      }

      const isClosed = typeof closer === "string";

      stacks.push({
        isClosed,
        depth,
        type: "tag",
        tag,
        closer,
        attributes,
        children: [],
      });

      if (!isClosed) {
        depth++;
      }
    }

    for (const stack of stacks) {
      // add root children
      if (stack.depth === 1) {
        stack.parent = root;
        root.children.push(stack);
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
    return root as IDOMElement;
  };

}