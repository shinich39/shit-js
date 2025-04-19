import { escapeXML, unescapeXML } from "./string";

export type TreeNode = TreeRoot | TreeTag | TreeText | TreeComment;
export type TreeParent = TreeRoot | TreeTag;
export type TreeChild = TreeTag | TreeText | TreeComment;
export type TreeAttrs = Record<string, boolean | string>;

export interface TreeRoot {
  type: "root";
  parent?: undefined;
  tag?: undefined;
  closer?: undefined;
  content?: undefined;
  attrs?: undefined;
  children: TreeChild[];
}

export interface TreeTag {
  type: "tag";
  parent: TreeParent;
  tag: string;
  closer?: string;
  content?: undefined;
  attrs: TreeAttrs;
  children: TreeChild[];
}

export interface TreeText {
  type: "text";
  parent: TreeParent;
  tag?: undefined;
  closer?: undefined;
  content: string;
  attrs?: undefined;
  children?: undefined;
}

export interface TreeComment {
  type: "comment";
  parent: TreeParent;
  tag?: undefined;
  closer?: undefined;
  content: string;
  attrs?: undefined;
  children?: undefined;
}

type StackNode = Omit<TreeNode, "parent"> & {
  isClosed?: boolean;
  parent?: TreeParent;
};
type StackChild = Omit<TreeChild, "parent"> & {
  isClosed?: boolean;
  parent?: TreeParent;
};
type StackParent = Omit<TreeParent, "parent"> & {
  isClosed?: boolean;
  parent?: TreeParent;
};
type StackTag = Omit<TreeTag, "parent"> & {
  isClosed?: boolean;
  parent?: TreeParent;
};
type StackText = Omit<TreeText, "parent"> & {
  isClosed?: boolean;
  parent?: TreeParent;
};
type StackComment = Omit<TreeComment, "parent"> & {
  isClosed?: boolean;
  parent?: TreeParent;
};

function parseTag(str: string, fromIndex: number) {
  let i = fromIndex;
  while (i < str.length) {
    if (str[i] === " " || str[i] === "\n" || str[i] === ">") {
      return i !== fromIndex ? str.substring(fromIndex, i) : undefined;
    }
    i++;
  }
  return;
}

function parseAttrs(str: string, fromIndex: number) {
  let i = fromIndex,
    j = fromIndex,
    parts: string[] = [],
    quote = null,
    closer: string | undefined;

  const acc = function (s: string) {
    s = s.trim();
    if (s !== "") {
      parts.push(s);
    }
  };

  while (j < str.length) {
    const char = str[j];
    if (!quote) {
      if (char === ">") {
        const part = str.substring(i, j);
        if (part.endsWith("/") || part.endsWith("?")) {
          closer = part;
        } else {
          acc(part);
        }
        j++;
        break;
      }
      if (char === " " || char === "\n") {
        acc(str.substring(i, j));
        i = j;
      } else if (char === `"` || char === `'`) {
        quote = char;
      }
    } else if (char === "\\") {
      j++;
    } else if (char === quote) {
      quote = null;
      acc(str.substring(i, j + 1));
      i = j + 1;
    }
    j++;
  }

  const attrs: Record<string, string | boolean> = {};
  for (const part of parts) {
    const [key, ...values] = part.split("=");
    if (values.length === 0) {
      attrs[key] = true;
    } else {
      const value = values.join("=");
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        // remove quotes
        attrs[key] = value.substring(1, value.length - 1);
      } else {
        attrs[key] = value;
      }
    }
  }

  return {
    startIndex: fromIndex,
    endIndex: j,
    closer,
    attrs,
  };
}

function isParent(node: TreeNode): node is TreeParent {
  return node.type === "root" || node.type === "tag";
}

function isChild(node: TreeNode): node is TreeChild {
  return node.type === "tag" || node.type === "text" || node.type === "comment";
}

function isRoot(node: TreeNode): node is TreeRoot {
  return node.type === "root";
}

function isTag(node: TreeNode): node is TreeTag {
  return node.type === "tag";
}

function isText(node: TreeNode): node is TreeText {
  return node.type === "text";
}

function isComment(node: TreeNode): node is TreeComment {
  return node.type === "comment";
}

