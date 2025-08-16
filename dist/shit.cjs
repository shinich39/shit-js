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

// src/shit.ts
var shit_exports = {};
__export(shit_exports, {
  calcStringSize: () => calcStringSize,
  checkBit: () => checkBit,
  clearBit: () => clearBit,
  clone: () => clone,
  compareObject: () => compareObject,
  compareString: () => compareString,
  findString: () => findString,
  getAdjustedSize: () => getAdjustedSize,
  getAllCombinations: () => getAllCombinations,
  getBaseName: () => getBaseName,
  getClampedNumber: () => getClampedNumber,
  getContainedSize: () => getContainedSize,
  getCoveredSize: () => getCoveredSize,
  getDirName: () => getDirName,
  getExtName: () => getExtName,
  getFileName: () => getFileName,
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
  getRandomChar: () => getRandomChar,
  getRandomFloat: () => getRandomFloat,
  getRandomInt: () => getRandomInt,
  getRandomSeed: () => getRandomSeed,
  getRandomString: () => getRandomString,
  getRelativePath: () => getRelativePath,
  getRootPath: () => getRootPath,
  getSumValue: () => getSumValue,
  getType: () => getType,
  getUUID: () => getUUID,
  getXORString: () => getXORString,
  groupBy: () => groupBy,
  humanizeFileSize: () => humanizeFileSize,
  isNumeric: () => isNumeric,
  joinPaths: () => joinPaths,
  normalizeString: () => normalizeString,
  plotBy: () => plotBy,
  retry: () => retry,
  setBit: () => setBit,
  shuffleArray: () => shuffleArray,
  sleep: () => sleep,
  toBytes: () => toBytes,
  toError: () => toError,
  toFileSize: () => toFileSize,
  toNumber: () => toNumber,
  toRegExp: () => toRegExp,
  toggleBit: () => toggleBit,
  uniqueBy: () => uniqueBy
});
module.exports = __toCommonJS(shit_exports);

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
function getAllCombinations(arr) {
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
function shuffleArray(arr) {
  let i = arr.length;
  while (i > 0) {
    const j = Math.floor(Math.random() * i);
    i--;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function uniqueBy(arr, func) {
  const map = /* @__PURE__ */ new Map();
  for (let i = 0; i < arr.length; i++) {
    const key = func(arr[i], i, arr);
    if (!map.has(key)) {
      map.set(key, arr[i]);
    }
  }
  return Array.from(map.values());
}
function groupBy(arr, func) {
  const group = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i], key = func(item, i, arr);
    if (!group[key]) {
      group[key] = [item];
    } else {
      group[key].push(item);
    }
  }
  return group;
}
function plotBy(...args) {
  if (args.length === 0) {
    return [];
  }
  const indexes = Array(args.length).fill(0);
  const result = [[]];
  for (let i2 = 0; i2 < args.length; i2++) {
    if (args[i2].length === 0) {
      throw new Error(`Invalid argument: argument cannot be empty`);
    }
    result[0].push(indexes[i2]);
  }
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

// src/modules/async.ts
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function retry(func, count, delay) {
  return async function wrapped(...args) {
    let error;
    for (let i = 1; i <= count; i++) {
      try {
        return await func(...args);
      } catch (err) {
        error = err;
        if (i < count) {
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }
    throw error;
  };
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

// src/modules/number.ts
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
  return Math.floor(getRandomFloat(min, max));
}
function getRandomSeed(seed) {
  let t = seed += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
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
function toBytes(num, format) {
  if (format === "Bytes") {
    return num;
  }
  const i = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"].indexOf(format);
  if (i === -1) {
    throw new Error(`Invalid argument: ${format} is not supported format`);
  }
  return num * Math.pow(1024, i + 1);
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
function getContainedSize(sourceWidth, sourceHeight, destinationWidth, destinationHeight) {
  const aspectRatio = sourceWidth / sourceHeight;
  return aspectRatio < destinationWidth / destinationHeight ? [destinationHeight * aspectRatio, destinationHeight] : [destinationWidth, destinationWidth / aspectRatio];
}
function getCoveredSize(sourceWidth, sourceHeight, destinationWidth, destinationHeight) {
  const aspectRatio = sourceWidth / sourceHeight;
  return aspectRatio < destinationWidth / destinationHeight ? [destinationWidth, destinationWidth / aspectRatio] : [destinationHeight * aspectRatio, destinationHeight];
}
function getAdjustedSize(sourceWidth, sourceHeight, maxWidth, maxHeight, minWidth, minHeight) {
  const aspectRatio = sourceWidth / sourceHeight;
  let w = sourceWidth;
  let h = sourceHeight;
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
function compareObject(a, b) {
  const func = function(m, n, seen = /* @__PURE__ */ new WeakMap()) {
    if (Object.is(m, n)) {
      return true;
    }
    if (typeof m !== typeof n) {
      return false;
    }
    if (typeof n !== "object") {
      return m === n;
    }
    if (n === null) {
      return m === null;
    }
    if (seen.has(n)) {
      return seen.get(n) === m;
    }
    seen.set(n, m);
    if (Array.isArray(n)) {
      if (!Array.isArray(m) || m.length < n.length) {
        return false;
      }
      for (const j of n) {
        let isExists = false;
        for (const i of m) {
          if (func(i, j, seen)) {
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
    if (n instanceof Date) {
      if (!(m instanceof Date)) {
        return false;
      }
      return m.valueOf() === n.valueOf();
    }
    if (n instanceof Set) {
      if (!(m instanceof Set) || m.size < n.size) {
        return false;
      }
      return func(Array.from(m), Array.from(n), seen);
    }
    if (n instanceof Map) {
      if (!(m instanceof Map) || m.size < n.size) {
        return false;
      }
      for (const [key, value] of n) {
        if (!m.has(key) || !func(m.get(key), value, seen)) {
          return false;
        }
      }
      return true;
    }
    if (Object.getPrototypeOf(m) !== Object.getPrototypeOf(n)) {
      return false;
    }
    const keysA = Object.keys(m);
    const keysB = Object.keys(n);
    if (keysA.length < keysB.length) {
      return false;
    }
    for (const key of keysB) {
      if (keysA.indexOf(key) === -1 || !func(m[key], n[key], seen)) {
        return false;
      }
    }
    return true;
  };
  return func(a, b);
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
function getBaseName(str) {
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
function getFileName(str) {
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
function getExtName(str) {
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
function getDirName(str) {
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

// src/modules/string.ts
function findString(str, target, fromIndex) {
  if (!fromIndex) {
    fromIndex = 0;
  } else if (fromIndex < 0) {
    fromIndex = str.length - 1 + fromIndex;
  }
  const len = target.length;
  let i = fromIndex, closing = null;
  const match = len === 1 ? () => str[i] === target : () => {
    for (let j = 0; j < len; j++) {
      if (str[i + j] !== target[j]) {
        return false;
      }
    }
    return true;
  };
  while (i < str.length) {
    if (str[i] === "\\") {
      i++;
    } else if (!closing) {
      if (match()) {
        return i;
      }
      if (str[i] === '"' || str[i] === "'") {
        closing = str[i];
      } else if (str[i] === "(") {
        closing = ")";
      } else if (str[i] === "{") {
        closing = "}";
      } else if (str[i] === "[") {
        closing = "]";
      } else if (str[i] === "<") {
        closing = ">";
      }
    } else {
      if (str[i] === closing) {
        closing = null;
      }
    }
    i++;
  }
  return -1;
}
function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function getRandomChar(charset) {
  return charset.charAt(Math.floor(Math.random() * charset.length));
}
function getRandomString(charset, size) {
  let result = "";
  for (let i = 0; i < size; i++) {
    result += getRandomChar(charset);
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
  let score = 0, i = from.length, j = to.length;
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
      score++;
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
  return {
    accuracy: score * 2 / (from.length + to.length),
    score,
    result: result.reverse()
  };
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
function toError(e) {
  if (e instanceof Error) {
    return e;
  }
  if (typeof e === "string") {
    return new Error(e);
  }
  if (typeof e !== "object") {
    return new Error("Unknown Error");
  }
  if (Array.isArray(e)) {
    return new Error("Unknown Error");
  }
  if (!e.name || !e.message) {
    return new Error("Unknown Error");
  }
  const err = new Error();
  if (typeof e.name === "string") {
    err.name = e.name;
  }
  if (typeof e.message === "string") {
    err.message = e.message;
  }
  if (typeof e.stack === "string") {
    err.stack = e.stack;
  }
  return err;
}
