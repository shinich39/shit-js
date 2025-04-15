import { escapeXML, unescapeXML } from "./string";

export type TreeNode = TreeRoot | TreeTag | TreeText | TreeComment;
export type TreeParent = TreeRoot | TreeTag;
export type TreeChild = TreeTag | TreeText | TreeComment;

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
  content: undefined;
  attrs: Record<string, boolean | string>;
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

type IndexedNode = IndexedText | IndexedComment | IndexedTag;

interface IndexedTag {
  startIndex: number;
  endIndex: number;
  type: "tag";
  closer?: string;
  tag: string;
  attrs?: Record<string, boolean | string>;
}

interface IndexedText {
  startIndex: number;
  endIndex: number;
  type: "text";
  content: string;
}

interface IndexedComment {
  startIndex: number;
  endIndex: number;
  type: "comment";
  content: string;
}

type OpenedParent = OpenedRoot | OpenedTag;
type OpenedChild = OpenedTag | OpenedText | OpenedComment;

interface OpenedRoot {
  isOpened?: boolean;
  parent?: OpenedParent;
  type: "root";
  children: OpenedChild[];
}

interface OpenedTag {
  isOpened?: boolean;
  parent?: OpenedParent;
  type: "tag";
  tag: string;
  closer?: string;
  attrs: Record<string, boolean | string>;
  children: OpenedChild[];
}

interface OpenedText {
  isOpened?: boolean;
  parent?: OpenedParent;
  type: "text";
  content: string;
}

interface OpenedComment {
  isOpened?: boolean;
  parent?: OpenedParent;
  type: "comment";
  content: string;
}

