"use strict";
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
  Tree: () => Tree,
  addBits: () => addBits,
  calcStringSize: () => calcStringSize,
  clearBits: () => clearBits,
  clone: () => clone,
  compareObject: () => compareObject,
  compareString: () => compareString,
  convertFileSize: () => convertFileSize,
  escapeXML: () => escapeXML,
  getAdjustedSize: () => getAdjustedSize,
  getBasename: () => getBasename,
  getClampedNumber: () => getClampedNumber,
  getContainedSize: () => getContainedSize,
  getCoveredSize: () => getCoveredSize,
  getDirname: () => getDirname,
  getExtname: () => getExtname,
  getFilename: () => getFilename,
  getFloats: () => getFloats,
  getInts: () => getInts,
  getLoopedNumber: () => getLoopedNumber,
  getMaxValue: () => getMaxValue,
  getMeanValue: () => getMeanValue,
  getMinValue: () => getMinValue,
  getModeCount: () => getModeCount,
  getModeValue: () => getModeValue,
  getModeValueWithCount: () => getModeValueWithCount,
  getObjectValue: () => getObjectValue,
  getRandomCharacter: () => getRandomCharacter,
  getRandomNumber: () => getRandomNumber,
  getRandomString: () => getRandomString,
  getRelativePath: () => getRelativePath,
  getRootPath: () => getRootPath,
  getSumValue: () => getSumValue,
  getType: () => getType,
  getUUID: () => getUUID,
  getXORString: () => getXORString,
  groupBy: () => groupBy,
  hasBits: () => hasBits,
  humanizeFileSize: () => humanizeFileSize,
  invertBits: () => invertBits,
  isNumeric: () => isNumeric,
  joinPaths: () => joinPaths,
  normalizeString: () => normalizeString,
  parse: () => parse,
  plotBy: () => plotBy,
  shuffleArray: () => shuffleArray,
  sleep: () => sleep,
  toNumber: () => toNumber,
  toRegExp: () => toRegExp,
  unescapeXML: () => unescapeXML
});
module.exports = __toCommonJS(index_exports);

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
  if (arr.length === 0) {
    return {
      count: void 0,
      value: void 0
    };
  }
  const seen = {};
  let value, count = 0;
  for (const item of arr) {
    seen[item] = seen[item] ? seen[item] + 1 : 1;
    if (count < seen[item]) {
      count = seen[item];
      value = item;
    }
  }
  return { count, value };
}
function getModeCount(arr) {
  return getModeValueWithCount(arr).count;
}
function getModeValue(arr) {
  return getModeValueWithCount(arr).value;
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

// src/modules/string.ts
function getUUID() {
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
function getXORString(str, salt) {
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
function parseTag(str, fromIndex) {
  let i = fromIndex;
  while (i < str.length) {
    if (str[i] === " " || str[i] === "\n" || str[i] === ">") {
      return i !== fromIndex ? str.substring(fromIndex, i) : void 0;
    }
    i++;
  }
  return;
}
function parseAttrs(str, fromIndex) {
  let i = fromIndex, j = fromIndex, parts = [], quote = null, closer;
  const acc = function(s) {
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
  const attrs = {};
  for (const part of parts) {
    const [key, ...values] = part.split("=");
    if (values.length === 0) {
      attrs[key] = true;
    } else {
      const value = values.join("=");
      if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
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
    attrs
  };
}
function isParent(node) {
  return node.type === "root" || node.type === "tag";
}
function isChild(node) {
  return node.type === "tag" || node.type === "text" || node.type === "comment";
}
function parse(str) {
  str = unescapeXML(str);
  const stacks = [];
  let offset = 0, i = str.indexOf("<", offset);
  const searchOpening = function(n) {
    offset = n;
    i = str.indexOf("<", offset);
  };
  while (offset < str.length) {
    if (i !== offset) {
      const endIndex = i > -1 ? i : str.length;
      stacks.push({
        isClosed: true,
        type: "text",
        content: str.substring(offset, endIndex)
      });
    }
    if (i === -1) {
      break;
    }
    const tag = parseTag(str, i + 1);
    if (!tag) {
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
        content: str.substring(i + 4, j)
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
      const a = {
        isClosed: true,
        type: "tag",
        tag,
        attrs,
        children: []
      };
      const b = {
        isClosed: true,
        type: "text",
        parent: a,
        content: str.substring(endIndex, n)
      };
      a.children.push(b);
      stacks.push(a, b);
      searchOpening(n + 3 + tag.length);
    } else if (tag.startsWith("/")) {
      const _tag = tag.substring(1);
      const children = [];
      for (let n = stacks.length - 1; n >= 0; n--) {
        const stack = stacks[n];
        if (!stack.isClosed && stack.tag === _tag) {
          stack.children = [
            ...children.reverse(),
            ...stack.children
          ];
          for (const child of children) {
            child.parent = stack;
          }
          stack.isClosed = true;
          break;
        }
        if (!stack.parent) {
          children.push(stack);
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
        children: []
      });
      searchOpening(endIndex);
    }
  }
  const root = {
    type: "root",
    children: []
  };
  for (const stack of stacks) {
    if (stack.type === "tag" && !stack.isClosed) {
      stack.closer = "";
      stack.isClosed = true;
    }
    delete stack.isClosed;
    if (!stack.parent) {
      stack.parent = root;
      root.children.push(stack);
    }
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

// src/modules/number.ts
function hasBits(a, b) {
  return !!(a & b);
}
function addBits(a, b) {
  return a | b;
}
function clearBits(a, b) {
  return a & ~b;
}
function invertBits(a, b) {
  return a ^ b;
}
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
function getContainedSize(sourceWidth, sourceHeight, destinationWidth, destinationHeight) {
  const ar = sourceWidth / sourceHeight;
  return ar < destinationWidth / destinationHeight ? [destinationHeight * ar, destinationHeight] : [destinationWidth, destinationWidth / ar];
}
function getCoveredSize(sourceWidth, sourceHeight, destinationWidth, destinationHeight) {
  const ar = sourceWidth / sourceHeight;
  return ar < destinationWidth / destinationHeight ? [destinationWidth, destinationWidth / ar] : [destinationHeight * ar, destinationHeight];
}
function getAdjustedSize(sourceWidth, sourceHeight, maxWidth, maxHeight, minWidth, minHeight) {
  const ar = sourceWidth / sourceHeight;
  let w = sourceWidth;
  let h = sourceHeight;
  if (w > maxWidth) {
    w = maxWidth;
    h = maxWidth / ar;
  }
  if (h > maxHeight) {
    h = maxHeight;
    w = maxHeight * ar;
  }
  if (w < minWidth) {
    w = minWidth;
    h = minWidth / ar;
  }
  if (h < minHeight) {
    h = minHeight;
    w = minHeight * ar;
  }
  return [w, h];
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
function getBasename(str) {
  str = str.replace(/[\\/]$/, "");
  let i = str.length - 2;
  while (i >= 0) {
    if (str[i] === "/" || str[i] === "\\") {
      return str.substring(i + 1);
    }
    i--;
  }
  return str;
}
function getFilename(str) {
  str = str.replace(/[\\/]$/, "");
  let i = str.length - 2, offset;
  while (i >= 0) {
    if (!offset && str[i] === ".") {
      offset = i;
      continue;
    }
    if (str[i] === "/" || str[i] === "\\") {
      return str.substring(i + 1, offset);
    }
    i--;
  }
  if (offset) {
    return str.substring(0, offset);
  }
  return str;
}
function getExtname(str) {
  str = str.replace(/[\\/]$/, "");
  let i = str.length - 2;
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
function getDirname(str) {
  let i = str.length - 2;
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
