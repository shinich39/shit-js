type Text = {
  id: number,
  depth: number,
  type: "text",
  content: string,
  attributes: Record<string, any>,
  parents: number[],
  children: number[],
}

type Tag = {
  id: number,
  depth: number,
  type: "tag",
  tag: string,
  closer?: string,
  attributes: Record<string, any>,
  parents: number[],
  children: number[],
}

type Comment = {
  id: number,
  depth: number,
  type: "comment",
  content: string,
  attributes: Record<string, any>,
  parents: number[],
  children: number[],
}

export function parseDOM(str: string) {

  const stacks: (
    (Tag|Text|Comment) & 
    { isClosed?: boolean }
  )[] = [];

  const getIndex = function(src: string, target: string, i: number) {
    let quote = null;
    while(i < src.length) {
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
  }
  /**
   * @param src without angle brackets <>
   * 
   * div style="" onChange="" controls hidden
   */
  const parseTag = function(src: string) {
    // normalize
    src = src.trim();

    let isClosing = false;
    let closer = undefined;

    if (src[0] === "/") {
      isClosing = true;
      src = src.substring(1);
    } else if (
      src[src.length - 1] === "/" ||
      // https://www.w3schools.com/xml/xml_syntax.asp
      src[src.length - 1] === "?"
    ) {
      // self-closing tag
      closer = src[src.length - 1];
      src = src.substring(0, src.length - 1);
    }
    
    // 'div' 'style=""' 'onChange=""' 'controls' 'hidden'
    const parts: string[] = [];

    let offset = 0, 
        i = getIndex(src, " ", offset);
    while(i > -1) {
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
    const attrs: Record<string, string|boolean> = {};

    // parts[0] is tag
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const sepIndex = part.indexOf("=");
      if (sepIndex === -1) {
        attrs[part] = true;
      } else {
        // remove quotes
        attrs[part.substring(0, sepIndex)] = part.substring(sepIndex+2, part.length - 1);
      }
    }

    return {
      isClosing,
      closer,
      tag: parts[0],
      attributes: attrs,
    };
  }

  let i = 0;
  while(i < str.length) {

    let j = getIndex(str, "<", i);

    // text
    const text = str.substring(i, j > -1 ? j : undefined);
    if (text.length > 0) {
      stacks.push({
        isClosed: true,
        depth: 0,
        id: stacks.length,
        type: "text",
        content: text,
        attributes: {},
        parents: [],
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
        id: stacks.length,
        type: "comment",
        content: str.substring(j + 4, k),
        attributes: {},
        parents: [],
        children: [],
      });

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

      stacks.push({
        isClosed: true,
        depth: 0,
        id: stacks.length,
        type: "tag",
        tag: "script",
        attributes: parseTag(str.substring(j + 1, k)).attributes,
        parents: [],
        children: [stacks.length + 1],
      }, {
        isClosed: true,
        depth: 1,
        id: stacks.length + 1,
        type: "text",
        content: str.substring(k + 1, l),
        attributes: {},
        parents: [stacks.length],
        children: [],
      });

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

      stacks.push({
        isClosed: true,
        depth: 0,
        id: stacks.length,
        type: "tag",
        tag: "style",
        attributes: parseTag(str.substring(j + 1, k)).attributes,
        parents: [],
        children: [stacks.length + 1],
      }, {
        isClosed: true,
        depth: 1,
        id: stacks.length + 1,
        type: "text",
        content: str.substring(k + 1, l),
        attributes: {},
        parents: [stacks.length],
        children: [],
      });

      i = l + 8;

      continue;
    }

    // normal tag
    i = j;
    j = getIndex(str, ">", i);
    
    if (j === -1) {
      throw new Error(`Invalid argument: \>(closing bracket) not found`);
    }

    const { isClosing, closer, tag, attributes } = parseTag(str.substring(i + 1, j));
    
    if (isClosing) {
      // find unclosed opening tag
      const children: (Tag|Text|Comment)[] = [];
      for (let l = stacks.length - 1; l >= 0; l--) {
        const elem = stacks[l];

        // found opening tag
        if (
          elem.isClosed === false && 
          elem.type === "tag" &&
          elem.tag === tag
        ) {
          for (const child of children) {
            elem.children.push(child.id);
            child.parents.unshift(elem.id);
          }
          elem.isClosed = true;
          break;
        }

        if (elem.depth === 0) {
          children.push(elem);
        }

        elem.isClosed = true;
        elem.depth++;
      }
    } // opening tag
    else {
      stacks.push({
        isClosed: !!closer,
        depth: 0,
        id: stacks.length,
        type: "tag",
        tag,
        closer,
        attributes,
        parents: [],
        children: [stacks.length + 1],
      });
    }

    i = j + 1;
  }

  for (const elem of stacks) {
    delete elem.isClosed;
  }

  return stacks as (Tag|Text|Comment)[];
}