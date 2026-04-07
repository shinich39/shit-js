export type AstNode =
  | { type: "root"; children: AstNode[] }
  | { type: "text"; value: string }
  | { type: "element"; name: string; attributes: AstAttributes; children: AstNode[] }
  | { type: "comment"; value: string }
  | { type: "doctype"; value: string }
  | { type: "pi"; name: string; value: string }
  | { type: "cdata"; value: string };

export type AstNodeLike =
  | { type: "root"; children: (Ast | AstNode | string)[] }
  | { type: "text"; value: string }
  | {
      type: "element";
      name: string;
      attributes: AstAttributes;
      children: (Ast | AstNode | string)[];
    }
  | { type: "comment"; value: string }
  | { type: "doctype"; value: string }
  | { type: "pi"; name: string; value: string }
  | { type: "cdata"; value: string };

export type AstType = "root" | "text" | "element" | "comment" | "doctype" | "pi" | "cdata";
export type AstAttributes = Record<string, string | boolean>;

type Token = AstNode & {
  isClosed: boolean;
  isClosing: boolean;
  children?: (AstNode | Token)[];
};

type Stack = Token & {
  type: "element";
};

function isWhitespace(char: string): boolean {
  switch (char) {
    case " ":
    case "\n":
    case "\r":
    case "\t":
      return true;
    default:
      return false;
  }
}

function parseEndTag(
  str: string,
  i: number,
): {
  token: Token;
  nextIndex: number;
} {
  let name = "",
    skip = false;

  while (i < str.length) {
    if (str[i] === ">") {
      i++;
      break;
    }

    if (skip) {
      i++;
      continue;
    }

    if (isWhitespace(str[i])) {
      skip = true;
      i++;
      continue;
    }

    name += str[i];
    i++;
  }

  return {
    token: {
      type: "element",
      isClosed: true,
      isClosing: true,
      name,
      attributes: {},
      children: [],
    },
    nextIndex: i,
  };
}

function parseComment(
  str: string,
  i: number,
): {
  token: Token;
  nextIndex: number;
} {
  let value = "";
  while (i < str.length) {
    if (str[i] === "-" && str[i + 1] === "-" && str[i + 2] === ">") {
      i += 3;
      break;
    }

    value += str[i];
    i++;
  }

  return {
    token: {
      type: "comment",
      isClosed: true,
      isClosing: false,
      value,
    },
    nextIndex: i,
  };
}

function parseDoctype(
  str: string,
  i: number,
): {
  token: Token;
  nextIndex: number;
} {
  let quotes: string | null = null,
    value = "",
    depth = 0;

  while (i < str.length) {
    const ch = str[i];

    if (quotes) {
      if (ch === quotes) {
        quotes = null;
      }
      value += ch;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quotes = ch;
      value += ch;
      i++;
      continue;
    }

    if (ch === "[") {
      depth++;
      value += ch;
      i++;
      continue;
    }

    if (ch === "]") {
      depth--;
      value += ch;
      i++;
      continue;
    }

    if (depth > 0) {
      value += ch;
      i++;
      continue;
    }

    if (ch === ">") {
      i++;
      break;
    }

    value += ch;
    i++;
  }

  return {
    token: {
      type: "doctype",
      isClosed: true,
      isClosing: false,
      value,
    },
    nextIndex: i,
  };
}

function parseCdata(
  str: string,
  i: number,
): {
  token: Token;
  nextIndex: number;
} {
  let value = "";
  while (i < str.length) {
    if (str[i] === "]" && str[i + 1] === "]" && str[i + 2] === ">") {
      i += 3;
      break;
    }

    value += str[i];
    i++;
  }

  return {
    token: {
      type: "cdata",
      isClosed: true,
      isClosing: false,
      value,
    },
    nextIndex: i,
  };
}

function parsePi(
  str: string,
  i: number,
): {
  token: Token;
  nextIndex: number;
} {
  let target = "",
    value = "";

  // get target
  while (i < str.length) {
    const ch = str[i];

    if (isWhitespace(ch)) {
      i++;
      break;
    }

    if (ch === "?") {
      break;
    }

    target += ch;
    i++;
  }

  // get value
  while (i < str.length) {
    if (str[i] === "?" && str[i + 1] === ">") {
      i += 2;
      break;
    }

    value += str[i];
    i++;
  }

  return {
    token: {
      type: "pi",
      isClosed: true,
      isClosing: false,
      name: target,
      value,
    },
    nextIndex: i,
  };
}