export function parse(str: string): TreeRoot {
  // normalize
  str = unescapeXML(str);

  const stacks: StackNode[] = [];

  let offset = 0,
    i = str.indexOf("<", offset);

  const searchOpening = function (n: number) {
    offset = n;
    i = str.indexOf("<", offset);
  };

  while (offset < str.length) {
    // text
    if (i !== offset) {
      const endIndex = i > -1 ? i : str.length;

      stacks.push({
        isClosed: true,
        type: "text",
        content: str.substring(offset, endIndex),
      });
    }

    if (i === -1) {
      break;
    }

    const tag = parseTag(str, i + 1);
    if (!tag) {
      // throw new Error(`Invalid argument: could not found closing bracket ">" after ${i + 1}`);

      // ignore invalid html
      const prev = stacks[stacks.length - 1];
      if (typeof prev.content === "string") {
        prev.content += str[i];
      }

      searchOpening(i + 1);
      continue;
    }

    if (tag.startsWith("!--")) {
      const j = str.indexOf("-->", i + 4);
      if (j === -1) {
        throw new Error(
          `Invalid argument: could not find closing tag "-->" after ${i + 4}`
        );
      }

      stacks.push({
        type: "comment",
        content: str.substring(i + 4, j),
      });

      searchOpening(j + 3);
    } else if (tag === "style" || tag === "script") {
      const { endIndex, attrs } = parseAttrs(str, i + 1 + tag.length);

      const n = str.indexOf(`</${tag}>`, endIndex);
      if (n === -1) {
        throw new Error(
          `Invalid argument: could not find closing tag "</${tag}>" after ${endIndex}`
        );
      }

      const a: StackTag = {
        isClosed: true,
        type: "tag",
        tag,
        attrs,
        children: [],
      };

      const b: StackText = {
        isClosed: true,
        type: "text",
        parent: a as TreeTag,
        content: str.substring(endIndex, n),
      };

      a.children.push(b as TreeText);

      stacks.push(a, b);

      searchOpening(n + 3 + tag.length);
    } // closing tag
    else if (tag.startsWith("/")) {
      const _tag = tag.substring(1);

      const children: TreeChild[] = [];

      for (let n = stacks.length - 1; n >= 0; n--) {
        const stack = stacks[n];

        // opening tag found
        if (!stack.isClosed && stack.tag === _tag) {
          stack.children = [
            ...children.reverse(),
            ...(stack as StackTag).children,
          ];

          for (const child of children) {
            child.parent = stack as TreeTag;
          }

          // close opening tag
          stack.isClosed = true;
          break;
        }

        if (!stack.parent) {
          children.push(stack as TreeChild);
        }
      }

      searchOpening(i + tag.length + 2);
    } else {
      const { endIndex, closer, attrs } = parseAttrs(str, i + tag.length + 1);

      stacks.push({
        isClosed: !!closer,
        type: "tag",
        tag,
        closer,
        attrs,
        children: [],
      });

      searchOpening(endIndex);
    }
  }

  const root: TreeRoot = {
    type: "root",
    children: [],
  };

  for (const stack of stacks) {
    // close self-closing tag
    if (stack.type === "tag" && !stack.isClosed) {
      stack.closer = "";
      stack.isClosed = true;
    }

    // remvoe unused property
    delete stack.isClosed;

    // top nodes append to root
    if (!stack.parent) {
      stack.parent = root;
      root.children.push(stack as TreeChild);
    }
  }

  return root;
}

function mapChildren<T>(
  parent: TreeParent,
  callback: (
    child: TreeChild,
    depth: number,
    index: number,
    siblings: TreeChild[]
  ) => T
): T[] {
  const result: T[] = [];

  const func = function (parent: TreeParent, depth: number) {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];
      result.push(callback(child, depth, i, parent.children));
      if (child.type === "tag") {
        func(child, depth + 1);
      }
    }
  };

  func(parent, 1);

  return result;
}

