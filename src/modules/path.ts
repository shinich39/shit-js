export function parsePath(...args: string[]) {
  const parts: string[] = args
    .join("/")
    .split(/[\\/]+/)
    .filter((p) => p);

  const basename = parts[parts.length - 1] || "";

  const dotIndex = basename.lastIndexOf(".");

  const extname = dotIndex > -1 ? basename.substring(dotIndex) : "";

  const filename = dotIndex > -1 ? basename.substring(0, dotIndex) : basename;

  const dirname =
    parts.length > 1 ? parts.slice(0, parts.length - 1).join("/") : "";

  return {
    parts,
    basename,
    extname,
    filename,
    dirname,
  };
}

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
  let a = normalize(from).split("/").filter(Boolean);
  let b = normalize(to).split("/").filter(Boolean);

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