function parseAttributes(
  str: string,
  i: number,
): {
  attributes: AstAttributes;
  isClosed: boolean;
  nextIndex: number;
} {
  const attributes: AstAttributes = {};

  let quotes: string | null = null,
    buffer = "",
    isClosed = false;

  const flush = () => {
    if (!buffer) {
      return;
    }

    const keyEnd = buffer.indexOf("=");

    if (keyEnd === -1) {
      attributes[buffer] = true;
    } else {
      attributes[buffer.substring(0, keyEnd)] = buffer.substring(keyEnd + 1);
    }

    buffer = "";
  };

  // get attributes
  while (i < str.length) {
    const ch = str[i];

    if (quotes) {
      // escape
      if (ch === "\\") {
        buffer += str[i] + (str[i + 1] ?? "");
        i += 2;
        continue;
      }

      if (ch === quotes) {
        flush();
        quotes = null;
        i++;
        continue;
      }

      buffer += ch;
      i++;
      continue;
    }

    if (ch === `"` || ch === `'`) {
      quotes = ch;
      i++;
      continue;
    }

    if (ch === "/") {
      isClosed = true;
      i++;
      continue;
    }

    if (ch === ">") {
      i++;
      break;
    }

    if (isWhitespace(ch)) {
      flush();
      i++;
      continue;
    }

    buffer += ch;
    isClosed = false;
    i++;
  }

  flush();

  return {
    attributes,
    isClosed,
    nextIndex: i,
  };
}

function parseScript(
  str: string,
  i: number,
): {
  tokens: Token[];
  nextIndex: number;
} {
  // get attributes
  const { attributes, nextIndex } = parseAttributes(str, i);

  i = nextIndex;

  // get value
  let closingStart = str.indexOf("</script", i);
  if (closingStart === -1) {
    closingStart = str.length;
  }
  const value = str.substring(i, closingStart);

  i = closingStart + 8;

  // get next index
  while (i < str.length) {
    if (str[i] === ">") {
      i++;
      break;
    }
    i++;
  }

  return {
    tokens: [
      {
        type: "element",
        isClosed: false,
        isClosing: false,
        name: "script",
        attributes,
        children: [],
      },
      {
        type: "text",
        isClosed: true,
        isClosing: false,
        value,
      },
      {
        type: "element",
        isClosed: true,
        isClosing: true,
        name: "script",
        attributes,
        children: [],
      },
    ],
    nextIndex: i,
  };
}

function parseStyle(
  str: string,
  i: number,
): {
  tokens: Token[];
  nextIndex: number;
} {
  // get attributes
  const { attributes, nextIndex } = parseAttributes(str, i);

  i = nextIndex;

  // get value
  let closingStart = str.indexOf("</style", i);
  if (closingStart === -1) {
    closingStart = str.length;
  }
  const value = str.substring(i, closingStart);

  i = closingStart + 7;

  // get next index
  while (i < str.length) {
    if (str[i] === ">") {
      i++;
      break;
    }
    i++;
  }

  return {
    tokens: [
      {
        type: "element",
        isClosed: false,
        isClosing: false,
        name: "style",
        attributes,
        children: [],
      },
      {
        type: "text",
        isClosed: true,
        isClosing: false,
        value,
      },
      {
        type: "element",
        isClosed: true,
        isClosing: true,
        name: "style",
        attributes,
        children: [],
      },
    ],
    nextIndex: i,
  };
}

function parseStartTag(buffer: string): {
  token: Token;
  nextIndex: number;
} {
  let i = 1, // skip opening barcket
    name = "";

  // get name
  while (i < buffer.length) {
    const ch = buffer[i];

    if (isWhitespace(ch)) {
      i++;
      break;
    }

    name += ch;
    i++;
  }

  // get attributes
  const { attributes, isClosed, nextIndex } = parseAttributes(buffer, i);

  return {
    token: {
      type: "element",
      isClosed,
      isClosing: false,
      name,
      attributes,
      children: [],
    },
    nextIndex,
  };
}

