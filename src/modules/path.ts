/**
 * @example
 * joinPaths("./project/", "abc", "./package.json"); // "project/abc/package.json"
 */
export function joinPaths(...args: string[]): string {
  const parts = args.join("/").split(/[\\/]+/);
  const resolved: string[] = [];

  for (const part of parts) {
    if (!part || part === ".") {
      continue;
    }

    if (part === "..") {
      if (
        !resolved[resolved.length - 1] ||
        resolved[resolved.length - 1] === ".."
      ) {
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
/**
 * @example
 * getBasename("./project/package.json"); // "package.json"
 * getBasename("./project/package.json", ".json"); // "package"
 */
export function getBasename(str: string, suffix?: string): string {
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
/**
 * @example
 * getExtname("./project/package.json"); // ".json"
 */
export function getExtname(str: string): string {
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
/**
 * @example
 * getFilename("./project/package.json"); // "package"
 */
export function getFilename(str: string): string {
  return getBasename(str, getExtname(str));
}
/**
 * @example
 * getDirname("./project/package.json"); // "./project"
 */
export function getDirname(str: string): string {
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
/**
 * @example
 * getRelativePath("./project/", "./package.json"); // "../package.json"
 */
export function getRelativePath(from: string, to: string): string {
  const normalize = (str: string) => {
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

  // Normalize paths
  const a = normalize(from).split("/").filter(Boolean);
  const b = normalize(to).split("/").filter(Boolean);

  // Find root
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }

  // Get relative paths from root
  const up = Array(a.length - i)
    .fill("..")
    .join("/");

  const down = b.slice(i).join("/");

  // Join up and down paths
  return up + (up && down ? "/" : "") + down;
}
/**
 * @example
 * getRootPath(
 *   "./project/abc/package.json",
 *   "./project/abc/def",
 *   "./project/abc/def/package.json",
 *   "./project/abc/def/ghi/package.json",
 *   "./project/abc/ghi/package.json",
 *   "project/abc/def/ghi/package.json",
 * );
 * // "project/abc"
 */
export function getRootPath(...args: string[]): string {
  if (args.length === 0) {
    return "";
  }

  const parts = args.map((arg) => arg.replace(/^\.\//, "").split(/[\\/]/));

  const resolved: string[] = [];

  let j = 0;
  while (true) {
    let seg: string | null = parts[0][j];

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

export function toSafeFilename(str: string, replacement = "_"): string {
  return str
    // Remove windows restricts specific characters: \ / : * ? " < > |
    .replace(/[\\/:*?"<>|]/g, replacement)
    // Remove control characters: 0x00 ~ 0x1F
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, replacement)
    // Remove trailing dot
    .replace(/[. ]+$/, "")
    || replacement;
}