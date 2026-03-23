/**
 * @param from dir
 * @param to dir or file
 * @example
 * getRelativePath("./project/", "./package.json"); // "../package.json"
 * getRelativePath("./project/abc", "./project/def/file.json"); // "../def/file.json"
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