function normalize(str: string): string {
  return str.replace(/\r\n?/g, "\n");
}

function tokenize(input: string): Token[] {
  const result: Token[] = [];

  let i = 0,
    toggle = false,
    buffer = "";

  while (i < input.length) {
    const ch = input[i];

    if (!toggle) {
      if (ch !== "<") {
        buffer += ch;
        i++;
        continue;
      }

      if (buffer) {
        result.push({
          type: "text",
          isClosed: true,
          isClosing: false,
          value: buffer,
        });

        buffer = "";
      }

      toggle = true;
      buffer = ch;
      i++;
      continue;
    }

    if (buffer.length === 9) {
      const upper = buffer.toUpperCase();

      // doctype
      if (upper === "<!DOCTYPE") {
        const { token, nextIndex } = parseDoctype(input, i + 1);
        result.push(token);
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }

      // XML cdata
      if (upper === "<![CDATA[") {
        const { token, nextIndex } = parseCdata(input, i);
        result.push(token);
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }
    }

    // HTML script
    if (buffer === "<script") {
      const { tokens, nextIndex } = parseScript(input, i);
      result.push(...tokens);
      i = nextIndex;
      toggle = false;
      buffer = "";
      continue;
    }

    // HTML style
    if (buffer === "<style") {
      const { tokens, nextIndex } = parseStyle(input, i);
      result.push(...tokens);
      i = nextIndex;
      toggle = false;
      buffer = "";
      continue;
    }

    // comment
    if (buffer === "<!--") {
      const { token, nextIndex } = parseComment(input, i);
      result.push(token);
      i = nextIndex;
      toggle = false;
      buffer = "";
      continue;
    }

    // end tag
    if (buffer === "</") {
      const { token, nextIndex } = parseEndTag(input, i);
      result.push(token);
      i = nextIndex;
      toggle = false;
      buffer = "";
      continue;
    }

    // XML PI (Processing Instruction)
    if (buffer === "<?") {
      const { token, nextIndex } = parsePi(input, i);
      result.push(token);
      i = nextIndex;
      toggle = false;
      buffer = "";
      continue;
    }

    // start-tag
    if (ch === ">") {
      const { token } = parseStartTag(buffer);
      result.push(token);
      toggle = false;
      buffer = "";
      i++;
      continue;
    }

    buffer += ch;
    i++;
  }

  if (buffer) {
    result.push({
      type: "text",
      isClosed: true,
      isClosing: false,
      value: buffer,
    });
  }

  return result;
}

function parseStr(str: string): {
  root: Extract<AstNode, { type: "root" }>;
  nodes: AstNode[];
} {
  // normalize
  str = normalize(str);

  // tokenize raw string
  const tokens: Token[] = tokenize(str);

  // opened element token
  const stack: Stack[] = [];

  const root: AstNode = {
    type: "root",
    children: [],
  };

  // all elements without root
  const nodes: AstNode[] = [];

  // close tokens
  for (const token of tokens) {
    if (token.type !== "element") {
      nodes.push(token);

      const top = stack.length > 0 ? stack[stack.length - 1] : root;

      top.children.push(token);
      continue;
    }

    // end-tag
    if (token.isClosing) {
      // find start-tag in stack
      while (stack.length > 0) {
        const top = stack.pop()!;

        /** @see https://developer.mozilla.org/en-US/docs/Glossary/Void_element#self-closing_tags */
        // force close void element or self-closing tag
        top.isClosed = true;

        if (top.name === token.name) {
          // if the element is closed but has no children,
          // add empty text node as children to avoid void element (e.g., <img>) being treated as self-closing tag (e.g., <div />)
          if (top.children.length === 0) {
            top.children.push({
              type: "text",
              isClosed: true,
              isClosing: false,
              value: "",
            });
          }
          break;
        }
      }

      continue;
    }

    // start-tag
    nodes.push(token);

    const top = stack.length > 0 ? stack[stack.length - 1] : root;

    top.children.push(token);

    if (!token.isClosed) {
      stack.push(token);
    }
  }

  // delete unused properties
  for (const node of nodes as any[]) {
    delete node.isClosed;
    delete node.isClosing;
  }

  return {
    root,
    nodes: nodes as AstNode[],
  };
}

