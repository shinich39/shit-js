/**
 * @example
 * resolvePath("./project/", "abc", "./package.json"); // "project/abc/package.json"
 * resolvePath("/project/", "abc"); // "/project/abc"
 * resolvePath("/project/", "../abc"); // "/abc"
 * resolvePath("/project/", "..", ".."); // "/"
 * resolvePath("project/", ".."); // ""
 */
export declare function resolvePath(...args: string[]): string;
/**
 * @example
 * parsePath("./project/abc/package.json");
 * // { dir: "./project/abc", dirs: [".", "project", "abc"], base: "package.json", name: "package", ext: ".json" }
 */
export declare function parsePath(str: string): {
    dir: string;
    dirs: string[];
    base: string;
    name: string;
    ext: string;
};
/**
 * @param from dir
 * @param to dir or file
 * @example
 * getRelativePath("./project/", "./package.json");                 // "../package.json"
 * getRelativePath("./project/abc", "./project/def/file.json");     // "../def/file.json"
 * getRelativePath("./project/abc", "./project/abc/def/file.json"); // "def/file.json"
 */
export declare function getRelativePath(from: string, to: string): string;
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
export declare function getCommonPath(args: string[]): string;
//# sourceMappingURL=path.d.ts.map