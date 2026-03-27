"use strict";
var shitJs = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Ast: () => Ast,
    chunkArray: () => chunkArray,
    clamp: () => clamp,
    clone: () => clone,
    compareStrings: () => compareStrings,
    createAst: () => createAst,
    createI18n: () => createI18n,
    createMulberry32: () => createMulberry32,
    createQueue: () => createQueue,
    createStore: () => createStore,
    createTemplate: () => createTemplate,
    createTypingDelay: () => createTypingDelay,
    extractFloats: () => extractFloats,
    extractInts: () => extractInts,
    extractNumbers: () => extractNumbers,
    fromGb: () => fromGb,
    fromKb: () => fromKb,
    fromMb: () => fromMb,
    fromTb: () => fromTb,
    getCommonPath: () => getCommonPath,
    getDiffs: () => getDiffs,
    getRelativePath: () => getRelativePath,
    getStringWidth: () => getStringWidth,
    groupBy: () => groupBy,
    lerp: () => lerp,
    mode: () => mode,
    parseDate: () => parseDate,
    parsePath: () => parsePath,
    pickBy: () => pickBy,
    product: () => product,
    randomFloat: () => randomFloat,
    randomInt: () => randomInt,
    randomString: () => randomString,
    resolvePath: () => resolvePath,
    retry: () => retry,
    sanitizeFilename: () => sanitizeFilename,
    scaleToContain: () => scaleToContain,
    scaleToCover: () => scaleToCover,
    scaleToFit: () => scaleToFit,
    shuffle: () => shuffle,
    sleep: () => sleep,
    toFullWidth: () => toFullWidth,
    toGb: () => toGb,
    toHalfWidth: () => toHalfWidth,
    toKb: () => toKb,
    toMb: () => toMb,
    toNumber: () => toNumber,
    toRadians: () => toRadians,
    toRegExp: () => toRegExp,
    toTb: () => toTb,
    uniqueBy: () => uniqueBy,
    wrap: () => wrap,
    xor: () => xor
  });

  // src/modules/ast.ts
  function isWhitespace(char) {
    switch (char) {
      case " ":
      case "\n":
      case "\r":
      case "	":
        return true;
      default:
        return false;
    }
  }
  function parseEndTag(str, i) {
    let name = "", skip = false;
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
        children: []
      },
      nextIndex: i
    };
  }
  function parseComment(str, i) {
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
        value
      },
      nextIndex: i
    };
  }
  function parseDoctype(str, i) {
    let quotes = null, value = "", depth = 0;
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
        value
      },
      nextIndex: i
    };
  }
  function parseCdata(str, i) {
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
        value
      },
      nextIndex: i
    };
  }
  function parsePi(str, i) {
    let target = "", value = "";
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
        value
      },
      nextIndex: i
    };
  }
  function parseAttributes(str, i) {
    const attributes = {};
    let quotes = null, buffer = "", isClosed = false;
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
    while (i < str.length) {
      const ch = str[i];
      if (quotes) {
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
      nextIndex: i
    };
  }
  function parseScript(str, i) {
    const { attributes, nextIndex } = parseAttributes(str, i);
    i = nextIndex;
    let closingStart = str.indexOf("<\/script", i);
    if (closingStart === -1) {
      closingStart = str.length;
    }
    const value = str.substring(i, closingStart);
    i = closingStart + 8;
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
          children: []
        },
        {
          type: "text",
          isClosed: true,
          isClosing: false,
          value
        },
        {
          type: "element",
          isClosed: true,
          isClosing: true,
          name: "script",
          attributes,
          children: []
        }
      ],
      nextIndex: i
    };
  }
  function parseStyle(str, i) {
    const { attributes, nextIndex } = parseAttributes(str, i);
    i = nextIndex;
    let closingStart = str.indexOf("</style", i);
    if (closingStart === -1) {
      closingStart = str.length;
    }
    const value = str.substring(i, closingStart);
    i = closingStart + 7;
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
          children: []
        },
        {
          type: "text",
          isClosed: true,
          isClosing: false,
          value
        },
        {
          type: "element",
          isClosed: true,
          isClosing: true,
          name: "style",
          attributes,
          children: []
        }
      ],
      nextIndex: i
    };
  }
  function parseStartTag(buffer) {
    let i = 1, name = "";
    while (i < buffer.length) {
      const ch = buffer[i];
      if (isWhitespace(ch)) {
        i++;
        break;
      }
      name += ch;
      i++;
    }
    const { attributes, isClosed, nextIndex } = parseAttributes(buffer, i);
    return {
      token: {
        type: "element",
        isClosed,
        isClosing: false,
        name,
        attributes,
        children: []
      },
      nextIndex
    };
  }
  function normalize(str) {
    return str.replace(/\r\n?/g, "\n");
  }
  function tokenize(str) {
    const tokens = [];
    let i = 0, toggle = false, buffer = "";
    while (i < str.length) {
      const ch = str[i];
      if (!toggle) {
        if (ch === "<") {
          if (buffer) {
            tokens.push({
              type: "text",
              isClosed: true,
              isClosing: false,
              value: buffer
            });
          }
          toggle = true;
          buffer = ch;
          i++;
          continue;
        }
        buffer += ch;
        i++;
        continue;
      }
      if (buffer === "</") {
        const { token, nextIndex } = parseEndTag(str, i);
        tokens.push(token);
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }
      if (buffer === "<!--") {
        const { token, nextIndex } = parseComment(str, i);
        tokens.push(token);
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }
      if (buffer === "<!DOCTYPE" || buffer === "<DOCTYPE") {
        const { token, nextIndex } = parseDoctype(str, i + 1);
        tokens.push(token);
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }
      if (buffer === "<![CDATA[") {
        const { token, nextIndex } = parseCdata(str, i);
        tokens.push(token);
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }
      if (buffer === "<?") {
        const { token, nextIndex } = parsePi(str, i);
        tokens.push(token);
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }
      if (buffer === "<script") {
        const { tokens: tokens2, nextIndex } = parseScript(str, i);
        for (const token of tokens2) {
          tokens2.push(token);
        }
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }
      if (buffer === "<style") {
        const { tokens: tokens2, nextIndex } = parseStyle(str, i);
        for (const token of tokens2) {
          tokens2.push(token);
        }
        i = nextIndex;
        toggle = false;
        buffer = "";
        continue;
      }
      if (ch === ">") {
        const { token } = parseStartTag(buffer);
        tokens.push(token);
        toggle = false;
        buffer = "";
        i++;
        continue;
      }
      buffer += ch;
      i++;
    }
    if (buffer) {
      tokens.push({
        type: "text",
        isClosed: true,
        isClosing: false,
        value: buffer
      });
    }
    return tokens;
  }
  function parseStr(str) {
    str = normalize(str);
    const tokens = tokenize(str);
    const stack = [];
    const root = {
      type: "root",
      children: []
    };
    const nodes = [];
    for (const token of tokens) {
      if (token.type !== "element") {
        nodes.push(token);
        const top2 = stack.length > 0 ? stack[stack.length - 1] : root;
        top2.children.push(token);
        continue;
      }
      if (token.isClosing) {
        while (stack.length > 0) {
          const top2 = stack.pop();
          top2.isClosed = true;
          if (top2.name === token.name) {
            break;
          }
        }
        continue;
      }
      nodes.push(token);
      const top = stack.length > 0 ? stack[stack.length - 1] : root;
      top.children.push(token);
      if (!token.isClosed) {
        stack.push(token);
      }
    }
    for (const node of nodes) {
      delete node.isClosed;
      delete node.isClosing;
    }
    return {
      root,
      nodes
    };
  }
  function stringifyAttrs(attrs) {
    let result = "";
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
  function createChildren(parent, nodes) {
    const result = [];
    for (const node of nodes) {
      if (typeof node === "string") {
        const { root } = Ast.parse(node);
        for (const child of root.children) {
          result.push(new Ast(child, parent));
        }
      } else if (node.type === "root") {
        for (const child of node.children) {
          result.push(new Ast(child, parent));
        }
      } else {
        result.push(new Ast(node, parent));
      }
    }
    return result;
  }
  function createAst(src, parent) {
    return new Ast(src, parent);
  }
  var Ast = class _Ast {
    parent;
    type;
    name;
    value;
    attributes;
    children;
    constructor(src, parent) {
      this.type = "root";
      this.name = "";
      this.value = "";
      this.attributes = {};
      this.children = [];
      if (src) {
        this.init(src, parent);
      }
    }
    static parse = parseStr;
    /**
     * If src is string, always ast.type is root.
     */
    init(src, parent) {
      if (typeof src === "string") {
        const { root } = _Ast.parse(src);
        this.children = root.children.map((child) => new _Ast(child, this));
        return;
      }
      this.parent = parent;
      this.type = src.type;
      this.name = "";
      this.value = "";
      this.attributes = {};
      this.children = [];
      switch (src.type) {
        case "root":
          this.children = src.children.map((child) => new _Ast(child, this));
          break;
        case "element":
          this.name = src.name;
          this.attributes = { ...src.attributes };
          this.children = src.children.map((child) => new _Ast(child, this));
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
    isRoot() {
      return this.type === "root";
    }
    isText() {
      return this.type === "text";
    }
    isElement() {
      return this.type === "element";
    }
    isComment() {
      return this.type === "comment";
    }
    isDoctype() {
      return this.type === "doctype";
    }
    isCdata() {
      return this.type === "cdata";
    }
    isPi() {
      return this.type === "pi";
    }
    isStyle() {
      return this.isElement() && this.name === "style";
    }
    isScript() {
      return this.isElement() && this.name === "script";
    }
    getParent() {
      return this.parent;
    }
    hasParent() {
      return !!this.parent;
    }
    // biome-ignore lint: STFU
    _walk(callback) {
      const stack = [];
      const rootChildren = this.children;
      if (!rootChildren?.length) {
        return;
      }
      for (let i = rootChildren.length - 1; i >= 0; i--) {
        stack.push([rootChildren[i], i, rootChildren]);
      }
      while (stack.length) {
        const [node, index, siblings] = stack.pop();
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
    getAncestors() {
      const result = [];
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
    getDescendants() {
      const result = [];
      this._walk((n) => {
        result.push(n);
      });
      return result;
    }
    hasChildren() {
      return this.children.length > 1;
    }
    getSiblings() {
      return (this.parent?.children || []).filter((sibling) => sibling !== this);
    }
    getPrevSibling() {
      const parentChidlren = this.parent?.children || [];
      const i = parentChidlren.indexOf(this);
      return i === -1 ? void 0 : parentChidlren[i - 1];
    }
    getNextSibling() {
      const parentChidlren = this.parent?.children || [];
      const i = parentChidlren.indexOf(this);
      return i === -1 ? void 0 : parentChidlren[i + 1];
    }
    hasSibling() {
      return (this.parent?.children || []).length > 1;
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
    getValue() {
      const values = [];
      this._walk((n) => {
        if (n.type === "text") {
          values.push(n.value);
        }
      });
      return values.join("");
    }
    getValues() {
      const values = [];
      this._walk((n) => {
        if (n.type === "text") {
          values.push(n.value);
        }
      });
      return values;
    }
    getRoot() {
      const parents = this.getAncestors();
      const root = parents.pop();
      return root && root.type === "root" ? root : void 0;
    }
    getDepth() {
      return this.getAncestors().length;
    }
    append(...nodes) {
      const newChildren = createChildren(this, nodes);
      for (const el of newChildren) {
        this.children.push(el);
      }
    }
    prepend(...nodes) {
      const newChildren = createChildren(this, nodes);
      this.children.splice(0, 0, ...newChildren);
    }
    before(...nodes) {
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
    after(...nodes) {
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
    // biome-ignore lint: STFU
    forEach(callback) {
      this._walk(callback);
    }
    find(callback) {
      let found;
      this._walk((node, index, siblings) => {
        if (callback(node, index, siblings)) {
          found = node;
          return "break";
        }
      });
      return found;
    }
    filter(callback) {
      const result = [];
      this._walk((node, index, siblings) => {
        if (callback(node, index, siblings)) {
          result.push(node);
        }
      });
      return result;
    }
    map(callback) {
      const result = [];
      this._walk((node, index, siblings) => {
        result.push(callback(node, index, siblings));
      });
      return result;
    }
    reduce(callback, initialValue) {
      let acc = initialValue;
      this._walk((node, index, siblings) => {
        acc = callback(acc, node, index, siblings);
      });
      return acc;
    }
    remove() {
      this.parent?.removeChild(this);
    }
    removeChild(node) {
      this.children = this.children.filter((child) => {
        if (child === node) {
          delete child.parent;
          return false;
        } else {
          return true;
        }
      });
    }
    removeChildren(nodes) {
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
     * Convert ast to html string.
     */
    toString() {
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
      const isEmpty = this.children.length === 0;
      const attrs = stringifyAttrs(this.attributes);
      if (isEmpty) {
        return `<${name}${attrs} />`;
      }
      const joinedValue = this.children.map((node) => node.toString()).join("");
      return `<${name}${attrs}>${joinedValue}</${name}>`;
    }
    /**
     * Get all nodes with self
     */
    toArray() {
      return [this, ...this.getDescendants()];
    }
    toObject() {
      const fn = (ast) => {
        const { type, name, value, children, attributes } = ast;
        if (type === "root") {
          return {
            type,
            children: children.map(fn)
          };
        }
        if (type === "doctype") {
          return {
            type,
            value
          };
        }
        if (type === "text") {
          return {
            type,
            value
          };
        }
        if (type === "element") {
          return {
            type,
            name,
            value,
            attributes: { ...attributes },
            children: children.map(fn)
          };
        }
        if (type === "comment") {
          return {
            type,
            value
          };
        }
        if (type === "cdata") {
          return {
            type,
            value
          };
        }
        if (type === "pi") {
          return {
            type,
            name,
            value
          };
        }
        throw new Error(`Invalid ast type: ${type}`);
      };
      return fn(this);
    }
  };

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
    const rand = (min, max) => Math.random() * (max - min) + min;
    let velocity = 0;
    let drift = 0;
    return (char, speed = 1) => {
      const scale = (v) => v / speed;
      let base;
      if (/[.,!?]/.test(char)) {
        base = rand(scale(300), scale(480));
      } else if (char === " ") {
        base = rand(scale(180), scale(300));
      } else {
        base = rand(scale(85), scale(130));
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

  // src/modules/diff.ts
  function getDiffs(from, to) {
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
  function backtrack(from, to, trace, depth) {
    const result = [];
    let x = from.length;
    let y = to.length;
    const max = from.length + to.length;
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
    for (let d = depth; d >= 0; d--) {
      const v = trace[d];
      const k = x - y;
      let prevK;
      if (k === -d || k !== d && v[k - 1 + max] < v[k + 1 + max]) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      const prevX = v[prevK + max];
      const prevY = prevX - prevK;
      while (x > prevX && y > prevY) {
        x--;
        y--;
        push(0, from[x]);
      }
      if (d === 0) break;
      if (x === prevX) {
        y--;
        push(1, to[y]);
      } else {
        x--;
        push(-1, from[x]);
      }
    }
    if (currentOp !== null && currentStr) {
      result.push([currentOp, currentStr]);
    }
    return result.reverse();
  }

  // src/modules/extract-numbers.ts
  function extractNumbers(str) {
    return str.match(/[0-9]+(\.[0-9]+)?/g)?.map((item) => parseFloat(item)) || [];
  }
  function extractFloats(str) {
    return str.match(/[0-9]+\.[0-9]+/g)?.map((item) => parseFloat(item)) || [];
  }
  function extractInts(str) {
    return str.match(/([0-9]+)/g)?.map((item) => parseInt(item, 10)) || [];
  }

  // src/modules/group-by.ts
  function groupBy(arr, fn) {
    const result = {};
    let i = 0;
    for (const item of arr) {
      const key = fn(item, i++);
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

  // src/modules/path.ts
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
  function getRelativePath(from, to) {
    const normalize2 = (str) => {
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
    const a = normalize2(from).split("/").filter(Boolean);
    const b = normalize2(to).split("/").filter(Boolean);
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    const up = Array(a.length - i).fill("..").join("/");
    const down = b.slice(i).join("/");
    return up + (up && down ? "/" : "") + down;
  }
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

  // src/modules/product.ts
  function product(...arrays) {
    const filtered = arrays.filter((arr) => arr.length > 0);
    if (filtered.length < 1) {
      return [];
    }
    return filtered.reduce(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]]
    );
  }

  // src/modules/random.ts
  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  function randomString(charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", size = 1) {
    const charsetSize = charset.length;
    let result = "";
    for (let i = 0; i < size; i++) {
      result += charset.charAt(Math.floor(Math.random() * charsetSize));
    }
    return result;
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

  // src/modules/scale.ts
  function scaleToContain(srcWidth, srcHeight, dstWidth, dstHeight) {
    const srcAspectRatio = srcWidth / srcHeight;
    const dstAspectRatio = dstWidth / dstHeight;
    if (srcAspectRatio < dstAspectRatio) {
      return [dstHeight * srcAspectRatio, dstHeight];
    } else {
      return [dstWidth, dstWidth / srcAspectRatio];
    }
  }
  function scaleToCover(srcWidth, srcHeight, dstWidth, dstHeight) {
    const srcAspectRatio = srcWidth / srcHeight;
    const dstAspectRatio = dstWidth / dstHeight;
    if (srcAspectRatio < dstAspectRatio) {
      return [dstWidth, dstWidth / srcAspectRatio];
    } else {
      return [dstHeight * srcAspectRatio, dstHeight];
    }
  }
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

  // src/modules/string-width.ts
  function getStringWidth(str) {
    let width = 0;
    for (const char of str) {
      const code = char.codePointAt(0);
      if (code === void 0) {
        width += 1;
        continue;
      }
      const isFullWidth = code >= 19968 && code <= 40959 || // CJK Unified Ideographs
      code >= 44032 && code <= 55203 || // Hangul Syllables
      code >= 4352 && code <= 4607 || // Hangul Jamo
      code >= 65281 && code <= 65376 || // Full-width Forms
      code >= 63744 && code <= 64255 || // CJK Compatibility Ideographs
      code >= 12352 && code <= 12543 || // Hiragana / Katakana
      code >= 12288 && code <= 12351 || // CJK Symbols and Punctuation
      code >= 12800 && code <= 13055 || // Enclosed CJK
      code >= 13056 && code <= 13311;
      width += isFullWidth ? 2 : 1;
    }
    return width;
  }
  function toHalfWidth(str) {
    return str.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248)).replace(/　/g, " ");
  }
  function toFullWidth(str) {
    return str.replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 65248)).replace(/ /g, "\u3000");
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
    if (str.startsWith("/")) {
      const patternEnd = str.lastIndexOf("/");
      if (patternEnd === -1) {
        throw new Error("Invalid RegExp literal: missing '/'");
      }
      const pattern = str.substring(1, patternEnd);
      const flags = str.substring(patternEnd + 1);
      return new RegExp(pattern, flags);
    }
    return new RegExp(str);
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
      throw new Error(`The salt must be at least 1.`);
    }
    let result = "";
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ salt.charCodeAt(i % saltSize));
    }
    return result;
  }
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=shit.js.map
