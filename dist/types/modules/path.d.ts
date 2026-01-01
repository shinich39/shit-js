/**
 * @example
 * joinPaths("./project/", "abc", "./package.json"); // "project/abc/package.json"
 */
export declare function joinPaths(...args: string[]): string;
/**
 * @example
 * getBaseName("./project/package.json"); // "package.json"
 * getBaseName("./project/package.json", ".json"); // "package"
 */
export declare function getBaseName(str: string, suffix?: string): string;
/**
 * @example
 * getExtName("./project/package.json"); // ".json"
 */
export declare function getExtName(str: string): string;
/**
 * @example
 * getDirName("./project/package.json"); // "./project"
 */
export declare function getDirName(str: string): string;
/**
 * @example
 * getRelativePath("./project/", "./package.json"); // "../package.json"
 */
export declare function getRelativePath(from: string, to: string): string;
/**
 * @example
 * getRootPath(
 *   "./project/abc/package.json",
 *   "./project/abc/def",
 *   "./project/abc/def/package.json",
 *   "./project/abc/def/ghi/package.json",
 *   "./project/abc/ghi/package.json",
 *   "project/abc/def/ghi/package.json",
 * );
 * // "project/abc"
 */
export declare function getRootPath(...args: string[]): string;
//# sourceMappingURL=path.d.ts.map