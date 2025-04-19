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

export function getBasename(str: string) {
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

export function getFilename(str: string) {
  str = str.replace(/[\\/]$/, "");

  let i = str.length - 2,
    offset;

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

export function getExtname(str: string) {
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

export function getDirname(str: string) {
  let i = str.length - 2;
  while (i >= 0) {
    if (str[i] === "/" || str[i] === "\\") {
      return str.substring(0, i);
    }
    i--;
  }
  return ".";
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
