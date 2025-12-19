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

  // src/shit.ts
  var shit_exports = {};
  __export(shit_exports, {
    Brackets: () => Brackets,
    Dom: () => Dom,
    QueueWorker: () => QueueWorker,
    Quotes: () => Quotes,
    checkBit: () => checkBit,
    clearBit: () => clearBit,
    clone: () => clone,
    compressLzw: () => compressLzw,
    decompressLzw: () => decompressLzw,
    generateFloat: () => generateFloat,
    generateInt: () => generateInt,
    generateString: () => generateString,
    generateUuid: () => generateUuid,
    generateXor: () => generateXor,
    getAdjustedSize: () => getAdjustedSize,
    getBaseName: () => getBaseName,
    getCases: () => getCases,
    getClampedNumber: () => getClampedNumber,
    getCombinations: () => getCombinations,
    getContainedSize: () => getContainedSize,
    getCoveredSize: () => getCoveredSize,
    getDiffs: () => getDiffs,
    getDirName: () => getDirName,
    getExtName: () => getExtName,
    getFloats: () => getFloats,
    getInts: () => getInts,
    getLengthFromFloat: () => getLengthFromFloat,
    getLengthFromInt: () => getLengthFromInt,
    getLogScore: () => getLogScore,
    getLoopedNumber: () => getLoopedNumber,
    getMaxValue: () => getMaxValue,
    getMeanValue: () => getMeanValue,
    getMinValue: () => getMinValue,
    getModeCount: () => getModeCount,
    getModeValue: () => getModeValue,
    getModeValueWithCount: () => getModeValueWithCount,
    getObjectValue: () => getObjectValue,
    getPowerScore: () => getPowerScore,
    getRelativePath: () => getRelativePath,
    getRootPath: () => getRootPath,
    getStringSize: () => getStringSize,
    getSumValue: () => getSumValue,
    getType: () => getType,
    groupBy: () => groupBy,
    humanizeFileSize: () => humanizeFileSize,
    isNumber: () => isNumber,
    isNumeric: () => isNumeric,
    joinPaths: () => joinPaths,
    matchObject: () => matchObject,
    matchStrings: () => matchStrings,
    parseDate: () => parseDate,
    parseDom: () => parseDom,
    retry: () => retry,
    setBit: () => setBit,
    shuffleArray: () => shuffleArray,
    sleep: () => sleep,
    toBytes: () => toBytes,
    toCamelCase: () => toCamelCase,
    toError: () => toError,
    toFileSize: () => toFileSize,
    toFullWidthString: () => toFullWidthString,
    toHalfWidthString: () => toHalfWidthString,
    toNumber: () => toNumber,
    toPascalCase: () => toPascalCase,
    toRegExp: () => toRegExp,
    toSentenceCase: () => toSentenceCase,
    toSlug: () => toSlug,
    toggleBit: () => toggleBit,
    uniqueBy: () => uniqueBy
  });

  // src/modules/array.ts
  function getMaxValue(arr) {
    return arr.reduce((acc, cur) => {
      return acc > cur ? acc : cur;
    }, Number.MIN_SAFE_INTEGER);
  }
  function getMinValue(arr) {
    return arr.reduce((acc, cur) => {
      return acc < cur ? acc : cur;
    }, Number.MAX_SAFE_INTEGER);
  }
  function getSumValue(arr) {
    return arr.reduce((acc, cur) => acc + cur, 0);
  }
  function getMeanValue(arr) {
    return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
  }
  function getModeValueWithCount(arr) {
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
  function getModeCount(arr) {
    return getModeValueWithCount(arr).count;
  }
  function getModeValue(arr) {
    return getModeValueWithCount(arr).value;
  }
  function getCombinations(arr) {
    const result = [];
    const n = arr.length;
    for (let i = 1; i < 1 << n; i++) {
      const combo = [];
      for (let j = 0; j < n; j++) {
        if (i >> j & 1) {
          combo.push(arr[j]);
        }
      }
      result.push(combo);
    }
    return result;
  }
  function getCases(...args) {
    if (args.length === 0) {
      return [];
    }
    const indexes = Array(args.length).fill(0);
    const result = [[]];
    for (let i2 = 0; i2 < args.length; i2++) {
      if (args[i2].length === 0) {
        throw new Error(`Invalid argument: argument cannot be empty`);
      }
      const item = args[i2][indexes[i2]];
      result[0].push(item);
    }
    let i = args.length - 1;
    while (true) {
      if (indexes[i] < args[i].length - 1) {
        indexes[i] += 1;
        result.push(args.map((arg, idx) => arg[indexes[idx]]));
        i = args.length - 1;
      } else {
        indexes[i] = 0;
        i--;
        if (i < 0) {
          return result;
        }
      }
    }
  }
  function shuffleArray(arr) {
    let i = arr.length;
    while (i > 0) {
      const j = Math.floor(Math.random() * i);
      i--;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function uniqueBy(arr, fn) {
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < arr.length; i++) {
      const key = fn(arr[i], i, arr);
      if (!map.has(key)) {
        map.set(key, arr[i]);
      }
    }
    return Array.from(map.values());
  }
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

  // src/modules/bit.ts
  function checkBit(a, b) {
    return (a & b) !== 0;
  }
  function setBit(a, b) {
    return a | b;
  }
  function clearBit(a, b) {
    return a & ~b;
  }
  function toggleBit(a, b) {
    return a ^ b;
  }

  // src/modules/date.ts
  function parseDate(date) {
    let ensuredDate;
    if (date instanceof Date) {
      ensuredDate = date;
    } else {
      ensuredDate = new Date(date);
    }
    if (isNaN(ensuredDate.getTime())) {
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
    const diffMs = ensuredDate.getTime() - startOfYear.getTime();
    const diffDays = diffMs / 864e5;
    const week = Math.ceil((diffDays + startOfYear.getDay() + 1) / 7);
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
              tail = "<\/script>";
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
    const flush = function() {
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
      const isScript = part.startsWith("<script") && part.endsWith("<\/script>");
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
            new _Dom({
              type: "text",
              tag: "",
              content: src.content,
              attributes: {},
              children: []
            }, this)
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
      const fn = function(child) {
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
      const fn = function(parent) {
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
      return (this.parent?.children || []).filter((sibling) => sibling != this);
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
          continue;
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
      Object.keys(attrs).forEach((k) => this.setAttribute(k, attrs[k]));
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
      const index = this.parent.children.findIndex((child) => child == this);
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
      const index = this.parent.children.findIndex((child) => child == this);
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
        return `<script${attrs}>${this.getContent()}<\/script>`;
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

  // src/modules/lzw.ts
  function compressLzw(input) {
    const dict = {};
    const data = input.split("");
    const result = [];
    let dictSize = 256;
    for (let i = 0; i < 256; i++) {
      dict[String.fromCharCode(i)] = i;
    }
    let w = "";
    for (const c of data) {
      const wc = w + c;
      if (dict[wc]) {
        w = wc;
      } else {
        result.push(dict[w]);
        dict[wc] = dictSize++;
        w = String(c);
      }
    }
    if (w !== "") result.push(dict[w]);
    return result;
  }
  function decompressLzw(compressed) {
    const dict = [];
    let dictSize = 256;
    for (let i = 0; i < 256; i++) {
      dict[i] = String.fromCharCode(i);
    }
    let w = String.fromCharCode(compressed[0]);
    let result = w;
    for (let i = 1; i < compressed.length; i++) {
      const k = compressed[i];
      let entry;
      if (dict[k]) {
        entry = dict[k];
      } else if (k === dictSize) {
        entry = w + w[0];
      } else {
        throw new Error("Invalid LZW code: " + k);
      }
      result += entry;
      dict[dictSize++] = w + entry[0];
      w = entry;
    }
    return result;
  }

  // src/modules/number.ts
  function mulberry32(seed) {
    let t = seed += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function generateFloat(min, max, seed) {
    return typeof seed === "number" ? mulberry32(seed) * (max - min) + min : Math.random() * (max - min) + min;
  }
  function generateInt(min, max, seed) {
    return Math.floor(generateFloat(min, max, seed));
  }
  function getLengthFromInt(num) {
    return Math.log(num) * Math.LOG10E + 1 | 0;
  }
  function getLengthFromFloat(num) {
    return ("" + num).replace(".", "").length;
  }
  function getClampedNumber(num, min, max) {
    return Math.min(max, Math.max(num, min));
  }
  function getLoopedNumber(num, min, max) {
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
  function toBytes(bytes, format) {
    if (format === "Bytes") {
      return bytes;
    }
    const i = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"].indexOf(format);
    if (i === -1) {
      throw new Error(`Invalid argument: ${format} is not supported format`);
    }
    return bytes * Math.pow(1024, i + 1);
  }
  function toFileSize(bytes, format) {
    if (format === "Bytes") {
      return bytes;
    }
    const i = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"].indexOf(format);
    if (i === -1) {
      throw new Error(`Invalid argument: ${format} is not supported format`);
    }
    return bytes * Math.pow(1024, -(i + 1));
  }
  function humanizeFileSize(num, format) {
    const bytes = toBytes(num, format);
    if (bytes === 0) {
      return "0 Bytes";
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(2);
    return size + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i];
  }
  function getContainedSize(srcWidth, srcHeight, dstWidth, dstHeight) {
    const aspectRatio = srcWidth / srcHeight;
    return aspectRatio < dstWidth / dstHeight ? [dstHeight * aspectRatio, dstHeight] : [dstWidth, dstWidth / aspectRatio];
  }
  function getCoveredSize(srcWidth, srcHeight, dstWidth, dstHeight) {
    const aspectRatio = srcWidth / srcHeight;
    return aspectRatio < dstWidth / dstHeight ? [dstWidth, dstWidth / aspectRatio] : [dstHeight * aspectRatio, dstHeight];
  }
  function getAdjustedSize(srcWidth, srcHeight, maxWidth, maxHeight, minWidth, minHeight) {
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
  function getLogScore(total, current) {
    return Math.log(current + 1) / Math.log(total + 1);
  }
  function getPowerScore(total, current, alpha = 0.5) {
    return Math.pow(current, alpha) / Math.pow(total, alpha);
  }

  // src/modules/object.ts
  function clone(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj.source, obj.flags);
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => clone(item));
    }
    return Object.entries(obj).reduce((acc, cur) => {
      acc[cur[0]] = clone(cur[1]);
      return acc;
    }, {});
  }
  function getObjectValue(obj, key) {
    let cur = obj;
    for (const k of key.split(".")) {
      if (typeof cur !== "object" || cur === null) {
        break;
      }
      cur = cur[k];
    }
    return cur;
  }
  function matchObject(obj, query) {
    const fn = function(a, b, seen = /* @__PURE__ */ new WeakMap()) {
      if (Object.is(a, b)) {
        return true;
      }
      if (typeof a !== typeof b) {
        return false;
      }
      if (typeof b !== "object") {
        return a === b;
      }
      if (b === null) {
        return a === null;
      }
      if (seen.has(b)) {
        return seen.get(b) === a;
      }
      seen.set(b, a);
      if (Array.isArray(b)) {
        if (!Array.isArray(a) || a.length < b.length) {
          return false;
        }
        for (const j of b) {
          let isExists = false;
          for (const i of a) {
            if (fn(i, j, seen)) {
              isExists = true;
              break;
            }
          }
          if (!isExists) {
            return false;
          }
        }
        return true;
      }
      if (b instanceof Date) {
        if (!(a instanceof Date)) {
          return false;
        }
        return a.valueOf() === b.valueOf();
      }
      if (b instanceof Set) {
        if (!(a instanceof Set) || a.size < b.size) {
          return false;
        }
        return fn(Array.from(a), Array.from(b), seen);
      }
      if (b instanceof Map) {
        if (!(a instanceof Map) || a.size < b.size) {
          return false;
        }
        for (const [key, value] of b) {
          if (!a.has(key) || !fn(a.get(key), value, seen)) {
            return false;
          }
        }
        return true;
      }
      if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
        return false;
      }
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length < keysB.length) {
        return false;
      }
      for (const key of keysB) {
        if (keysA.indexOf(key) === -1 || !fn(a[key], b[key], seen)) {
          return false;
        }
      }
      return true;
    };
    return fn(obj, query);
  }

  // src/modules/path.ts
  function joinPaths(...args) {
    const parts = args.join("/").split(/[\\/]+/);
    const resolved = [];
    for (const part of parts) {
      if (!part || part === ".") {
        continue;
      }
      if (part === "..") {
        if (!resolved[resolved.length - 1] || resolved[resolved.length - 1] === "..") {
          resolved.push("..");
        } else {
          resolved.pop();
        }
        continue;
      }
      resolved.push(part);
    }
    return resolved.join("/");
  }
  function getBaseName(str, suffix) {
    str = str.replace(/[\\/]$/, "");
    let i = str.length - 1;
    while (i >= 0) {
      if (str[i] === "/" || str[i] === "\\") {
        str = str.substring(i + 1);
        break;
      }
      i--;
    }
    if (suffix) {
      str = str.substring(0, str.length - suffix.length);
    }
    return str;
  }
  function getExtName(str) {
    let i = str.length - 1;
    while (i >= 0) {
      if (str[i] === ".") {
        return str.substring(i);
      }
      if (str[i] === "/" || str[i] === "\\") {
        return "";
      }
      i--;
    }
    return "";
  }
  function getDirName(str) {
    str = str.replace(/[\\/]$/, "");
    let i = str.length - 1;
    while (i >= 0) {
      if (str[i] === "/" || str[i] === "\\") {
        return str.substring(0, i);
      }
      i--;
    }
    return ".";
  }
  function getRelativePath(from, to) {
    const normalize = (str) => {
      str = str.replace(/[\\]/g, "/").replace(/\/$/, "");
      if (str.charAt(0) === "/") {
        throw new Error(`Invalid argument: ${str}`);
      }
      if (str === ".") {
        return str;
      }
      if (str.charAt(0) === "." && str.charAt(1) === "/") {
        return str;
      }
      return "./" + str;
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
  function getRootPath(...args) {
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

  // src/modules/promise.ts
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function retry(fn, count, delay) {
    return async function wrapped(...args) {
      let error;
      for (let i = 1; i <= count; i++) {
        try {
          return await fn(...args);
        } catch (err) {
          error = err;
          if (i < count) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      throw error;
    };
  }
  var QueueWorker = class {
    inProgress;
    queue;
    constructor() {
      this.inProgress = false;
      this.queue = [];
    }
    /**
     * @example
     * worker.add(() => console.log(`Task 0`));
     * worker.add(async () => { await fetch(`/api/data`); })
     */
    add(fn) {
      this.queue.push(fn);
    }
    /**
     * @example
     * const isFirst = !worker.inProgress;
     * await worker.start();
     * if (isFirst) {
     *   // Write code here to running after end of task.
     * }
     */
    async start() {
      if (this.inProgress) {
        return;
      }
      this.inProgress = true;
      while (this.inProgress) {
        const queue = this.queue.shift();
        if (!queue) {
          break;
        }
        await queue();
      }
      this.inProgress = false;
    }
    /**
     * worker.inProgress = false;
     */
    pause() {
      this.inProgress = false;
    }
    /**
     * worker.queue = [];
     */
    clear() {
      this.queue = [];
    }
    /**
     * worker.queue = [];
     * worker.inProgress = false;
     */
    stop() {
      this.clear();
      this.pause();
    }
  };

  // src/modules/string.ts
  var Brackets = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
    "\uFF08": "\uFF09",
    "\uFF3B": "\uFF3D",
    "\uFF5B": "\uFF5D",
    "\uFF1C": "\uFF1E",
    "\u300C": "\u300D",
    "\u300E": "\u300F",
    "\u3010": "\u3011",
    "\u3014": "\u3015",
    "\u3018": "\u3019",
    "\u3016": "\u3017",
    "\u3008": "\u3009",
    "\u300A": "\u300B",
    "\u2768": "\u2769",
    "\u276A": "\u276B",
    "\u2774": "\u2775",
    "\u276C": "\u276D",
    "\u276E": "\u276F",
    "\u2772": "\u2773",
    "\u301A": "\u301B",
    "\uFF62": "\uFF63",
    "\u27E8": "\u27E9",
    "\u2770": "\u2771"
  };
  var Quotes = {
    "'": "'",
    '"': '"',
    "`": "`",
    "\u2018": "\u2019",
    "\u201C": "\u201D",
    "\u201B": "\u201B",
    "\u201F": "\u201F",
    "\u201E": "\u201C",
    "\xAB": "\xBB"
  };
  function toSentenceCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function toSlug(str) {
    return str.toLowerCase().replace(/\s+/g, "-");
  }
  function toCamelCase(str) {
    return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "").replace(/^(.)/, (m) => m.toLowerCase());
  }
  function toPascalCase(str) {
    return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "").replace(/^(.)/, (m) => m.toUpperCase());
  }
  function generateUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  function generateString(charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-", size = 1) {
    let result = "";
    const charsetSize = charset.length;
    for (let i = 0; i < size; i++) {
      result += charset.charAt(Math.floor(Math.random() * charsetSize));
    }
    return result;
  }
  function generateXor(str, salt) {
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
  function getInts(str) {
    return str.match(/([0-9]+)/g)?.map((item) => parseInt(item)) || [];
  }
  function getFloats(str) {
    return str.match(/[0-9]+(\.[0-9]+)?/g)?.map((item) => parseFloat(item)) || [];
  }
  function toHalfWidthString(str) {
    return str.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248)).replace(/[^\S\r\n]/g, " ");
  }
  function toFullWidthString(str) {
    return str.replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 65248)).replace(/ /g, "\u3000");
  }
  function toRegExp(str) {
    const parts = str.split("/");
    if (parts.length < 3) {
      throw new Error(`Invalid argument: ${str}`);
    }
    const flags = parts.pop();
    const pattern = parts.slice(1).join("/");
    return new RegExp(pattern, flags);
  }
  function getDiffs(from, to) {
    const backtrack = function(from2, to2, trace2, d) {
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
  function matchStrings(from, to) {
    const diff = getDiffs(from, to);
    let matches = 0;
    let insertions = 0;
    let deletions = 0;
    for (const [op, str] of diff) {
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
      // Proportion of matching characters
      matchRate: totalOperations > 0 ? matches / totalOperations : 1,
      // Similarity based on longer string
      similarity: Math.max(from.length, to.length) > 0 ? matches / Math.max(from.length, to.length) : 1,
      // Sørensen-dice similarity coefficient
      diceSimilarity: from.length + to.length > 0 ? 2 * matches / (from.length + to.length) : 1,
      // Jaccard similarity coefficient
      jaccardSimilarity: from.length + to.length - matches > 0 ? matches / (from.length + to.length - matches) : 1,
      // Levenshtein distance (edit distance)
      distance: insertions + deletions,
      // Normalized edit distance (0 = identical, 1 = completely different)
      normalizedDistance: Math.max(from.length, to.length) > 0 ? (insertions + deletions) / Math.max(from.length, to.length) : 0,
      // Detailed counts
      matches,
      insertions,
      deletions
    };
  }
  function getStringSize(str) {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code <= 127) {
        result += 1;
      } else if (code <= 2047) {
        result += 2;
      } else if (code <= 65535) {
        result += 3;
      } else {
        result += 4;
      }
    }
    return result;
  }

  // src/modules/type.ts
  function getType(e) {
    if (e === void 0) {
      return "undefined";
    }
    if (e === null) {
      return "null";
    }
    if (Array.isArray(e)) {
      return "array";
    }
    if (e instanceof Date) {
      return "date";
    }
    if (e instanceof RegExp) {
      return "regexp";
    }
    return typeof e;
  }
  function isNumeric(e) {
    return typeof e === "string" && !Number.isNaN(parseFloat(e)) && Number.isFinite(parseFloat(e));
  }
  function isNumber(e) {
    return typeof e === "number" || isNumeric(e);
  }
  function toNumber(e) {
    if (isNumeric(e)) {
      return parseFloat(e);
    }
    if (typeof e === "number") {
      return e;
    }
    if (typeof e === "boolean") {
      return e ? 1 : 0;
    }
    if (!e) {
      return 0;
    }
    throw new Error(`Invalid argument type: ${typeof e}`);
  }
  function toError(err) {
    if (err instanceof Error) {
      return err;
    }
    if (typeof err === "string") {
      return new Error(err);
    }
    if (typeof err === "number") {
      return new Error(
        {
          400: "Bad Request",
          401: "Unauthorized",
          402: "Payment Required",
          403: "Forbidden",
          404: "Not Found",
          405: "Method Not Allowed",
          406: "Not Acceptable",
          408: "Request Timeout",
          409: "Conflict",
          410: "Gone",
          412: "Precondition Failed",
          413: "Payload Too Large",
          415: "Unsupported Media Type",
          418: "I'm a teapot",
          422: "Unprocessable Entity",
          429: "Too Many Requests",
          500: "Internal Server Error",
          501: "Not Implemented",
          502: "Bad Gateway",
          503: "Service Unavailable",
          504: "Gateway Timeout"
        }[err] || "Unexpected Error"
      );
    }
    if (typeof err === "object") {
      const error = new Error(err);
      if (typeof err.name === "string") {
        error.name = err.name;
      }
      if (typeof err.message === "string") {
        error.message = err.message;
      }
      if (typeof err.stack === "string") {
        error.stack = err.stack;
      }
    }
    return new Error("An unexpected error occurred.");
  }
  return __toCommonJS(shit_exports);
})();
