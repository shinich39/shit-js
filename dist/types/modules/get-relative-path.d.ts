/**
 * @param from dir
 * @param to dir or file
 * @example
 * getRelativePath("./project/", "./package.json"); // "../package.json"
 * getRelativePath("./project/abc", "./project/def/file.json"); // "../def/file.json"
 * getRelativePath("./project/abc", "./project/abc/def/file.json"); // "def/file.json"
 */
export declare function getRelativePath(from: string, to: string): string;
//# sourceMappingURL=get-relative-path.d.ts.map