function stringifyAttrs(attrs: AstAttributes): string {
  let result = "";

  // false will be skip
  // true is no value attribute (e.g., <div hidden>)
  for (const k of Object.keys(attrs)) {
    const v = attrs[k];
    if (typeof v === "string") {
      result += ` ${k}="${v}"`;
    } else if (v === true) {
      result += ` ${k}`;
    }
  }

  return result;
}

function createChildren(parent: Ast, nodes: (string | AstNodeLike | Ast)[]): Ast[] {
  const result: Ast[] = [];

  for (const node of nodes) {
    if (typeof node === "string") {
      const { root } = Ast.parse(node);
      for (const child of root.children) {
        result.push(new Ast(child, parent));
      }
    } // Ast
    else if (node instanceof Ast) {
      if (node.type === "root") {
        const children = createChildren(parent, node.children);
        for (const child of children) {
          result.push(child);
        }
      } else {
        if (node.parent && node.parent !== parent) {
          node.remove();
          node.parent = parent;
        }
        result.push(node);
      }
    } // AstNode
    else {
      if (node.type === "root") {
        const children = createChildren(parent, node.children);
        for (const child of children) {
          result.push(child);
        }
      } else {
        result.push(new Ast(node, parent));
      }
    }
  }

  return result;
}

function createAst(src: string | AstNode | Ast, parent?: Ast): Ast {
  return new Ast(src, parent);
}

/**
 * Abstract Syntax Tree (AST)
 *
 * @example
 * const ast = new Ast(`<div>abc</div>`);
 * atr.type; // "root"
 * atr.children; // [{ type: "element", name: "div", attributes: {}, children: [ ... ] }]
 * atr.children[0].children; // [{ type: "text", value: "abc" }]
 */
export class Ast {
  parent?: Ast;
  type: AstType;
  name: string;
  value: string;
  attributes: AstAttributes;
  children: Ast[];

  constructor(src?: string | AstNodeLike | Ast, parent?: Ast) {
    this.parent = parent;
    this.type = "root";
    this.name = "";
    this.value = "";
    this.attributes = {};
    this.children = [];

    if (typeof src === "string") {
      const { root } = Ast.parse(src);
      this.children = createChildren(this, root.children);
      return;
    }

    if (src) {
      this.type = src.type;

      switch (src.type) {
        case "root":
          this.children = createChildren(this, src.children);
          break;
        case "element":
          this.name = src.name;
          this.attributes = { ...src.attributes };
          this.children = createChildren(this, src.children);
          break;
        case "pi":
          this.name = src.name;
          this.value = src.value;
          break;
        case "doctype":
        case "text":
        case "comment":
        case "cdata":
          this.value = src.value;
          break;
      }
    }
  }

  static parse = parseStr as typeof parseStr;
  static create = createAst as typeof createAst;

  isRoot(): boolean {
    return this.type === "root";
  }
  isText(): boolean {
    return this.type === "text";
  }
  isElement(): boolean {
    return this.type === "element";
  }
  isVoidElement(): boolean {
    return this.type === "element" && this.children.length === 0;
  }
  isComment(): boolean {
    return this.type === "comment";
  }
  isDoctype(): boolean {
    return this.type === "doctype";
  }
  isCdata(): boolean {
    return this.type === "cdata";
  }
  isPi(): boolean {
    return this.type === "pi";
  }
  isStyle(): boolean {
    return this.isElement() && this.name === "style";
  }
  isScript(): boolean {
    return this.isElement() && this.name === "script";
  }

  getParent(): Ast | undefined {
    return this.parent;
  }
  hasParent(): boolean {
    return !!this.parent;
  }

  // biome-ignore lint: STFU
  _walk(callback: (node: Ast, index: number, siblings: Ast[]) => void | "skip" | "break"): void {
    const stack: [Ast, number, Ast[]][] = [];

    const rootChildren = this.children;

    if (!rootChildren?.length) {
      return;
    }

    for (let i = rootChildren.length - 1; i >= 0; i--) {
      stack.push([rootChildren[i], i, rootChildren]);
    }

    while (stack.length) {
      const [node, index, siblings] = stack.pop()!;

      const res = callback(node, index, siblings);

      if (res === "skip") {
        continue;
      }

      if (res === "break") {
        return;
      }

      const nodeChildren = node.children;

      if (!nodeChildren?.length) {
        continue;
      }

      for (let i = nodeChildren.length - 1; i >= 0; i--) {
        stack.push([nodeChildren[i], i, nodeChildren]);
      }
    }
  }