function parse(str: string): TreeRoot {
  const parseTag = function (src: string, i: number) {
    let m = i + 1,
      n = i + 1,
      parts: string[] = [],
      quote = null;

    while (n < src.length) {
      const c = src[n];
      if (!quote) {
        if (c === ">") {
          parts.push(src.substring(m, n));
          n++;
          break;
        }
        if (c === " ") {
          parts.push(src.substring(m, n));
          m = n; // without whitespace: +1
        } else if (c === `"` || c === `'`) {
          quote = c;
        }
      } else if (c === "\\") {
        n++;
      } else if (c === quote) {
        quote = null;
        parts.push(src.substring(m, n + 1));
        m = n + 1;
      }
      n++;
    }

    const tag = parts.shift();
    if (!tag) {
      throw new Error(`Invalid argument: Tag name not found`);
    }

    const attrs: Record<string, string | boolean> = {};
    let closer;
    if (parts.length > 0 && /^\s*[/?]$/.test(parts[parts.length - 1])) {
      closer = parts.pop();
    }

    for (const part of parts) {
      const trimmedPart = part.trim();
      if (trimmedPart === "") {
        continue;
      }

      const sepIndex = trimmedPart.indexOf("=");
      if (sepIndex === -1) {
        attrs[trimmedPart] = true;
      } else {
        // remove quotes
        attrs[trimmedPart.substring(0, sepIndex)] = trimmedPart.substring(
          sepIndex + 2,
          trimmedPart.length - 1
        );
      }
    }

    return {
      startIndex: i,
      endIndex: n,
      closer,
      tag,
      attrs,
    };
  };

  const getNodes = function (
    src: string,
    i: number
  ): IndexedNode[] | undefined {
    if (i >= src.length) {
      return;
    }

    const j = src.indexOf("<", i);
    if (j === -1) {
      return [
        {
          startIndex: i,
          endIndex: src.length,
          type: "text",
          content: src.substring(i),
        },
      ];
    }

    if (src.substring(j, j + 4) === "<!--") {
      const k = src.indexOf("-->", j + 4);
      if (k === -1) {
        throw new Error(
          `Invalid argument: could not find closing bracket "-->"`
        );
      }
      return [
        {
          startIndex: i,
          endIndex: j,
          type: "text",
          content: src.substring(i, j),
        },
        {
          startIndex: j,
          endIndex: k + 3,
          type: "comment",
          content: src.substring(j + 4, k),
        },
      ];
    }

    for (const [opening, closing] of [
      ["<style", "</style>"],
      ["<script", "</script>"],
    ]) {
      if (src.substring(j, j + opening.length) === opening) {
        const k = src.indexOf(closing, j + opening.length);
        if (k === -1) {
          throw new Error(
            `Invalid argument: could not find closing tag "${closing}"`
          );
        }

        const { endIndex, tag, attrs } = parseTag(src, j);

        return [
          {
            startIndex: i,
            endIndex: j,
            type: "text",
            content: src.substring(i, j),
          },
          {
            startIndex: j,
            endIndex: endIndex,
            type: "tag",
            tag,
            attrs,
          },
          {
            startIndex: endIndex,
            endIndex: k,
            type: "text",
            content: src.substring(endIndex, k),
          },
          {
            startIndex: k,
            endIndex: k + closing.length,
            type: "tag",
            tag: "/" + tag,
          },
        ];
      }
    }

    const { startIndex, endIndex, tag, closer, attrs } = parseTag(src, j);

    return [
      {
        startIndex: i,
        endIndex: j,
        type: "text",
        content: src.substring(i, j),
      },
      {
        startIndex,
        endIndex,
        type: "tag",
        closer,
        tag,
        attrs,
      },
    ];
  };

  // normalize
  str = unescapeXML(str);

  const nodes: OpenedChild[] = [];
  let i = 0,
    stacks = getNodes(str, i);
  while (stacks) {
    for (const stack of stacks) {
      if (stack.type === "text") {
        nodes.push({
          isOpened: false,
          type: "text",
          content: stack.content,
        });
      } else if (stack.type === "comment") {
        nodes.push({
          isOpened: false,
          type: "comment",
          content: stack.content,
        });
      } // opening tag
      else if (stack.tag[0] !== "/") {
        nodes.push({
          isOpened: !stack.closer,
          type: "tag",
          tag: stack.tag,
          ...(stack.closer ? { closer: stack.closer } : {}),
          attrs: stack.attrs || {},
          children: [],
        });
      } // closing tag
      else {
        const children: OpenedChild[] = [];
        const tag = stack.tag.substring(1);
        for (let j = nodes.length - 1; j >= 0; j--) {
          const node = nodes[j];

          if (node.isOpened && node.type === "tag" && node.tag === tag) {
            for (const child of children) {
              node.children = [child, ...node.children];
              child.parent = node;
            }
            delete node.isOpened;
            break;
          }

          if (!node.parent) {
            children.push(node);
          }
        }
      }
    }

    stacks = getNodes(str, stacks[stacks.length - 1].endIndex);
  }

  for (const node of nodes) {
    // if node is opened, set empty closer
    if (node.type === "tag" && node.isOpened) {
      node.closer = "";
    }

    // remove unused properties
    delete node.isOpened;
  }

  // create root node
  const root: TreeRoot = {
    type: "root",
    // find nodes without parent nodes
    children: nodes.filter((node) => !node.parent) as TreeChild[],
  };

  // set parent to root children
  for (const child of root.children) {
    child.parent = root;
  }

  return root;
}

function getChildren<T extends TreeParent, U>(
  root: T,
  callback: (child: TreeChild, index: number, root: T) => U
) {
  const result: U[] = [];

  let index = 0;

  const func = function (parent: TreeParent) {
    for (const child of parent.children) {
      result.push(callback(child, index++, root));
      if (child.type === "tag") {
        func(child);
      }
    }
  };

  func(root);

  return result;
}

function findChild<T extends TreeParent>(
  root: T,
  callback: (child: TreeChild, index: number, root: T) => any
) {
  let index = 0;

  const func = function (parent: TreeParent): TreeChild | undefined {
    for (const child of parent.children) {
      if (callback(child, index++, root)) {
        return child;
      }
      if (child.type === "tag") {
        const grandchild = func(child);
        if (grandchild) {
          return grandchild;
        }
      }
    }
  };

  return func(root);
}

