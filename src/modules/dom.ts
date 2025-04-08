import { escapeXML, unescapeXML } from "./string";

export type ShitText = {
  parent?: ShitNode;
  depth: number;
  type: "text";
  content: string;
  tag?: undefined | null;
  closer?: undefined | null;
  attributes: Record<string, any>;
  children: ShitNode[];
  [key: string]: any;
};

export type ShitTag = {
  parent?: ShitNode;
  depth: number;
  type: "tag";
  content?: undefined | null;
  tag: string;
  closer?: string;
  attributes: Record<string, any>;
  children: ShitNode[];
  [key: string]: any;
};

export type ShitComment = {
  parent?: ShitNode;
  depth: number;
  type: "comment";
  content: string;
  tag?: undefined | null;
  closer?: undefined | null;
  attributes: Record<string, any>;
  children: ShitNode[];
  [key: string]: any;
};

export type ShitNode = ShitText | ShitTag | ShitComment;

type UnclosedShitText = ShitText & { isClosed: true };
type UnclosedShitTag = ShitTag & { isClosed?: boolean };
type UnclosedShitComment = ShitComment & { isClosed: true };
type UnclosedShitNode = ShitNode & { isClosed?: boolean };

export function parseDOM(str: string) {
  const stacks: UnclosedShitNode[] = [];

  const getIndex = function (src: string, target: string, i: number) {
    let quote = null;
    while (i < src.length) {
      const ch = src[i];
      if (!quote) {
        if (ch === target) {
          return i;
        }
        if (ch === `"` || ch === `'`) {
          quote = ch;
        }
      } else if (ch === "\\") {
        i++;
      } else if (ch === quote) {
        quote = null;
      }
      i++;
    }
    return -1;
  };
  /**
   * @param src without angle brackets \<\>
   *
   * div style="" onChange="" controls hidden
   */
  const parseTag = function (src: string) {
    // normalize
    src = unescapeXML(src.trim());

    let isClosing = false;
    let closer = undefined;
    if (src[0] === "/") {
      isClosing = true;
      src = src.substring(1);
    } else {
      // <img />
      // <?xml version="1.0" encoding="UTF-8"?>
      // https://www.w3schools.com/xml/xml_syntax.asp
      const match = src.match(/\s*[/?]$/);
      if (match) {
        // self-closing tag
        closer = match[0];
        src = src.substring(0, src.length - match[0].length);
      }
    }

    // 'div' 'style=""' 'onChange=""' 'controls' 'hidden'
    const parts: string[] = [];

    let offset = 0,
      i = getIndex(src, " ", offset);
    while (i > -1) {
      // skip multiple whitespace
      if (offset !== i) {
        parts.push(src.substring(offset, i));
      }
      offset = i + 1;
      i = getIndex(src, " ", offset);
    }

    if (offset !== src.length) {
      parts.push(src.substring(offset, src.length));
    }

    // if attribute value is empty, set value to true
    const attrs: Record<string, string | boolean> = {};

    // parts[0] is tag
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const sepIndex = part.indexOf("=");
      if (sepIndex === -1) {
        attrs[part] = true;
      } else {
        // remove quotes
        attrs[part.substring(0, sepIndex)] = part.substring(
          sepIndex + 2,
          part.length - 1
        );
      }
    }

    return {
      isClosing,
      closer,
      tag: parts[0],
      attributes: attrs,
    };
  };

  let i = 0;
  while (i < str.length) {
    let j = getIndex(str, "<", i);

    // text
    const text = str.substring(i, j > -1 ? j : undefined);
    if (text.length > 0) {
      stacks.push({
        isClosed: true,
        depth: 0,
        type: "text",
        content: text,
        attributes: {},
        children: [],
      });
    }

    if (j === -1) {
      break;
    }

    // comment
    if (str.substring(j, j + 4) === "<!--") {
      const k = str.indexOf("-->", j + 4);
      if (k === -1) {
        throw new Error(`Invalid argument: could not find "-->`);
      }

      stacks.push({
        isClosed: true,
        depth: 0,
        type: "comment",
        content: str.substring(j + 4, k),
        attributes: {},
        children: [],
      } as UnclosedShitComment);

      i = k + 3;

      continue;
    }

    // script tag
    if (str.substring(j, j + 7) === "<script") {
      const k = getIndex(str, ">", j + 7);
      if (k === -1) {
        throw new Error(`Invalid argument: could not find ">"`);
      }

      const l = str.indexOf("</script>", k + 1);
      if (l === -1) {
        throw new Error(`Invalid argument: could not find "</script>"`);
      }

      const newTag: UnclosedShitTag = {
        isClosed: true,
        depth: 0,
        type: "tag",
        tag: "script",
        attributes: parseTag(str.substring(j + 1, k)).attributes,
        children: [],
      };

      const newText: UnclosedShitText = {
        isClosed: true,
        depth: 1,
        type: "text",
        content: str.substring(k + 1, l),
        attributes: {},
        parent: newTag,
        children: [],
      };

      newTag.children.push(newText);

      stacks.push(newTag, newText);

      i = l + 9;

      continue;
    }

    // style tag
    if (str.substring(i, i + 6) === "<style") {
      const k = getIndex(str, ">", j + 6);
      if (k === -1) {
        throw new Error(`Invalid argument: could not find ">"`);
      }

      const l = str.indexOf("</style>", k + 1);
      if (l === -1) {
        throw new Error(`Invalid argument: could not find "</style>"`);
      }

      const newTag: UnclosedShitTag = {
        isClosed: true,
        depth: 0,
        type: "tag",
        tag: "style",
        attributes: parseTag(str.substring(j + 1, k)).attributes,
        children: [],
      };

      const newText: UnclosedShitText = {
        isClosed: true,
        depth: 1,
        type: "text",
        content: str.substring(k + 1, l),
        attributes: {},
        parent: newTag,
        children: [],
      };

      newTag.children.push(newText);

      stacks.push(newTag, newText);

      i = l + 8;

      continue;
    }

    // normal tag
    i = j;
    j = getIndex(str, ">", i);

    if (j === -1) {
      throw new Error(`Invalid argument: >(closing bracket) not found`);
    }

    const { isClosing, closer, tag, attributes } = parseTag(
      str.substring(i + 1, j)
    );

    if (isClosing) {
      // find unclosed opening tag
      const children: UnclosedShitNode[] = [];
      for (let l = stacks.length - 1; l >= 0; l--) {
        const node = stacks[l];

        // found opening tag
        if (
          node.isClosed === false &&
          node.type === "tag" &&
          node.tag === tag
        ) {
          for (const child of children) {
            node.children = [child, ...node.children];
            child.parent = node;
          }
          node.isClosed = true;
          break;
        }

        if (node.depth === 0) {
          children.push(node);
        }

        node.isClosed = true;
        node.depth++;
      }
    } // opening tag
    else {
      stacks.push({
        isClosed: !!closer,
        depth: 0,
        type: "tag",
        tag,
        ...(closer ? { closer } : {}),
        attributes,
        children: [],
      } as UnclosedShitTag);
    }

    i = j + 1;
  }

  for (const node of stacks) {
    // if node is not closed, set empty closer
    if (node.type === "tag" && !node.isClosed) {
      node.closer = "";
    }
    delete node.isClosed;
  }

  return stacks as ShitNode[];
}

export function stringifyDOM(nodes: ShitNode[]) {
  const stringifyAttributes = function (attrs: Record<string, any>) {
    let acc = "";
    for (const [k, v] of Object.entries(attrs)) {
      if (typeof v === "string") {
        acc += ` ${k}="${v}"`;
      } else if (typeof v === "boolean") {
        if (v) {
          acc += ` ${k}`;
        }
        // skip false
      } else if (typeof v.toString === "function") {
        acc += ` ${k}="${v.toString()}"`;
      }
    }
    return acc;
  };

  const stringifyNode = function (node: ShitNode): string {
    let acc = "";
    if (node.type === "text") {
      const parentTag = node.parent?.tag;
      // prevent escaping of <script> and <style>
      if (parentTag === "script" || parentTag === "style") {
        acc += node.content;
      } else {
        acc += escapeXML(node.content);
      }
    } else if (node.type === "comment") {
      acc += `<!--${node.content}-->`;
    } else {
      acc += `<${node.tag}${stringifyAttributes(node.attributes)}`;
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
