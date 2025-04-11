import { escapeXML, unescapeXML } from "./string";

export type TTree = {
  map: WeakSet<TNode>;
  nodes: TNode[];
};

export type TNode = TText | TComment | TTag;

export type TTag = {
  parent?: TTag;
  depth: number;
  type: "tag";
  tag: string;
  closer?: string;
  attrs: Record<string, boolean | string>;
  children: TNode[];
};

export type TText = {
  parent?: TTag;
  depth: number;
  type: "text";
  content: string;
};

export type TComment = {
  parent?: TTag;
  depth: number;
  type: "comment";
  content: string;
};

type Stack =
  | {
      startIndex: number;
      endIndex: number;
      type: "text";
      content: string;
    }
  | {
      startIndex: number;
      endIndex: number;
      type: "comment";
      content: string;
    }
  | {
      startIndex: number;
      endIndex: number;
      type: "tag";
      closer?: string;
      tag: string;
      attrs?: Record<string, boolean | string>;
    };

export class Tree implements TTree {
  map: WeakSet<TNode>;
  nodes: TNode[];

  constructor(str: string) {
    this.map = new WeakSet();
    this.nodes = Tree.parse(str);
  }

  set(targetNode: TTag, ...newNodes: TNode[]) {
    for (const nn of newNodes) {
      if (this.map.has(nn)) {
        throw new Error("Node already exists");
      }
    }
    for (const node of this.nodes) {
      if (node == targetNode) {
        for (const child of node.children) {
          this.remove(child);
        }
        for (const nn of newNodes) {
          node.children.push(nn);
          this.nodes.push(nn);
          nn.depth = node.depth + 1;
          nn.parent = node;
        }
        return true;
      }
    }
    return false;
  }

  add(targetNode: TTag, ...newNodes: TNode[]) {
    for (const nn of newNodes) {
      if (this.map.has(nn)) {
        throw new Error("Node already exists");
      }
    }
    for (const node of this.nodes) {
      if (node == targetNode) {
        for (const nn of newNodes) {
          node.children.push(nn);
          this.nodes.push(nn);
          nn.depth = node.depth + 1;
          nn.parent = node;
        }
        return true;
      }
    }
    return false;
  }

  remove(targetNode: TNode) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] == targetNode) {
        this.nodes.splice(i, 1);
        this.map.delete(targetNode);
        delete targetNode.parent;
        targetNode.depth = 0;
        return true;
      }
    }
    return false;
  }

  toString() {
    return Tree.stringify(this.nodes);
  }

  static parse(str: string): TNode[] {
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

      // remove empty strings
      parts = parts.filter(Boolean);

      let tag = parts.shift();
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

    const getNodes = function (src: string, i: number): Stack[] {
      if (i >= src.length) {
        return [];
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

    const nodes: (TNode & { isOpened?: boolean })[] = [];
    let i = 0,
      stacks = getNodes(str, i);
    while (stacks.length > 0) {
      for (const stack of stacks) {
        if (stack.type === "text") {
          nodes.push({
            depth: 0,
            type: "text",
            content: stack.content,
          });
        } else if (stack.type === "comment") {
          nodes.push({
            depth: 0,
            type: "comment",
            content: stack.content,
          });
        } // opening tag
        else if (stack.tag[0] !== "/") {
          nodes.push({
            isOpened: !stack.closer,
            depth: 0,
            type: "tag",
            tag: stack.tag,
            ...(stack.closer ? { closer: stack.closer } : {}),
            attrs: stack.attrs || {},
            children: [],
          });
        } else {
          const children: (TNode & { isOpened?: boolean })[] = [];
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

            if (node.depth === 0) {
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

    return nodes;
  }

  static stringify(nodes: TNode[]) {
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

    const stringifyNode = function (node: TNode): string {
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
      } else {
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
      }
      return acc;
    };

    let result = "";
    const rootNodes = nodes.filter((node) => node.depth === 0);
    for (const node of rootNodes) {
      result += stringifyNode(node);
    }

    return result;
  }
}
