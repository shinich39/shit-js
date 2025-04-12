import { escapeXML, unescapeXML } from "./string";

type Stack = StackText | StackComment | StackTag;

interface StackText {
  startIndex: number;
  endIndex: number;
  type: "text";
  content: string;
}

interface StackComment {
  startIndex: number;
  endIndex: number;
  type: "comment";
  content: string;
}

interface StackTag {
  startIndex: number;
  endIndex: number;
  type: "tag";
  closer?: string;
  tag: string;
  attrs?: Record<string, boolean | string>;
}

export type TreeNode = TreeRoot | TreeTag | TreeText | TreeComment;
export type TreeParent = TreeRoot | TreeTag;
export type TreeChild = TreeTag | TreeText | TreeComment;

export interface TreeRoot {
  type: "root";
  depth: number;
  children: TreeChild[];
}

export interface TreeTag {
  type: "tag";
  parent: TreeParent;
  depth: number;
  tag: string;
  closer?: string;
  attrs: Record<string, boolean | string>;
  children: TreeChild[];
}

export interface TreeText {
  type: "text";
  parent: TreeParent;
  depth: number;
  content: string;
}

export interface TreeComment {
  type: "comment";
  parent: TreeParent;
  depth: number;
  content: string;
}

type OpenedTreeNode =
  | OpenedTreeRoot
  | OpenedTreeTag
  | OpenedTreeText
  | OpenedTreeComment;
type OpenedTreeParent = OpenedTreeRoot | OpenedTreeTag;
type OpenedTreeChild = OpenedTreeTag | OpenedTreeText | OpenedTreeComment;

interface OpenedTreeRoot {
  isOpened?: boolean;
  parent?: OpenedTreeParent;
  type: "root";
  depth: number;
  children: OpenedTreeChild[];
}

interface OpenedTreeTag {
  isOpened?: boolean;
  parent?: OpenedTreeParent;
  type: "tag";
  depth: number;
  tag: string;
  closer?: string;
  attrs: Record<string, boolean | string>;
  children: OpenedTreeChild[];
}

interface OpenedTreeText {
  isOpened?: boolean;
  parent?: OpenedTreeParent;
  type: "text";
  depth: number;
  content: string;
}

interface OpenedTreeComment {
  isOpened?: boolean;
  parent?: OpenedTreeParent;
  type: "comment";
  depth: number;
  content: string;
}

function _parse(str: string): TreeRoot {
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

  const getNodes = function (src: string, i: number): Stack[] | undefined {
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

  const nodes: OpenedTreeChild[] = [];
  let i = 0,
    stacks = getNodes(str, i);
  while (stacks) {
    for (const stack of stacks) {
      if (stack.type === "text") {
        nodes.push({
          isOpened: false,
          type: "text",
          depth: 1,
          content: stack.content,
        });
      } else if (stack.type === "comment") {
        nodes.push({
          isOpened: false,
          depth: 1,
          type: "comment",
          content: stack.content,
        });
      } // opening tag
      else if (stack.tag[0] !== "/") {
        nodes.push({
          isOpened: !stack.closer,
          type: "tag",
          depth: 1,
          tag: stack.tag,
          ...(stack.closer ? { closer: stack.closer } : {}),
          attrs: stack.attrs || {},
          children: [],
        });
      } else {
        const children: OpenedTreeChild[] = [];
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

          if (node.depth === 1) {
            children.push(node);
          }

          node.depth++;
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

    // remove "isOpened" property
    delete node.isOpened;
  }

  // create root node
  const root: TreeRoot = {
    type: "root",
    depth: 0,
    children: nodes.filter((node) => node.depth === 1) as TreeChild[],
  };

  // set parent to root children
  for (const child of root.children) {
    child.parent = root;
  }

  return root;
}

function _map(
  root: TreeRoot,
  callback: (node: TreeNode, index: number, root: TreeRoot) => void
) {
  let index = 0;

  const func = function (parent: TreeParent) {
    callback(parent, index++, root);
    for (const child of parent.children) {
      if (child.type === "tag") {
        func(child);
      }
    }
  };

  func(root);
}

function _find(
  root: TreeRoot,
  callback: (node: TreeNode, index: number, root: TreeRoot) => any
) {
  let index = 0;

  const func = function (parent: TreeParent): TreeNode | undefined {
    if (callback(parent, index++, root)) {
      return parent;
    }
    for (const child of parent.children) {
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

function _filter(
  root: TreeRoot,
  callback: (node: TreeNode, index: number, root: TreeRoot) => any
) {
  const result: TreeNode[] = [];

  let index = 0;

  const func = function (parent: TreeParent) {
    if (callback(parent, index++, root)) {
      result.push(parent);
    }
    for (const child of parent.children) {
      if (child.type === "tag") {
        func(child);
      }
    }
  };

  func(root);

  return result;
}

function _stringify(root: TreeRoot): string {
  const stringifyAttributes = function (attrs: Record<string, any>) {
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

  const stringifyNode = function (node: TreeNode): string {
    let acc = "";
    if (node.type === "text") {
      // prevent escaping of <script> and <style>
      const parent = node.parent;
      if (
        parent &&
        parent.type === "tag" &&
        (parent.tag === "script" || parent.tag === "style")
      ) {
        acc += node.content;
      } else {
        acc += escapeXML(node.content);
      }
    } else if (node.type === "comment") {
      acc += `<!--${node.content}-->`;
    } else if (node.type === "tag") {
      acc += `<${node.tag}${stringifyAttributes(node.attrs)}`;
      if (typeof node.closer === "string") {
        acc += `${node.closer}>`;
      } else {
        acc += `>`;
        for (const child of node.children) {
          acc += stringifyNode(child);
        }
        acc += `</${node.tag}>`;
      }
    } // root
    else {
      for (const child of node.children) {
        acc += stringifyNode(child);
      }
    }
    return acc;
  };

  return stringifyNode(root);
}

export class Tree {
  root: TreeRoot;

  constructor(arg: string | TreeRoot) {
    if (typeof arg === "string") {
      this.root = _parse(arg);
    } else if (arg.type === "root") {
      this.root = arg;
    } else {
      throw new Error(`Invalid argument: argument must be string or TreeRoot`);
    }
  }

  map(callback: (node: TreeNode, index: number, root: TreeRoot) => void) {
    return _map(this.root, callback);
  }
  find(callback: (node: TreeNode, index: number, root: TreeRoot) => any) {
    return _find(this.root, callback);
  }
  filter(callback: (node: TreeNode, index: number, root: TreeRoot) => any) {
    return _filter(this.root, callback);
  }
  toString() {
    return _stringify(this.root);
  }

  static parse = _parse;
  static map = _map;
  static find = _find;
  static filter = _filter;
  static stringify = _stringify;
}
