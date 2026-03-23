// src/modules/bytes.ts
function fromKb(kb) {
  return kb * 1024;
}
function fromMb(mb) {
  return mb * 1024 ** 2;
}
function fromGb(gb) {
  return gb * 1024 ** 3;
}
function fromTb(tb) {
  return tb * 1024 ** 4;
}
function toKb(bytes) {
  return bytes / 1024;
}
function toMb(bytes) {
  return bytes / 1024 ** 2;
}
function toGb(bytes) {
  return bytes / 1024 ** 3;
}
function toTb(bytes) {
  return bytes / 1024 ** 4;
}

// src/modules/chunk-array.ts
function chunkArray(arr, size) {
  return arr.reduce((acc, curr) => {
    if (!acc[acc.length - 1] || acc[acc.length - 1].length >= size) {
      acc.push([curr]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  }, []);
}

// src/modules/clone.ts
function clone(obj) {
  const cache = /* @__PURE__ */ new WeakMap();
  const fn = (o) => {
    if (o === null || typeof o !== "object") {
      return o;
    }
    if (cache.has(o)) {
      return cache.get(o);
    }
    if (o instanceof Date) {
      return new Date(o.getTime());
    }
    if (o instanceof RegExp) {
      return new RegExp(o.source, o.flags);
    }
    if (Array.isArray(o)) {
      return o.map((item) => clone(item));
    }
    const result = Object.create(Object.getPrototypeOf(o));
    cache.set(o, result);
    for (const key of Object.keys(o)) {
      result[key] = fn(o[key]);
    }
    return result;
  };
  return fn(obj);
}

// src/modules/compare-strings.ts
function compareStrings(from, to) {
  const diffs = getDiffs(from, to);
  let matches = 0;
  let insertions = 0;
  let deletions = 0;
  for (const [op, str] of diffs) {
    const len = str.length;
    if (op === 0) {
      matches += len;
    } else if (op === 1) {
      insertions += len;
    } else {
      deletions += len;
    }
  }
  const totalOperations = matches + insertions + deletions;
  return {
    // proportion of matching characters
    matchRate: totalOperations > 0 ? matches / totalOperations : 1,
    // similarity based on longer string
    similarity: Math.max(from.length, to.length) > 0 ? matches / Math.max(from.length, to.length) : 1,
    // sørensen-dice similarity coefficient
    diceSimilarity: from.length + to.length > 0 ? 2 * matches / (from.length + to.length) : 1,
    // jaccard similarity coefficient
    jaccardSimilarity: from.length + to.length - matches > 0 ? matches / (from.length + to.length - matches) : 1,
    // levenshtein distance (edit distance)
    distance: insertions + deletions,
    // normalized edit distance (0 = identical, 1 = completely different)
    normalizedDistance: Math.max(from.length, to.length) > 0 ? (insertions + deletions) / Math.max(from.length, to.length) : 0,
    // detailed counts
    matches,
    insertions,
    deletions
  };
}
function getDiffs(from, to) {
  const backtrack = (from2, to2, trace2, d) => {
    const result = [];
    let x = from2.length;
    let y = to2.length;
    const max2 = from2.length + to2.length;
    let currentOp = null;
    let currentStr = "";
    const push = (op, char) => {
      if (currentOp === op) {
        currentStr = char + currentStr;
      } else {
        if (currentOp !== null && currentStr) {
          result.push([currentOp, currentStr]);
        }
        currentOp = op;
        currentStr = char;
      }
    };
    for (let depth = d; depth >= 0; depth--) {
      const v2 = trace2[depth];
      const k = x - y;
      let prevK;
      if (k === -depth || k !== depth && v2[k - 1 + max2] < v2[k + 1 + max2]) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      const prevX = v2[prevK + max2];
      const prevY = prevX - prevK;
      while (x > prevX && y > prevY) {
        x--;
        y--;
        push(0, from2[x]);
      }
      if (depth === 0) break;
      if (x === prevX) {
        y--;
        push(1, to2[y]);
      } else {
        x--;
        push(-1, from2[x]);
      }
    }
    if (currentOp !== null && currentStr) {
      result.push([currentOp, currentStr]);
    }
    return result.reverse();
  };
  const n = from.length;
  const m = to.length;
  const max = n + m;
  const v = Array(2 * max + 1).fill(0);
  const trace = [];
  for (let d = 0; d <= max; d++) {
    trace.push([...v]);
    for (let k = -d; k <= d; k += 2) {
      let x;
      if (k === -d || k !== d && v[k - 1 + max] < v[k + 1 + max]) {
        x = v[k + 1 + max];
      } else {
        x = v[k - 1 + max] + 1;
      }
      let y = x - k;
      while (x < n && y < m && from[x] === to[y]) {
        x++;
        y++;
      }
      v[k + max] = x;
      if (x >= n && y >= m) {
        return backtrack(from, to, trace, d);
      }
    }
  }
  return [];
}

// src/modules/create-i18n.ts
function createI18n(obj, defaultLocale) {
  return (key, locale) => obj[locale ?? ""]?.[key] ?? obj[defaultLocale]?.[key] ?? key;
}

// src/modules/create-mulberry32.ts
function createMulberry32(initialSeed) {
  let seed = initialSeed;
  const next = () => {
    seed = seed + 1831565813 | 0;
    let t = Math.imul(seed ^ seed >>> 15, seed | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  return {
    float: (min, max) => next() * (max - min) + min,
    int: (min, max) => Math.floor(next() * (max - min) + min)
  };
}

// src/modules/create-queue.ts
function createQueue() {
  let queue = Promise.resolve();
  return (fn) => {
    return new Promise((resolve, reject) => {
      queue = queue.then(fn).then(resolve).catch(reject);
    });
  };
}

// src/modules/create-store.ts
function createStore(initial, handlers) {
  return new Proxy(
    { ...initial },
    {
      set(target, key, value) {
        const typedKey = key;
        const oldValue = target[typedKey];
        if (oldValue !== value) {
          target[typedKey] = value;
          const handler = handlers[typedKey];
          if (handler) {
            handler(oldValue, value);
          }
        }
        return true;
      }
    }
  );
}

// src/modules/create-template.ts
function createTemplate(template) {
  const parts = template.split(/\{([\w.]+)\}/).map((part, i) => i % 2 ? part.split(".") : part);
  return (obj) => {
    let result = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i % 2 === 0) {
        result += part;
        continue;
      }
      let curr = obj;
      for (const key of part) {
        if (curr == null) {
          curr = "";
          break;
        }
        curr = curr[key];
      }
      result += curr ?? "";
    }
    return result;
  };
}

// src/modules/create-typing-delay.ts
function createTypingDelay() {
  const generateBase = (min, max) => Math.random() * (max - min) + min;
  let velocity = 0;
  let drift = 0;
  return (char, speed = 1) => {
    const scale = (v) => v / speed;
    let base;
    if (/[.,!?]/.test(char)) {
      base = generateBase(scale(300), scale(480));
    } else if (char === " ") {
      base = generateBase(scale(180), scale(300));
    } else {
      base = generateBase(scale(85), scale(130));
    }
    velocity += (Math.random() - 0.5) * scale(1.1);
    velocity *= 0.8;
    drift += (Math.random() - 0.5) * scale(0.3);
    drift = Math.max(-scale(4.5), Math.min(drift, scale(4.5)));
    const accel = velocity * scale(4.5) + drift;
    base -= accel;
    return Math.max(scale(45), Math.min(base, scale(520)));
  };
}

// src/modules/dom.ts
function splitTags(str) {
  const result = [];
  let i = 0, buffer = "", head = false, tail = null, quotes = null;
  const flush = () => {
    if (buffer !== "") {
      result.push(buffer);
      buffer = "";
    }
  };
  const join = () => {
    if (buffer !== "") {
      if (result.length > 0) {
        result[result.length - 1] += buffer;
      } else {
        result.push(buffer);
      }
      buffer = "";
    }
  };
  while (i < str.length) {
    const ch = str[i];
    if (!head) {
      if (ch === "<") {
        flush();
        buffer += ch;
        head = true;
      } else {
        buffer += ch;
      }
    } else {
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
            tail = "-->";
          } else if (buffer === "<script") {
            tail = "</script>";
          } else if (buffer === "<style") {
            tail = "</style>";
          }
        }
      } else if (ch === quotes) {
        buffer += ch;
        quotes = null;
      } else {
        buffer += ch;
      }
    }
    i++;
  }
  flush();
  return result;
}
function parseTag(str) {
  const parts = [];
  let isClosing = str[1] === "/", i = isClosing ? 2 : 1, tag = "", buffer = "", quotes = null, closer;
  const flush = () => {
    if (buffer !== "") {
      parts.push(buffer);
      buffer = "";
    }
  };
  const re = /\s|>|\//;
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
  while (i < str.length) {
    const ch = str[i];
    if (ch === "\\") {
      buffer += ch;
    } else if (!quotes) {
      if (ch === ">") {
        if (buffer === "/" || buffer === "?") {
          closer = /\s/.test(str[i - 2]) ? " " + buffer : buffer;
        } else {
          flush();
        }
        break;
      } else if (ch === " " || ch === "\n") {
        flush();
      } else if (ch === `"` || ch === `'`) {
        quotes = ch;
        buffer += ch;
      } else {
        buffer += ch;
      }
    } else if (ch === quotes) {
      quotes = null;
      buffer += ch;
      flush();
    } else {
      buffer += ch;
    }
    i++;
  }
  const attributes = {};
  for (const part of parts) {
    const [key, ...values] = part.split("=");
    if (values.length === 0) {
      attributes[key] = null;
    } else {
      let value = values.join("=");
      attributes[key] = value.substring(1, value.length - 1);
    }
  }
  const endIndex = i + 1;
  return {
    endIndex,
    isClosing,
    tag,
    closer,
    attributes
  };
}
function parseStr(str) {
  const stacks = [
    {
      isClosed: false,
      type: "root",
      children: []
    }
  ];
  const root = stacks[0];
  const parts = splitTags(str);
  for (const part of parts) {
    const isTag = part.startsWith("<") && part.endsWith(">");
    if (!isTag) {
      stacks.push({
        isClosed: true,
        type: "text",
        tag: "",
        content: part,
        attributes: {},
        children: []
      });
      continue;
    }
    const isXMLDeclaration = part.startsWith("<?xml") && part.endsWith("?>");
    if (isXMLDeclaration) {
      const { attributes: attributes2 } = parseTag(part);
      stacks.push({
        isClosed: true,
        type: "tag",
        tag: "?xml",
        closer: "?",
        content: "",
        attributes: attributes2,
        children: []
      });
      continue;
    }
    const isComment = part.startsWith("<!--") && part.endsWith("-->");
    if (isComment) {
      stacks.push({
        isClosed: true,
        type: "comment",
        tag: "",
        content: part.substring(4, part.length - 3),
        attributes: {},
        children: []
      });
      continue;
    }
    const isScript = part.startsWith("<script") && part.endsWith("</script>");
    if (isScript) {
      const { endIndex, attributes: attributes2 } = parseTag(part);
      const content = part.substring(endIndex, part.length - 9);
      stacks.push({
        isClosed: true,
        type: "script",
        tag: "script",
        content,
        attributes: attributes2,
        children: []
      });
      continue;
    }
    const isStyle = part.startsWith("<style") && part.endsWith("</style>");
    if (isStyle) {
      const { endIndex, attributes: attributes2 } = parseTag(part);
      const content = part.substring(endIndex, part.length - 8);
      stacks.push({
        isClosed: false,
        type: "style",
        tag: "style",
        content,
        attributes: attributes2,
        children: []
      });
      continue;
    }
    const { tag, isClosing, closer, attributes } = parseTag(part);
    if (isClosing) {
      const children = [];
      for (let i = stacks.length - 1; i >= 0; i--) {
        const stack = stacks[i];
        if (!stack.isClosed) {
          stack.isClosed = true;
          if (stack.tag === tag) {
            stack.children = children.reverse();
            for (const child of children) {
              child.parent = stack;
            }
            break;
          }
          stack.closer = "";
        }
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
      children: []
    });
  }
  for (const stack of stacks) {
    if (stack.type !== "root" && !stack.parent) {
      stack.parent = root;
      root.children.push(stack);
    }
    if (stack.type === "tag" && !stack.isClosed) {
      stack.closer = "";
    }
    delete stack.isClosed;
    delete stack.depth;
  }
  delete root.isClosed;
  delete root.depth;
  return root;
}
function stringifyAttrs(attrs) {
  let result = "";
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
var parseDom = (src, parent) => new Dom(src, parent);
var Dom = class _Dom {
  parent;
  type;
  tag;
  closer;
  content;
  attributes;
  children;
  constructor(src, parent) {
    this.type = "root";
    this.tag = "";
    this.content = "";
    this.attributes = {};
    this.children = [];
    if (src) {
      this.init(src, parent);
    }
  }
  init(src, parent) {
    if (typeof src === "string") {
      const { children } = _Dom.parse(src);
      this.children = children.map((child) => new _Dom(child, this));
    } else {
      this.parent = parent;
      this.type = src.type;
      this.tag = src.tag || "";
      this.closer = src.closer;
      this.content = src.content || "";
      this.attributes = src.attributes || {};
      if (this.type === "tag" && this.content.length > 0) {
        this.children = [
          new _Dom(
            {
              type: "text",
              tag: "",
              content: src.content,
              attributes: {},
              children: []
            },
            this
          )
        ];
      } else if (src.children) {
        this.children = src.children.map((child) => new _Dom(child, this));
      }
    }
  }
  createChildren(args) {
    const result = [];
    for (const arg of args) {
      if (typeof arg === "string") {
        const { children } = _Dom.parse(arg);
        result.push(...children.map((child) => new _Dom(child, this)));
      } else if (arg.type === "root") {
        result.push(...new _Dom(arg, this).children);
      } else {
        result.push(new _Dom(arg, this));
      }
    }
    return result;
  }
  isRoot() {
    return this.type === "root";
  }
  isComment() {
    return this.type === "comment";
  }
  isStyle() {
    return this.type === "style";
  }
  isScript() {
    return this.type === "script";
  }
  isText() {
    return this.type === "text";
  }
  isTag() {
    return this.type === "tag";
  }
  getParent() {
    return this.parent;
  }
  hasParent() {
    return !!this.parent;
  }
  /**
   * Get all parent elements from target to root
   */
  getParents() {
    const result = [];
    const fn = (child) => {
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
  getChildren() {
    const result = [];
    const fn = (parent) => {
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
  hasChildren() {
    return this.children.length > 1;
  }
  getSiblings() {
    return (this.parent?.children || []).filter((sibling) => sibling !== this);
  }
  hasSiblings() {
    return (this.parent?.children || []).length > 1;
  }
  getTag() {
    return this.tag;
  }
  setTag(value) {
    this.tag = value;
  }
  hasTag() {
    return this.tag !== "";
  }
  getCloser() {
    return this.closer;
  }
  setCloser(value) {
    if (typeof value === "string") {
      this.closer = value;
    } else {
      delete this.closer;
    }
  }
  hasCloser() {
    return typeof this.closer === "string";
  }
  getContent() {
    return this.content || "";
  }
  setContent(value) {
    this.content = value;
  }
  hasContent() {
    return this.content !== "";
  }
  getContents() {
    const result = [];
    for (const child of this.children) {
      if (child.type === "text") {
        result.push(child.content || "");
        continue;
      }
      if (child.type === "tag") {
        result.push(...child.getContents());
      }
    }
    return result;
  }
  getAttribute(key) {
    return this.attributes[key];
  }
  setAttribute(key, value) {
    this.attributes[key] = value;
  }
  hasAttribute(key) {
    return typeof this.attributes[key] !== "undefined";
  }
  getAttributes() {
    return this.attributes;
  }
  setAttributes(attrs) {
    for (const k of Object.keys(attrs)) {
      this.setAttribute(k, attrs[k]);
    }
  }
  hasAttributes(attrs) {
    for (const k of Object.keys(attrs)) {
      if (this.getAttribute(k) !== attrs[k]) {
        return false;
      }
    }
    return true;
  }
  getRoot() {
    const parents = this.getParents();
    const root = parents.pop();
    return root && root.type === "root" ? root : void 0;
  }
  getDepth() {
    return this.getParents().length;
  }
  append(...args) {
    const newChildren = this.createChildren(args);
    for (const el of newChildren) {
      this.children.push(el);
    }
  }
  prepend(...args) {
    const newChildren = this.createChildren(args);
    this.children.splice(0, 0, ...newChildren);
  }
  before(...args) {
    if (!this.parent) {
      throw new Error("Parent not found");
    }
    const index = this.parent.children.indexOf(this);
    if (index === -1) {
      throw new Error("This element not included in it's parent");
    }
    const newSiblings = this.parent.createChildren(args);
    this.parent.children.splice(index, 0, ...newSiblings);
  }
  after(...args) {
    if (!this.parent) {
      throw new Error("Parent not found");
    }
    const index = this.parent.children.indexOf(this);
    if (index === -1) {
      throw new Error("This element not included in its parent");
    }
    const newSiblings = this.parent.createChildren(args);
    this.parent.children.splice(index + 1, 0, ...newSiblings);
  }
  forEach(callback) {
    this.getChildren().forEach(callback);
  }
  find(callback) {
    return this.getChildren().find(callback);
  }
  findLast(callback) {
    return this.getParents().find(callback);
  }
  filter(callback) {
    return this.getChildren().filter(callback);
  }
  map(callback) {
    return this.children.map(callback);
  }
  reduce(callback, initialValue) {
    return this.children.reduce(callback, initialValue);
  }
  reduceRight(callback, initialValue) {
    return this.children.reduceRight(callback, initialValue);
  }
  remove() {
    this.parent?.removeChild(this);
  }
  removeChild(arg) {
    this.removeChildren(arg);
  }
  removeChildren(...args) {
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
  toString() {
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
    return this.hasCloser() ? `<${tag}${attrs}${closer}>` : `<${tag}${attrs}>${children.map((child) => child.toString()).join("")}</${tag}>`;
  }
  /**
   * Get children array contains this element
   */
  toArray() {
    return [this, ...this.getChildren()];
  }
  static parse = parseStr;
};

// src/modules/extract-floats.ts
function extractFloats(str) {
  return str.match(/[0-9]+\.[0-9]+/g)?.map((item) => parseFloat(item)) || [];
}

// src/modules/extract-ints.ts
function extractInts(str) {
  return str.match(/([0-9]+)/g)?.map((item) => parseInt(item, 10)) || [];
}

// src/modules/extract-numbers.ts
function extractNumbers(str) {
  return str.match(/[0-9]+(\.[0-9]+)?/g)?.map((item) => parseFloat(item)) || [];
}

// src/modules/get-combinations.ts
function getCombinations(...arrays) {
  const filtered = arrays.filter((arr) => arr.length > 0);
  if (filtered.length < 1) {
    return [];
  }
  return filtered.reduce(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]]
  );
}

// src/modules/get-common-path.ts
function getCommonPath(args) {
  if (args.length === 0) {
    return "";
  }
  const parts = args.map((arg) => arg.replace(/^\.\//, "").split(/[\\/]/));
  const resolved = [];
  let j = 0;
  while (true) {
    let seg = parts[0][j];
    if (typeof seg !== "string") {
      break;
    }
    for (let i = 1; i < parts.length; i++) {
      if (seg !== parts[i][j]) {
        seg = null;
        break;
      }
    }
    if (seg === null) {
      break;
    }
    resolved.push(seg);
    j++;
  }
  return resolved.join("/");
}

// src/modules/get-diffs.ts
function getDiffs2(from, to) {
  const backtrack = (from2, to2, trace2, d) => {
    const result = [];
    let x = from2.length;
    let y = to2.length;
    const max2 = from2.length + to2.length;
    let currentOp = null;
    let currentStr = "";
    const push = (op, char) => {
      if (currentOp === op) {
        currentStr = char + currentStr;
      } else {
        if (currentOp !== null && currentStr) {
          result.push([currentOp, currentStr]);
        }
        currentOp = op;
        currentStr = char;
      }
    };
    for (let depth = d; depth >= 0; depth--) {
      const v2 = trace2[depth];
      const k = x - y;
      let prevK;
      if (k === -depth || k !== depth && v2[k - 1 + max2] < v2[k + 1 + max2]) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      const prevX = v2[prevK + max2];
      const prevY = prevX - prevK;
      while (x > prevX && y > prevY) {
        x--;
        y--;
        push(0, from2[x]);
      }
      if (depth === 0) break;
      if (x === prevX) {
        y--;
        push(1, to2[y]);
      } else {
        x--;
        push(-1, from2[x]);
      }
    }
    if (currentOp !== null && currentStr) {
      result.push([currentOp, currentStr]);
    }
    return result.reverse();
  };
  const n = from.length;
  const m = to.length;
  const max = n + m;
  const v = Array(2 * max + 1).fill(0);
  const trace = [];
  for (let d = 0; d <= max; d++) {
    trace.push([...v]);
    for (let k = -d; k <= d; k += 2) {
      let x;
      if (k === -d || k !== d && v[k - 1 + max] < v[k + 1 + max]) {
        x = v[k + 1 + max];
      } else {
        x = v[k - 1 + max] + 1;
      }
      let y = x - k;
      while (x < n && y < m && from[x] === to[y]) {
        x++;
        y++;
      }
      v[k + max] = x;
      if (x >= n && y >= m) {
        return backtrack(from, to, trace, d);
      }
    }
  }
  return [];
}

// src/modules/get-relative-path.ts
function getRelativePath(from, to) {
  const normalize = (str) => {
    str = str.replace(/\\/g, "/").replace(/\/$/, "");
    if (str.charAt(0) === "/") {
      throw new Error(`Invalid argument: ${str}`);
    }
    if (str === ".") {
      return str;
    }
    if (str.charAt(0) === "." && str.charAt(1) === "/") {
      return str;
    }
    return `./${str}`;
  };
  const a = normalize(from).split("/").filter(Boolean);
  const b = normalize(to).split("/").filter(Boolean);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  const up = Array(a.length - i).fill("..").join("/");
  const down = b.slice(i).join("/");
  return up + (up && down ? "/" : "") + down;
}

// src/modules/group-by.ts
function groupBy(arr, fn) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = fn(item, i, arr);
    if (!result[key]) {
      result[key] = [item];
    } else {
      result[key].push(item);
    }
  }
  return result;
}

// src/modules/math.ts
function mode(arr) {
  const seen = /* @__PURE__ */ new Map();
  let maxValue;
  let maxCount = 0;
  for (const v of arr) {
    const c = (seen.get(v) || 0) + 1;
    seen.set(v, c);
    if (maxCount < c) {
      maxCount = c;
      maxValue = v;
    }
  }
  return { count: maxCount, value: maxValue };
}
function clamp(num, min, max) {
  return Math.min(max, Math.max(num, min));
}
function wrap(num, min, max) {
  num -= min;
  max -= min;
  if (num < 0) {
    num = num % max + max;
  }
  if (num >= max) {
    num = num % max;
  }
  return num + min;
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// src/modules/parse-date.ts
function parseDate(date) {
  let ensuredDate;
  if (date instanceof Date) {
    ensuredDate = date;
  } else {
    ensuredDate = new Date(date);
  }
  if (Number.isNaN(ensuredDate.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  const YYYY = String(ensuredDate.getFullYear());
  const YY = YYYY.slice(-2);
  const M = String(ensuredDate.getMonth() + 1);
  const MM = M.padStart(2, "0");
  const D = String(ensuredDate.getDate());
  const DD = D.padStart(2, "0");
  const d = String(ensuredDate.getDay());
  const E = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][ensuredDate.getDay()];
  const EEEE = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][ensuredDate.getDay()];
  const H = String(ensuredDate.getHours());
  const HH = H.padStart(2, "0");
  const h = String(ensuredDate.getHours() % 12 || 12);
  const hh = h.padStart(2, "0");
  const m = String(ensuredDate.getMinutes());
  const mm = m.padStart(2, "0");
  const s = String(ensuredDate.getSeconds());
  const ss = s.padStart(2, "0");
  const SSS = String(ensuredDate.getMilliseconds()).padStart(3, "0");
  const A = ensuredDate.getHours() < 12 ? "AM" : "PM";
  const a = A.toLowerCase();
  const Q = String(Math.floor((ensuredDate.getMonth() + 3) / 3));
  const tzOffset = -ensuredDate.getTimezoneOffset();
  const tzSign = tzOffset >= 0 ? "+" : "-";
  const tzHour = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, "0");
  const tzMin = String(Math.abs(tzOffset) % 60).padStart(2, "0");
  const Z = `${tzSign}${tzHour}:${tzMin}`;
  const ZZ = `${tzSign}${tzHour}${tzMin}`;
  const startOfYear = new Date(ensuredDate.getFullYear(), 0, 1);
  const dayOfWeek = startOfYear.getDay() || 7;
  const diffMs = ensuredDate.getTime() - startOfYear.getTime();
  const diffDays = Math.floor(diffMs / 864e5);
  const week = Math.ceil((diffDays + dayOfWeek) / 7);
  const W = String(week);
  const WW = W.padStart(2, "0");
  return {
    YYYY,
    YY,
    M,
    MM,
    D,
    DD,
    d,
    E,
    EEEE,
    H,
    HH,
    h,
    hh,
    m,
    mm,
    s,
    ss,
    SSS,
    A,
    a,
    Q,
    Z,
    ZZ,
    W,
    WW
  };
}

// src/modules/parse-path.ts
function parsePath(str) {
  str = str.replace(/\\/g, "/").replace(/\/+$/, "");
  let dirEnd = -1;
  let extStart = -1;
  for (let i = str.length - 1; i >= 0; i--) {
    const c = str[i];
    if (c === "/") {
      dirEnd = i;
      break;
    }
    if (extStart === -1 && c === "." && i > 0) {
      extStart = i;
    }
  }
  const dir = dirEnd >= 0 ? str.substring(0, dirEnd) : ".";
  const dirs = dir.split("/").filter(Boolean);
  const base = dirEnd >= 0 ? str.substring(dirEnd + 1) : str;
  const ext = extStart > dirEnd ? str.substring(extStart) : "";
  const name = ext ? base.substring(0, base.length - ext.length) : base;
  return { dir, dirs, base, name, ext };
}

// src/modules/pick-by.ts
function pickBy(obj, fn) {
  const result = {};
  for (const key in obj) {
    if (fn(key, obj[key], obj)) {
      result[key] = obj[key];
    }
  }
  return result;
}

// src/modules/random-float.ts
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// src/modules/random-int.ts
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// src/modules/random-string.ts
function randomString(charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", size = 1) {
  const charsetSize = charset.length;
  let result = "";
  for (let i = 0; i < size; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetSize));
  }
  return result;
}

// src/modules/resolve-path.ts
function resolvePath(...args) {
  const isAbsolute = args[0]?.startsWith("/");
  const parts = args.join("/").split(/[\\/]+/);
  const resolved = [];
  for (const part of parts) {
    if (!part || part === ".") {
      continue;
    }
    if (part === "..") {
      if (!resolved[resolved.length - 1] || resolved[resolved.length - 1] === "..") {
        if (!isAbsolute) {
          resolved.push("..");
        }
      } else {
        resolved.pop();
      }
      continue;
    }
    resolved.push(part);
  }
  return (isAbsolute ? "/" : "") + resolved.join("/");
}

// src/modules/retry.ts
async function retry(fn, options) {
  const { count = 3, delay = 1e3, onRetry } = options ?? {};
  let lastError;
  for (let i = 0; i < count; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < count - 1) {
        await onRetry?.(err, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// src/modules/sanitize-filename.ts
function sanitizeFilename(str, replacement = "_") {
  return str.replace(/[\\/:*?"<>|]+/g, replacement).replace(/[\u0000-\u001F\u007F]+/g, replacement).replace(/[. ]+$/, "") || replacement;
}

// src/modules/scale-to-contain.ts
function scaleToContain(srcWidth, srcHeight, dstWidth, dstHeight) {
  const srcAspectRatio = srcWidth / srcHeight;
  const dstAspectRatio = dstWidth / dstHeight;
  if (srcAspectRatio < dstAspectRatio) {
    return [dstHeight * srcAspectRatio, dstHeight];
  } else {
    return [dstWidth, dstWidth / srcAspectRatio];
  }
}

// src/modules/scale-to-cover.ts
function scaleToCover(srcWidth, srcHeight, dstWidth, dstHeight) {
  const srcAspectRatio = srcWidth / srcHeight;
  const dstAspectRatio = dstWidth / dstHeight;
  if (srcAspectRatio < dstAspectRatio) {
    return [dstWidth, dstWidth / srcAspectRatio];
  } else {
    return [dstHeight * srcAspectRatio, dstHeight];
  }
}

// src/modules/scale-to-fit.ts
function scaleToFit(srcWidth, srcHeight, maxWidth, maxHeight, minWidth, minHeight) {
  const aspectRatio = srcWidth / srcHeight;
  let w = srcWidth;
  let h = srcHeight;
  if (w > maxWidth) {
    w = maxWidth;
    h = maxWidth / aspectRatio;
  }
  if (h > maxHeight) {
    h = maxHeight;
    w = maxHeight * aspectRatio;
  }
  if (w < minWidth) {
    w = minWidth;
    h = minWidth / aspectRatio;
  }
  if (h < minHeight) {
    h = minHeight;
    w = minHeight * aspectRatio;
  }
  return [w, h];
}

// src/modules/shuffle.ts
function shuffle(arr) {
  let i = arr.length;
  while (i > 0) {
    const j = Math.floor(Math.random() * i);
    i--;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// src/modules/sleep.ts
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/modules/to-full-width.ts
function toFullWidth(str) {
  return str.replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 65248)).replace(/ /g, "\u3000");
}

// src/modules/to-half-width.ts
function toHalfWidth(str) {
  return str.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248)).replace(/　/g, " ");
}

// src/modules/to-number.ts
function toNumber(e) {
  if (typeof e === "number") {
    return e;
  }
  if (typeof e === "string") {
    const num = Number(e);
    if (!Number.isNaN(num)) {
      return num;
    }
    throw new Error(`Invalid numeric string: ${e}`);
  }
  if (typeof e === "boolean") {
    return e ? 1 : 0;
  }
  if (e === null || e === void 0) {
    return 0;
  }
  throw new Error(`Invalid argument type: ${typeof e}`);
}

// src/modules/to-radians.ts
function toRadians(degree) {
  return degree * (Math.PI / 180);
}

// src/modules/to-regexp.ts
function toRegExp(str) {
  const parts = str.split("/");
  if (parts.length < 3) {
    throw new Error(`Invalid argument: ${str}`);
  }
  const flags = parts.pop();
  const pattern = parts.slice(1).join("/");
  return new RegExp(pattern, flags);
}

// src/modules/unique-by.ts
function uniqueBy(arr, fn) {
  const map = /* @__PURE__ */ new Map();
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = fn(arr[i], i, arr);
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  return Array.from(map.values());
}

// src/modules/xor.ts
function xor(str, salt) {
  const saltSize = salt.length;
  if (saltSize === 0) {
    throw new Error(`Invalid argument: salt.length === 0`);
  }
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ salt.charCodeAt(i % saltSize));
  }
  return result;
}
export {
  Dom,
  chunkArray,
  clamp,
  clone,
  compareStrings,
  createI18n,
  createMulberry32,
  createQueue,
  createStore,
  createTemplate,
  createTypingDelay,
  extractFloats,
  extractInts,
  extractNumbers,
  fromGb,
  fromKb,
  fromMb,
  fromTb,
  getCombinations,
  getCommonPath,
  getDiffs2 as getDiffs,
  getRelativePath,
  groupBy,
  lerp,
  mode,
  parseDate,
  parseDom,
  parsePath,
  pickBy,
  randomFloat,
  randomInt,
  randomString,
  resolvePath,
  retry,
  sanitizeFilename,
  scaleToContain,
  scaleToCover,
  scaleToFit,
  shuffle,
  sleep,
  toFullWidth,
  toGb,
  toHalfWidth,
  toKb,
  toMb,
  toNumber,
  toRadians,
  toRegExp,
  toTb,
  uniqueBy,
  wrap,
  xor
};
//# sourceMappingURL=shit.mjs.map
