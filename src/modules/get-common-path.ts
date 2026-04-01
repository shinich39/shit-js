/**
 * @example
 * getCommonPath([
 *   "./project/abc/package.json",
 *   "./project/abc/def/package.json",
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