  /**
   * @example
   * const ancestors = target.getAncestors(); // Ast[]
   * ancestors.indexOf(target); // -1
   * ancestors.indexOf(target.parent); // 0
   */
  getAncestors(): Ast[] {
    const result: Ast[] = [];

    let parent = this.parent;

    while (parent) {
      result.push(parent);
      parent = parent.parent;
    }

    return result;
  }

  /**
   * @example
   * const descendants = target.getDescendants(); // Ast[]
   * const grandchild = target.children[0].children[0];
   * descendants.includes(grandchild); // true
   */
  getDescendants(): Ast[] {
    const result: Ast[] = [];

    this._walk((n) => {
      result.push(n);
    });

    return result;
  }

  hasChildren(): boolean {
    return this.children.length > 1;
  }

  getSiblings(): Ast[] {
    return (this.parent?.children || []).filter((sibling) => sibling !== this);
  }
  getPrevSibling(): Ast | undefined {
    const parentChidlren = this.parent?.children || [];
    const i = parentChidlren.indexOf(this);
    return i === -1 ? undefined : parentChidlren[i - 1];
  }
  getNextSibling(): Ast | undefined {
    const parentChidlren = this.parent?.children || [];
    const i = parentChidlren.indexOf(this);
    return i === -1 ? undefined : parentChidlren[i + 1];
  }
  hasSibling(): boolean {
    return (this.parent?.children || []).length > 1;
  }

  getAttribute(key: string): string | boolean | undefined {
    return this.attributes[key];
  }
  setAttribute(key: string, value: string | boolean): void {
    this.attributes[key] = value;
  }
  hasAttribute(key: string): boolean {
    return typeof this.attributes[key] !== "undefined";
  }

  getText(): string {
    let result = "";

    this._walk((n) => {
      if (n.type === "text") {
        result += n.value;
      }
    });

    return result;
  }

  getTexts(): string[] {
    const result: string[] = [];

    this._walk((n) => {
      if (n.type === "text") {
        result.push(n.value);
      }
    });

    return result;
  }

  getRoot(this: Ast): Ast | undefined {
    const parents = this.getAncestors();
    const root = parents.pop();
    return root && root.type === "root" ? root : undefined;
  }

  getDepth(this: Ast): number {
    let result: number = 0;
    let parent = this.parent;

    while (parent) {
      result++;
      parent = parent.parent;
    }

    return result;
  }

  append(...nodes: (string | AstNodeLike | Ast)[]): void {
    const newChildren = createChildren(this, nodes);
    for (const el of newChildren) {
      this.children.push(el);
    }
  }

  prepend(...nodes: (string | AstNodeLike | Ast)[]): void {
    const newChildren = createChildren(this, nodes);
    this.children.splice(0, 0, ...newChildren);
  }

  before(...nodes: (string | AstNodeLike | Ast)[]): void {
    if (!this.parent) {
      throw new Error("No parent.");
    }

    const index = this.parent.children.indexOf(this);
    if (index === -1) {
      throw new Error("Not a child.");
    }

    const newSiblings = createChildren(this.parent, nodes);
    this.parent.children.splice(index, 0, ...newSiblings);
  }

  after(...nodes: (string | AstNodeLike | Ast)[]): void {
    if (!this.parent) {
      throw new Error("No parent node.");
    }

    const index = this.parent.children.indexOf(this);
    if (index === -1) {
      throw new Error("Not a child.");
    }

    const newSiblings = createChildren(this.parent, nodes);
    this.parent.children.splice(index + 1, 0, ...newSiblings);
  }

  clear(): void {
    const children = this.children;

    this.children = [];

    for (const child of children) {
      delete child.parent;
    }
  }

  // biome-ignore lint: STFU
  forEach(callback: (node: Ast, index: number, siblings: Ast[]) => void | "skip" | "break"): void {
    this._walk(callback);
  }

