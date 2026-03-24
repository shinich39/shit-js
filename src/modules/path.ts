/**
 * @example
 * resolvePath("./project/", "abc", "./package.json"); // "project/abc/package.json"
 * resolvePath("/project/", "abc"); // "/project/abc"
 * resolvePath("/project/", "../abc"); // "/abc"
 * resolvePath("/project/", "..", ".."); // "/"
 * resolvePath("project/", ".."); // ""
 */
export function resolvePath(...args: string[]): string {
  const isAbsolute = args[0]?.startsWith("/");
  const parts = args.join("/").split(/[\\/]+/);
  const resolved: string[] = [];

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

/**
 * @example
 * parsePath("./project/abc/package.json");
 * // { dir: "./project/abc", dirs: [".", "project", "abc"], base: "package.json", name: "package", ext: ".json" }
 */
export function parsePath(str: string): {
  dir: string;
  dirs: string[];
  base: string;
  name: string;
  ext: string;
} {
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

/**
 * @param from dir
 * @param to dir or file
 * @example
 * getRelativePath("./project/", "./package.json");                 // "../package.json"
 * getRelativePath("./project/abc", "./project/def/file.json");     // "../def/file.json"
 * getRelativePath("./project/abc", "./project/abc/def/file.json"); // "def/file.json"
 */
export function getRelativePath(from: string, to: string): string {
  const normalize = (str: string) => {
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

  // normalize
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
 * getCommonPath([
 *   "./project/abc/package.json",
 *   "./project/abc/def",
 *   "./project/abc/def/package.json",
 *   "./project/abc/def/ghi/package.json",
 *   "./project/abc/ghi/package.json",
 *   "project/abc/def/ghi/package.json",
 * ]);
 * // "project/abc"
 */
export function getCommonPath(args: string[]): string {
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