function reduceChildren<T>(
  parent: TreeParent,
  callback: (
    accumulator: T,
    child: TreeChild,
    depth: number,
    index: number,
    siblings: TreeChild[]
  ) => T,
  initialValue: T
): T {
  let result = initialValue;

  const func = function (parent: TreeParent, depth: number) {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];
      result = callback(result, child, depth, i, parent.children);
      if (child.type === "tag") {
        func(child, depth + 1);
      }
    }
  };

  func(parent, 1);

  return result;
}

function findChild(
  parent: TreeParent,
  callback: (
    child: TreeChild,
    depth: number,
    index: number,
    siblings: TreeChild[]
  ) => any
): TreeChild | undefined {
  const func = function (
    parent: TreeParent,
    depth: number
  ): TreeChild | undefined {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (callback(child, depth, i, parent.children)) {
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

  return func(parent, 1);
}

function filterChildren(
  parent: TreeParent,
  callback: (
    child: TreeChild,
    depth: number,
    index: number,
    siblings: TreeChild[]
  ) => any
): TreeChild[] {
  const result: TreeChild[] = [];

  const func = function (parent: TreeParent, depth: number) {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (callback(child, depth, i, parent.children)) {
        result.push(child);
      }
      if (child.type === "tag") {
        func(child, depth + 1);
      }
    }
  };

  func(parent, 1);

  return result;
}

function mapParents<T>(
  child: TreeChild,
  callback: (parent: TreeParent, depth: number, child: TreeChild) => T
): T[] {
  const result: T[] = [];

  const func = function (child: TreeChild, depth: number) {
    if (child.parent) {
      result.push(callback(child.parent, depth, child));
      if (child.parent.type !== "root") {
        func(child.parent, depth + 1);
      }
    }
  };

  func(child, 1);

  return result;
}

function reduceParents<T>(
  child: TreeChild,
  callback: (
    accumulator: T,
    parent: TreeParent,
    depth: number,
    child: TreeChild
  ) => T,
  initialValue: T
): T {
  let result = initialValue;

  const func = function (child: TreeChild, depth: number) {
    if (child.parent) {
      if (callback(result, child.parent, depth, child)) {
        return child.parent;
      }
      if (child.parent.type !== "root") {
        func(child.parent, depth + 1);
      }
    }
  };

  func(child, 1);

  return result;
}

function findParent(
  child: TreeChild,
  callback: (parent: TreeParent, depth: number, child: TreeChild) => any
) {
  const func = function (
    child: TreeChild,
    depth: number
  ): TreeNode | undefined {
    if (child.parent) {
      if (callback(child.parent, depth, child)) {
        return child.parent;
      }
      if (child.parent.type !== "root") {
        func(child.parent, depth + 1);
      }
    }
  };

  return func(child, 1);
}

function filterParents(
  child: TreeChild,
  callback: (parent: TreeParent, depth: number, child: TreeChild) => any
) {
  const result: TreeParent[] = [];

  const func = function (child: TreeChild, depth: number) {
    if (child.parent) {
      if (callback(child.parent, depth, child)) {
        result.push(child.parent);
      }
      if (child.parent.type !== "root") {
        func(child.parent, depth + 1);
      }
    }
  };

  func(child, 1);

  return result;
}

function stringify(node: TreeNode): string {
  const stringifyAttrs = function (attrs: Record<string, any>) {
    let acc = "";
    for (const [k, v] of Object.entries(attrs)) {
      if (typeof v === "string") {
        acc += ` ${k}="${v}"`;
      } else if (typeof v === "boolean") {
        // skip false
        if (v) {
          acc += ` ${k}`;
        }
      } else if (typeof v === "object" && typeof v.toString === "function") {
        acc += ` ${k}="${v.toString()}"`;
      }
    }
    return acc;
  };

  const stringifyNode = function (n: TreeNode): string {
    let acc = "";
    if (n.type === "text") {
      // prevent escaping of <script> and <style>
      const parent = n.parent;
      if (
        parent &&
        parent.type === "tag" &&
        (parent.tag === "script" || parent.tag === "style")
      ) {
        acc += n.content;
      } else {
        acc += escapeXML(n.content);
      }
    } else if (n.type === "comment") {
      acc += `<!--${n.content}-->`;
    } else if (n.type === "tag") {
      acc += `<${n.tag}${stringifyAttrs(n.attrs)}`;
      if (typeof n.closer === "string") {
        acc += `${n.closer}>`;
      } else {
        acc += `>`;
        for (const child of n.children) {
          acc += stringifyNode(child);
        }
        acc += `</${n.tag}>`;
      }
    } // root
    else {
      for (const child of n.children) {
        acc += stringifyNode(child);
      }
    }
    return acc;
  };

  return stringifyNode(node);
}

function getContents(node: TreeNode): string[] {
  const acc: string[] = [];

  const func = function (node: TreeNode) {
    if (node.type === "text" || node.type === "comment") {
      acc.push(node.content);
    } else {
      for (const child of node.children) {
        func(child);
      }
    }
  };

  func(node);

  return acc;
}

export class Tree {
  node: TreeNode;

  constructor(arg: string | TreeNode) {
    if (typeof arg === "string") {
      this.node = parse(arg);
    } else if (
      typeof arg === "object" &&
      ["root", "tag", "text", "comment"].indexOf(arg.type) > -1
    ) {
      this.node = arg;
    } else {
      throw new Error(`Invalid argument: argument must be string or TreeNode`);
    }
  }

  isParent() {
    return isParent(this.node);
  }

  isChild() {
    return isChild(this.node);
  }

  isRoot() {
    return isRoot(this.node);
  }

  isTag() {
    return isTag(this.node);
  }

  isText() {
    return isText(this.node);
  }

  isComment() {
    return isComment(this.node);
  }

  map<T>(
    callback: (
      child: TreeChild,
      depth: number,
      index: number,
      siblings: TreeChild[]
    ) => T
  ): T[] {
    if (isParent(this.node)) {
      return mapChildren(this.node, callback);
    } else {
      return [];
    }
  }

  reduce<T>(
    callback: (
      accumulator: T,
      child: TreeChild,
      depth: number,
      index: number,
      siblings: TreeChild[]
    ) => T,
    initialValue: T
  ): T {
    if (isParent(this.node)) {
      return reduceChildren(this.node, callback, initialValue);
    } else {
      return initialValue;
    }
  }

  find(
    callback: (
      child: TreeChild,
      depth: number,
      index: number,
      siblings: TreeChild[]
    ) => any
  ): TreeChild | undefined {
    if (isParent(this.node)) {
      return findChild(this.node, callback);
    }
  }

  filter(
    callback: (
      child: TreeChild,
      depth: number,
      index: number,
      siblings: TreeChild[]
    ) => any
  ): TreeChild[] {
    if (isParent(this.node)) {
      return filterChildren(this.node, callback);
    } else {
      return [];
    }
  }

  mapParents<T>(
    callback: (parent: TreeParent, depth: number, child: TreeChild) => T
  ): T[] {
    if (isChild(this.node)) {
      return mapParents(this.node, callback);
    } else {
      return [];
    }
  }

  reduceParents<T>(
    callback: (
      accumulator: T,
      parent: TreeParent,
      depth: number,
      child: TreeChild
    ) => T,
    initialValue: T
  ): T {
    if (isChild(this.node)) {
      return reduceParents(this.node, callback, initialValue);
    } else {
      return initialValue;
    }
  }

  findParent(
    callback: (parent: TreeParent, depth: number, child: TreeChild) => any
  ) {
    if (isChild(this.node)) {
      return findParent(this.node, callback);
    }
  }

  filterParents(
    callback: (parent: TreeParent, depth: number, child: TreeChild) => any
  ) {
    if (isChild(this.node)) {
      return filterParents(this.node, callback);
    } else {
      return [];
    }
  }

  getContents() {
    return getContents(this.node);
  }

  toString() {
    return stringify(this.node);
  }

  static isParent = isParent;
  static isChild = isChild;
  static isRoot = isRoot;
  static isTag = isTag;
  static isText = isText;
  static isComment = isComment;

  static parse = parse;
  static stringify = stringify;
  static getContents = getContents;

  static map = mapChildren;
  static reduce = reduceChildren;
  static find = findChild;
  static filter = filterChildren;

  static mapParents = mapParents;
  static reduceParents = reduceParents;
  static findParent = findParent;
  static filterParents = filterParents;
}