  find(callback: (node: Ast, index: number, siblings: Ast[]) => unknown): Ast | undefined {
    let result: Ast | undefined;

    this._walk((node, index, siblings) => {
      if (callback(node, index, siblings)) {
        result = node;
        return "break";
      }
    });

    return result;
  }

  some(callback: (node: Ast, index: number, siblings: Ast[]) => unknown): boolean {
    let result: boolean = false;

    this._walk((node, index, siblings) => {
      if (callback(node, index, siblings)) {
        result = true;
        return "break";
      }
    });

    return result;
  }

  filter(callback: (node: Ast, index: number, siblings: Ast[]) => unknown): Ast[] {
    const result: Ast[] = [];

    this._walk((node, index, siblings) => {
      if (callback(node, index, siblings)) {
        result.push(node);
      }
    });

    return result;
  }

  map<T>(callback: (node: Ast, index: number, siblings: Ast[]) => T): T[] {
    const result: T[] = [];

    this._walk((node, index, siblings) => {
      result.push(callback(node, index, siblings));
    });

    return result;
  }

  reduce<T>(
    callback: (previousValue: T, node: Ast, index: number, siblings: Ast[]) => T,
    initialValue: T,
  ): T {
    let acc = initialValue;

    this._walk((node, index, siblings) => {
      acc = callback(acc, node, index, siblings);
    });

    return acc;
  }

  remove(): void {
    if (this.parent) {
      this.parent.children = this.parent.children.filter((child) => child !== this);
    }

    delete this.parent;
  }

  removeChild(node: Ast): void {
    this.children = this.children.filter((child) => {
      if (child === node) {
        delete child.parent;
        return false;
      } else {
        return true;
      }
    });
  }

  removeChildren(nodes: Ast[]): void {
    const set = new Set(nodes);

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
   * @example
   * const ast = new Ast(`<div>abc</div>`);
   * ast.toString(); // "<div>abc</div>"
   */
  toString(): string {
    const { type, name, value } = this;

    if (type === "root") {
      return this.children.map((child) => child.toString()).join("");
    }

    if (type === "comment") {
      return `<!--${value}-->`;
    }

    if (type === "text") {
      return value;
    }

    if (type === "doctype") {
      return `<!DOCTYPE ${value}>`;
    }

    if (type === "cdata") {
      return `<![CDATA[${value}]]>`;
    }

    if (type === "pi") {
      return `<?${name} ${value}?>`;
    }

    // type === "element"
    const isVoidElement = this.children.length === 0;
    const attrs = stringifyAttrs(this.attributes);

    if (isVoidElement) {
      return `<${name}${attrs} />`;
    }

    const joinedValue = this.children.map((node) => node.toString()).join("");
    return `<${name}${attrs}>${joinedValue}</${name}>`;
  }

  /**
   * @example
   * const root = new Ast(`<div>abc</div>`);
   * root.toObject();
   * // {
   * //   type: "root",
   * //   children: [
   * //     {
   * //       type: "element",
   * //       name: "div",
   * //       attributes: {},
   * //       children: [
   * //         {
   * //           type: "text",
   * //           value: "abc",
   * //         }
   * //       ]
   * //     }
   * //   ]
   * // };
   */
  toObject(): AstNode {
    const fn = (ast: Ast): AstNode => {
      const { type, name, value, children, attributes } = ast;

      if (type === "root") {
        return {
          type,
          children: children.map(fn),
        } as Extract<AstNode, { type: "root" }>;
      }

      if (type === "text") {
        return {
          type,
          value,
        } as Extract<AstNode, { type: "text" }>;
      }

      if (type === "element") {
        return {
          type,
          name,
          attributes: { ...attributes },
          children: children.map(fn),
        } as Extract<AstNode, { type: "element" }>;
      }

      if (type === "comment") {
        return {
          type,
          value,
        } as Extract<AstNode, { type: "comment" }>;
      }

      if (type === "doctype") {
        return {
          type,
          value,
        } as Extract<AstNode, { type: "doctype" }>;
      }

      if (type === "cdata") {
        return {
          type,
          value,
        } as Extract<AstNode, { type: "cdata" }>;
      }

      if (type === "pi") {
        return {
          type,
          name,
          value,
        } as Extract<AstNode, { type: "pi" }>;
      }

      throw new Error(`Invalid ast type: ${type}`);
    };

    return fn(this);
  }
}
