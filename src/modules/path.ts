/**
 * @example
 * const result = joinPaths("./project/", "abc", "./package.json");
 * // "project/abc/package.json"
 */
export function joinPaths(...args: string[]) {
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
 * const result = getBaseName("./project/package.json");
 * // "package.json"
 * 
 * const result = getBaseName("./project/package.json", ".json");
 * // "package"
 */
export function getBaseName(str: string, suffix?: string) {
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
 * const result = getExtName("./project/package.json");
 * // ".json"
 */
export function getExtName(str: string) {
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
 * const result = getDirName("./project/package.json");
 * // "./project"
 */
export function getDirName(str: string) {
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
 * const result = getRelativePath("./project/", "./package.json");
 * // "../package.json"
 */
export function getRelativePath(from: string, to: string) {
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

  // normalize paths
  const a = normalize(from).split("/").filter(Boolean);
  const b = normalize(to).split("/").filter(Boolean);

  // find root
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }

  // get relative paths from root
  const up = Array(a.length - i)
    .fill("..")
    .join("/");

  const down = b.slice(i).join("/");

  // join up and down paths
  return up + (up && down ? "/" : "") + down;
}
/**
 * @example
 * const result = getRootPath(
 *   "./project/abc/package.json",
 *   "./project/abc/def",
 *   "./project/abc/def/package.json",
 *   "./project/abc/def/ghi/package.json",
 *   "./project/abc/ghi/package.json",
 *   "project/abc/def/ghi/package.json",
 * );
 * // "project/abc"
 */
export function getRootPath(...args: string[]) {
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