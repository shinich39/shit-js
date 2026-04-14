/**
 * @example
 * normalizePath("foo//bar/../baz") // "foo/baz"
 * normalizePath("foo\\bar\\baz")   // "foo/bar/baz"
 * normalizePath("./foo/./bar/")    // "foo/bar"
 * normalizePath("/")               // "/"
 * normalizePath("")               // "."
 */
export declare function normalizePath(str: string): string;
//# sourceMappingURL=normalize-path.d.ts.map