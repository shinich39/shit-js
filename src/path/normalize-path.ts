/**
 * @example
 * normalizePath("foo//bar/../baz") // "foo/baz"
 * normalizePath("foo\\bar\\baz")   // "foo/bar/baz"
 * normalizePath("./foo/./bar/")    // "foo/bar"
 * normalizePath("/")               // "/"
 * normalizePath("")               // "."
 */
export function normalizePath(str: string): string {
  // unicode NFC normalization
  let path = str.normalize("NFC");

  // convert backslashes to forward slashes (Windows compatibility)
  path = path.replace(/\\/g, "/");

  // collapse multiple consecutive slashes (preserve leading "//")
  path = path.replace(/(?<!^)\/+/g, "/");

  // resolve "." and ".." segments
  const isAbsolute = path.startsWith("/");
  const segments = path.split("/").filter(Boolean);
  const resolved: string[] = [];

  for (const seg of segments) {
    if (seg === ".") {
    } else if (seg === "..") {
      if (resolved.length > 0 && resolved[resolved.length - 1] !== "..") {
        resolved.pop();
      } else if (!isAbsolute) {
        resolved.push("..");
      }
    } else {
      resolved.push(seg);
    }
  }

  // remove trailing slash (except root "/")
  let result = (isAbsolute ? "/" : "") + resolved.join("/");

  if (result === "") {
    result = ".";
  }

  return result;
}