function findChildren<T extends TreeParent>(
  root: T,
  callback: (child: TreeChild, index: number, root: T) => any
) {
  const result: TreeChild[] = [];

  let index = 0;

  const func = function (parent: TreeParent) {
    for (const child of parent.children) {
      if (callback(child, index++, root)) {
        result.push(child);
      }
      if (child.type === "tag") {
        func(child);
      }
    }
  };

  func(root);

  return result;
}

function getParents<T extends TreeChild, U>(
  leaf: T,
  callback: (parent: TreeParent, index: number, leaf: T) => U
) {
  const result: U[] = [];

  let index = 0;

  const func = function (child: TreeChild) {
    if (child.parent) {
      result.push(callback(child.parent, index++, leaf));
      if (child.parent.type !== "root") {
        func(child.parent);
      }
    }
  };

  func(leaf);

  return result;
}

function findParent<T extends TreeChild>(
  leaf: T,
  callback: (parent: TreeParent, index: number, leaf: T) => any
) {
  let index = 0;

  const func = function (child: TreeChild): TreeNode | undefined {
    if (child.parent) {
      if (callback(child.parent, index++, leaf)) {
        return child.parent;
      }
      if (child.parent.type !== "root") {
        func(child.parent);
      }
    }
  };

  return func(leaf);
}

function findParents<T extends TreeChild>(
  leaf: T,
  callback: (parent: TreeParent, index: number, leaf: T) => any
) {
  const result: TreeParent[] = [];

  let index = 0;

  const func = function (child: TreeChild) {
    if (child.parent) {
      if (callback(child.parent, index++, leaf)) {
        result.push(child.parent);
      }
      if (child.parent.type !== "root") {
        func(child.parent);
      }
    }
  };

  func(leaf);

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

function getContent(node: TreeNode): string {
  if (node.type === "text" || node.type === "comment") {
    return node.content;
  } // root or tag
  else {
    let acc = "";
    const children = findChildren(node, (child) => child.type === "text");
    for (const child of children) {
      acc += child.content;
    }
    return acc;
  }
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

  getChildren<U>(
    callback: <T extends TreeParent>(
      child: TreeChild,
      index: number,
      root: T
    ) => U
  ): U[] {
    if (this.node.type === "root" || this.node.type === "tag") {
      return getChildren(this.node, callback);
    } else {
      return [];
    }
  }
  findChild(
    callback: <T extends TreeParent>(
      child: TreeChild,
      index: number,
      root: T
    ) => any
  ) {
    if (this.node.type === "root" || this.node.type === "tag") {
      return findChild(this.node, callback);
    }
  }
  findChildren(
    callback: <T extends TreeParent>(
      child: TreeChild,
      index: number,
      root: T
    ) => any
  ) {
    if (this.node.type === "root" || this.node.type === "tag") {
      return findChildren(this.node, callback);
    } else {
      return [];
    }
  }
  getParents<U>(
    callback: <T extends TreeChild>(
      parent: TreeParent,
      index: number,
      leaf: T
    ) => U
  ): U[] {
    if (
      this.node.type === "tag" ||
      this.node.type === "text" ||
      this.node.type === "comment"
    ) {
      return getParents(this.node, callback);
    } else {
      return [];
    }
  }
  findParent(
    callback: <T extends TreeChild>(
      parent: TreeParent,
      index: number,
      leaf: T
    ) => any
  ) {
    if (
      this.node.type === "tag" ||
      this.node.type === "text" ||
      this.node.type === "comment"
    ) {
      return findParent(this.node, callback);
    }
  }
  findParents(
    callback: <T extends TreeChild>(
      parent: TreeParent,
      index: number,
      leaf: T
    ) => any
  ) {
    if (
      this.node.type === "tag" ||
      this.node.type === "text" ||
      this.node.type === "comment"
    ) {
      return findParents(this.node, callback);
    } else {
      return [];
    }
  }

  getContent() {
    return getContent(this.node);
  }
  toString() {
    return stringify(this.node);
  }

  static parse = parse;
  static stringify = stringify;

  static getChildren = getChildren;
  static findChild = findChild;
  static findChildren = findChildren;

  static getParents = getParents;
  static findParent = findParent;
  static findParents = findParents;

  static getContent = getContent;
}
