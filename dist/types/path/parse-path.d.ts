/**
 * @example
 * parsePath("./project/abc/package.json");
 * // {
 * //   dir: "./project/abc",
 * //   dirs: [".", "project", "abc"],
 * //   base: "package.json",
 * //   name: "package",
 * //   ext: ".json"
 * // }
 */
export declare function parsePath(str: string): {
    dir: string;
    dirs: string[];
    base: string;
    name: string;
    ext: string;
};
//# sourceMappingURL=parse-path.d.ts.map