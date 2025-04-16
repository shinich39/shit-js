// src/modules/array.ts
function parseNumbers(arr) {
  if (arr.length === 0) {
    throw new Error(`Invalid argument: arr.length === 0`);
  }
  let max = Number.MIN_SAFE_INTEGER, min = Number.MAX_SAFE_INTEGER, mode = 0, modeCount = 0, sum = 0, seen = {};
  for (const num of arr) {
    if (max < num) {
      max = num;
    }
    if (min > num) {
      min = num;
    }
    if (!seen[num]) {
      seen[num] = 1;
    } else {
      seen[num] += 1;
    }
    if (modeCount < seen[num]) {
      modeCount = seen[num];
      mode = num;
    }
    sum += num;
  }
  return {
    max,
    min,
    sum,
    mean: sum / arr.length,
    // average, arithmetic mean
    mode,
    modeCount
  };
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
function plotBy(...args) {
  if (args.length === 0) {
    return [];
  }
  for (const arg in args) {
    if (arg.length === 0) {
      throw new Error(`Invalid argument: argument cannot be empty`);
    }
  }
  const indexes = Array(args.length).fill(0);
  const result = [args.map((arg, idx) => indexes[idx])];
  let i = args.length - 1;
  while (true) {
    if (indexes[i] < args[i].length - 1) {
      indexes[i] += 1;
      result.push(args.map((arg, idx) => indexes[idx]));
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
function groupBy(arr, func) {
  const group = {};
  for (const obj of arr) {
    const key = func(obj);
    if (!group[key]) {
      group[key] = [obj];
    } else {
      group[key].push(obj);
    }
  }
  return group;
}

// src/modules/async.ts
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/modules/bit.ts
function bitwise(a) {
  return {
    equals: (b) => !!(a & b),
    set: (b) => a |= b,
    unset: (b) => a &= ~b,
    invert: (b) => a ^= b
  };
}

// src/modules/clone.ts
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

// src/modules/string.ts
function getUUID(seed) {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function getRandomCharacter(charset) {
  return charset.charAt(Math.floor(Math.random() * charset.length));
}
function getRandomString(charset, size) {
  let result = "";
  for (let i = 0; i < size; i++) {
    result += getRandomCharacter(charset);
  }
  return result;
}
function getInts(str) {
  return str.match(/([0-9]+)/g)?.map((item) => parseInt(item)) || [];
}
function getFloats(str) {
  return str.match(/[0-9]+(\.[0-9]+)?/g)?.map((item) => parseFloat(item)) || [];
}
function normalizeString(str) {
  return str.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248)).replace(/[^\S\r\n]/g, " ");
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
function escapeXML(str, whitespace = false) {
  str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return whitespace ? str.replace(/ /g, "&nbsp;") : str;
}
function unescapeXML(str) {
  return str.replace(/&nbsp;|&#32;|&#160;/g, " ").replace(/&lt;|&#60;/g, "<").replace(/&gt;|&#62;/g, ">").replace(/&quot;|&#34;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;|&#38;/g, "&");
}
function compareString(from, to) {
  const dp = [];
  for (let i2 = 0; i2 < from.length + 1; i2++) {
    dp.push([]);
    for (let j2 = 0; j2 < from.length + 1; j2++) {
      dp[i2][j2] = 0;
    }
  }
  for (let i2 = 1; i2 <= from.length; i2++) {
    for (let j2 = 1; j2 <= to.length; j2++) {
      if (from[i2 - 1] === to[j2 - 1]) {
        dp[i2][j2] = dp[i2 - 1][j2 - 1] + 1;
      } else {
        dp[i2][j2] = Math.max(dp[i2 - 1][j2], dp[i2][j2 - 1]);
      }
    }
  }
  const result = [];
  let i = from.length, j = to.length;
  while (i > 0 || j > 0) {
    const prev = result[result.length - 1];
    const a = from[i - 1];
    const b = to[j - 1];
    if (i > 0 && j > 0 && a === b) {
      if (prev && prev[0] === 0) {
        prev[1] = a + prev[1];
      } else {
        result.push([0, a]);
      }
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      if (prev && prev[0] === 1) {
        prev[1] = b + prev[1];
      } else {
        result.push([1, b]);
      }
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      if (prev && prev[0] === -1) {
        prev[1] = a + prev[1];
      } else {
        result.push([-1, a]);
      }
      i--;
    }
  }
  return result.reverse();
}

// src/modules/tree.ts
function isParent(node) {
  return node.type === "root" || node.type === "tag";
}
function isChild(node) {
  return node.type === "tag" || node.type === "text" || node.type === "comment";
}
function parse(str) {
  const parseTag = function(src, i2) {
    let m = i2 + 1, n = i2 + 1, parts = [], quote = null;
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
          m = n;
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
    const attrs = {};
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
        attrs[trimmedPart.substring(0, sepIndex)] = trimmedPart.substring(
          sepIndex + 2,
          trimmedPart.length - 1
        );
      }
    }
    return {
      startIndex: i2,
      endIndex: n,
      closer,
      tag,
      attrs
    };
  };
  const getNodes = function(src, i2) {
    if (i2 >= src.length) {
      return;
    }
    const j = src.indexOf("<", i2);
    if (j === -1) {
      return [
        {
          startIndex: i2,
          endIndex: src.length,
          type: "text",
          content: src.substring(i2)
        }
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
          startIndex: i2,
          endIndex: j,
          type: "text",
          content: src.substring(i2, j)
        },
        {
          startIndex: j,
          endIndex: k + 3,
          type: "comment",
          content: src.substring(j + 4, k)
        }
      ];
    }
    for (const [opening, closing] of [
      ["<style", "</style>"],
      ["<script", "<\/script>"]
    ]) {
      if (src.substring(j, j + opening.length) === opening) {
        const k = src.indexOf(closing, j + opening.length);
        if (k === -1) {
          throw new Error(
            `Invalid argument: could not find closing tag "${closing}"`
          );
        }
        const { endIndex: endIndex2, tag: tag2, attrs: attrs2 } = parseTag(src, j);
        return [
          {
            startIndex: i2,
            endIndex: j,
            type: "text",
            content: src.substring(i2, j)
          },
          {
            startIndex: j,
            endIndex: endIndex2,
            type: "tag",
            tag: tag2,
            attrs: attrs2
          },
          {
            startIndex: endIndex2,
            endIndex: k,
            type: "text",
            content: src.substring(endIndex2, k)
          },
          {
            startIndex: k,
            endIndex: k + closing.length,
            type: "tag",
            tag: "/" + tag2
          }
        ];
      }
    }
    const { startIndex, endIndex, tag, closer, attrs } = parseTag(src, j);
    return [
      {
        startIndex: i2,
        endIndex: j,
        type: "text",
        content: src.substring(i2, j)
      },
      {
        startIndex,
        endIndex,
        type: "tag",
        closer,
        tag,
        attrs
      }
    ];
  };
  str = unescapeXML(str);
  const nodes = [];
  let i = 0, stacks = getNodes(str, i);
  while (stacks) {
    for (const stack of stacks) {
      if (stack.type === "text") {
        nodes.push({
          isOpened: false,
          type: "text",
          content: stack.content
        });
      } else if (stack.type === "comment") {
        nodes.push({
          isOpened: false,
          type: "comment",
          content: stack.content
        });
      } else if (stack.tag[0] !== "/") {
        nodes.push({
          isOpened: !stack.closer,
          type: "tag",
          tag: stack.tag,
          ...stack.closer ? { closer: stack.closer } : {},
          attrs: stack.attrs || {},
          children: []
        });
      } else {
        const children = [];
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
    if (node.type === "tag" && node.isOpened) {
      node.closer = "";
    }
    delete node.isOpened;
  }
  const root = {
    type: "root",
    // find nodes without parent nodes
    children: nodes.filter((node) => !node.parent)
  };
  for (const child of root.children) {
    child.parent = root;
  }
  return root;
}
function getChildren(parent, callback) {
  const result = [];
  const func = function(parent2, depth) {
    for (let i = 0; i < parent2.children.length; i++) {
      const child = parent2.children[i];
      result.push(callback(child, depth, i, parent2.children));
      if (child.type === "tag") {
        func(child, depth + 1);
      }
    }
  };
  func(parent, 1);
  return result;
}
function accChildren(parent, callback, initialValue) {
  let result = initialValue;
  const func = function(parent2, depth) {
    for (let i = 0; i < parent2.children.length; i++) {
      const child = parent2.children[i];
      result = callback(result, child, depth, i, parent2.children);
      if (child.type === "tag") {
        func(child, depth + 1);
      }
    }
  };
  func(parent, 1);
  return result;
}
function findChild(parent, callback) {
  const func = function(parent2, depth) {
    for (let i = 0; i < parent2.children.length; i++) {
      const child = parent2.children[i];
      if (callback(child, depth, i, parent2.children)) {
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
function findChildren(parent, callback) {
  const result = [];
  const func = function(parent2, depth) {
    for (let i = 0; i < parent2.children.length; i++) {
      const child = parent2.children[i];
      if (callback(child, depth, i, parent2.children)) {
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
function getParents(child, callback) {
  const result = [];
  const func = function(child2, depth) {
    if (child2.parent) {
      result.push(callback(child2.parent, depth, child2));
      if (child2.parent.type !== "root") {
        func(child2.parent, depth + 1);
      }
    }
  };
  func(child, 1);
  return result;
}
function accParents(child, callback, initialValue) {
  let result = initialValue;
  const func = function(child2, depth) {
    if (child2.parent) {
      if (callback(result, child2.parent, depth, child2)) {
        return child2.parent;
      }
      if (child2.parent.type !== "root") {
        func(child2.parent, depth + 1);
      }
    }
  };
  func(child, 1);
  return result;
}
function findParent(child, callback) {
  const func = function(child2, depth) {
    if (child2.parent) {
      if (callback(child2.parent, depth, child2)) {
        return child2.parent;
      }
      if (child2.parent.type !== "root") {
        func(child2.parent, depth + 1);
      }
    }
  };
  return func(child, 1);
}
function findParents(child, callback) {
  const result = [];
  const func = function(child2, depth) {
    if (child2.parent) {
      if (callback(child2.parent, depth, child2)) {
        result.push(child2.parent);
      }
      if (child2.parent.type !== "root") {
        func(child2.parent, depth + 1);
      }
    }
  };
  func(child, 1);
  return result;
}
function stringify(node) {
  const stringifyAttrs = function(attrs) {
    let acc = "";
    for (const [k, v] of Object.entries(attrs)) {
      if (typeof v === "string") {
        acc += ` ${k}="${v}"`;
      } else if (typeof v === "boolean") {
        if (v) {
          acc += ` ${k}`;
        }
      } else if (typeof v === "object" && typeof v.toString === "function") {
        acc += ` ${k}="${v.toString()}"`;
      }
    }
    return acc;
  };
  const stringifyNode = function(n) {
    let acc = "";
    if (n.type === "text") {
      const parent = n.parent;
      if (parent && parent.type === "tag" && (parent.tag === "script" || parent.tag === "style")) {
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
    } else {
      for (const child of n.children) {
        acc += stringifyNode(child);
      }
    }
    return acc;
  };
  return stringifyNode(node);
}
function getContents(node) {
  const acc = [];
  const func = function(node2) {
    if (node2.type === "text" || node2.type === "comment") {
      acc.push(node2.content);
    } else {
      for (const child of node2.children) {
        func(child);
      }
    }
  };
  func(node);
  return acc;
}
var Tree = class {
  constructor(arg) {
    if (typeof arg === "string") {
      this.node = parse(arg);
    } else if (typeof arg === "object" && ["root", "tag", "text", "comment"].indexOf(arg.type) > -1) {
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
  getChildren(callback) {
    if (isParent(this.node)) {
      return getChildren(this.node, callback);
    } else {
      return [];
    }
  }
  accChildren(callback, initialValue) {
    if (isParent(this.node)) {
      return accChildren(this.node, callback, initialValue);
    } else {
      return initialValue;
    }
  }
  findChild(callback) {
    if (isParent(this.node)) {
      return findChild(this.node, callback);
    }
  }
  findChildren(callback) {
    if (isParent(this.node)) {
      return findChildren(this.node, callback);
    } else {
      return [];
    }
  }
  getParents(callback) {
    if (isChild(this.node)) {
      return getParents(this.node, callback);
    } else {
      return [];
    }
  }
  accParents(callback, initialValue) {
    if (isChild(this.node)) {
      return accParents(this.node, callback, initialValue);
    } else {
      return initialValue;
    }
  }
  findParent(callback) {
    if (isChild(this.node)) {
      return findParent(this.node, callback);
    }
  }
  findParents(callback) {
    if (isChild(this.node)) {
      return findParents(this.node, callback);
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
  static {
    this.isParent = isParent;
  }
  static {
    this.isChild = isChild;
  }
  static {
    this.parse = parse;
  }
  static {
    this.stringify = stringify;
  }
  static {
    this.getContents = getContents;
  }
  static {
    this.getChildren = getChildren;
  }
  static {
    this.accChildren = accChildren;
  }
  static {
    this.findChild = findChild;
  }
  static {
    this.findChildren = findChildren;
  }
  static {
    this.getParents = getParents;
  }
  static {
    this.accParents = accParents;
  }
  static {
    this.findParent = findParent;
  }
  static {
    this.findParents = findParents;
  }
};

// src/modules/encrypt.ts
function xor(str, salt) {
  const l = salt.length;
  if (l === 0) {
    throw new Error(`Invalid argument: salt.length === 0`);
  }
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ salt.charCodeAt(i % l));
  }
  return result;
}

// src/modules/file.ts
function calcStringSize(str) {
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
function convertFileSize(num, from, to) {
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = units.indexOf(from);
  if (i === -1) {
    throw new Error(`Invalid source unit: ${from}`);
  }
  const j = units.indexOf(to);
  if (j === -1) {
    throw new Error(`Invalid destination unit: ${to}`);
  }
  return num * Math.pow(1024, i - j);
}
function humanizeFileSize(num, format) {
  const bytes = convertFileSize(num, format, "Bytes");
  if (bytes === 0) {
    return "0 Bytes";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  return size + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][i];
}

// src/modules/number.ts
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
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

// src/modules/object.ts
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
function compareObject(a, b, seen = /* @__PURE__ */ new WeakMap()) {
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
        if (compareObject(i, j, seen)) {
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
    return compareObject(Array.from(a), Array.from(b), seen);
  }
  if (b instanceof Map) {
    if (!(a instanceof Map) || a.size < b.size) {
      return false;
    }
    for (const [key, value] of b) {
      if (!a.has(key) || !compareObject(a.get(key), value, seen)) {
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
    if (keysA.indexOf(key) === -1 || !compareObject(a[key], b[key], seen)) {
      return false;
    }
  }
  return true;
}

// src/modules/path.ts
function parsePath(...args) {
  const parts = [];
  for (const arg of args) {
    for (const str of arg.split(/[\\/]/)) {
      if (str !== "") {
        parts.push(str);
      }
    }
  }
  const basename = parts[parts.length - 1] || "";
  const dotIndex = basename.lastIndexOf(".");
  const extname = dotIndex > -1 ? basename.substring(dotIndex) : "";
  const filename = dotIndex > -1 ? basename.substring(0, dotIndex) : basename;
  const dirname = parts.length > 0 ? parts.slice(0, parts.length - 1).join("/") : "";
  return {
    parts,
    basename,
    extname,
    filename,
    dirname
  };
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
  let a = normalize(from).split("/").filter(Boolean);
  let b = normalize(to).split("/").filter(Boolean);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  const up = Array(a.length - i).fill("..").join("/");
  const down = b.slice(i).join("/");
  return up + (up && down ? "/" : "") + down;
}

// src/modules/size.ts
function getContainedSize(sw, sh, dw, dh) {
  const ar = sw / sh;
  return ar < dw / dh ? [dh * ar, dh] : [dw, dw / ar];
}
function getCoveredSize(sw, sh, dw, dh) {
  const ar = sw / sh;
  return ar < dw / dh ? [dw, dw / ar] : [dh * ar, dh];
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
export {
  Tree,
  bitwise,
  calcStringSize,
  clone,
  compareObject,
  compareString,
  convertFileSize,
  escapeXML,
  getClampedNumber,
  getContainedSize,
  getCoveredSize,
  getFloats,
  getInts,
  getLoopedNumber,
  getObjectValue,
  getRandomCharacter,
  getRandomNumber,
  getRandomString,
  getRelativePath,
  getType,
  getUUID,
  groupBy,
  humanizeFileSize,
  isNumeric,
  normalizeString,
  parseNumbers,
  parsePath,
  plotBy,
  shuffleArray,
  sleep,
  toNumber,
  toRegExp,
  unescapeXML,
  xor
};
