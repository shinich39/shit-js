/**
 * @example
 * resolvePath("./project/", "abc", "./package.json");
 * // "project/abc/package.json"
 *
 * resolvePath("/project/", "abc");
 * // "/project/abc"
 *
 * resolvePath("/project/", "../abc");
 * // "/abc"
 *
 * resolvePath("/project/", "..", "..");
 * // "/"
 *
 * resolvePath("project/", "..");
 * // ""
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
