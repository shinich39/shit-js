"use strict";
var Shit = (() => {
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
    QueueWorker: () => QueueWorker,
    Quotes: () => Quotes,
    checkBit: () => checkBit,
    clearBit: () => clearBit,
    clone: () => clone,
    debounce: () => debounce,
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
    getRandomFloatWithSeed: () => getRandomFloatWithSeed,
    getRandomInt: () => getRandomInt,
    getRandomIntWithSeed: () => getRandomIntWithSeed,
    getRandomString: () => getRandomString,
    getRelativePath: () => getRelativePath,
    getRootPath: () => getRootPath,
    getStringSize: () => getStringSize,
    getSumValue: () => getSumValue,
    getType: () => getType,
    getUuid: () => getUuid,
    getXorString: () => getXorString,
    groupBy: () => groupBy,
    humanizeFileSize: () => humanizeFileSize,
    isNumeric: () => isNumeric,
    joinPaths: () => joinPaths,
    matchObject: () => matchObject,
    matchStrings: () => matchStrings,
    normalizeString: () => normalizeString,
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
      return;
    }
    const seen = /* @__PURE__ */ new Map();
    let maxValue, maxCount = 0;
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
    return getModeValueWithCount(arr)?.count || 0;
  }
  function getModeValue(arr) {
    return getModeValueWithCount(arr)?.value;
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
  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
  var QueueWorker = class {
    constructor() {
      this.inProgress = false;
      this.queue = [];
      this._n = 0;
    }
    add(func) {
      this.queue.push(func);
      this._n++;
      if (!this.inProgress) {
        this.run();
      }
    }
    async run() {
      this.inProgress = true;
      while (this.queue.length > 0) {
        await this.queue.shift()(this._n - this.queue.length - 1);
      }
      this.inProgress = false;
    }
    async stop() {
      this.queue = [];
      this.inProgress = false;
    }
  };

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
  function mulberry32(seed) {
    let t = seed += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  function getRandomFloatWithSeed(min, max, seed) {
    return mulberry32(seed) * (max - min) + min;
  }
  function getRandomInt(min, max) {
    return Math.floor(getRandomFloat(min, max));
  }
  function getRandomIntWithSeed(min, max, seed) {
    return Math.floor(getRandomFloatWithSeed(min, max, seed));
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
    const func = function(a, b, seen = /* @__PURE__ */ new WeakMap()) {
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
        return func(Array.from(a), Array.from(b), seen);
      }
      if (b instanceof Map) {
        if (!(a instanceof Map) || a.size < b.size) {
          return false;
        }
        for (const [key, value] of b) {
          if (!a.has(key) || !func(a.get(key), value, seen)) {
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
        if (keysA.indexOf(key) === -1 || !func(a[key], b[key], seen)) {
          return false;
        }
      }
      return true;
    };
    return func(obj, query);
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
  function getUuid() {
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
  function getXorString(str, salt) {
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
      // Normalized edit distance (0 = identical, 1 = completely different)
      normalizedDistance: Math.max(from.length, to.length) > 0 ? (insertions + deletions) / Math.max(from.length, to.length) : 0,
      // detailed counts
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
  return __toCommonJS(shit_exports);
})();
