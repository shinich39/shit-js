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
